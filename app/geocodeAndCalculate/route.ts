import { getData } from "../actions";
export const dynamic = "auto";
import shortid from "shortid";
import auth from "../auth";
export async function POST(req: Request) {
  /**
   * @params {string} address
   * @params {string} uuid
   */
  let request = await req.json();
  let { address, uuid } = request;
  if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" }, {status: 403});
  let shortuuid = uuid === "" ? shortid.generate() : uuid;
  console.log("address", address);
  let userGeocodeCount = 0;
  if(uuid !== "") {
    let getLookup = await getData(`SELECT reqs FROM localups WHERE uuid='${uuid}';`);
    if(getLookup[0].reqs >= 25) {
      return Response.json({
        error: true,
        message: "ratelimit"
      });
    } else {
      userGeocodeCount = getLookup[0].reqs;
    }
  }
  let geocodeRequest = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GEOCODE_API_KEY}`
  ).catch((e) => {
    console.log("error", e);
    return Response.json({
      error: true,
      message: "Error fetching geocode",
      data: e,
    });
  });
  let geocodeResponse = await geocodeRequest.json();
  if (geocodeResponse.status !== "OK") {
    console.log('geocode error moment. check it out:')
    console.log(geocodeResponse)
    return Response.json({
      error: true,
      message: "We were unable to locate the address you provided",
    });
  } else {
    let geocodedResult = geocodeResponse.results[0];
    console.log(geocodedResult);
    let lat = geocodedResult.geometry.location.lat;
    let lng = geocodedResult.geometry.location.lng;
    let formattedAddress = geocodedResult.formatted_address;
    let distance = calcCrow({ latitude: lat, longitude: lng });
    console.log(distance);

    if (uuid !== "") {
      console.log(
        `EXP: loc (${lat},${lng}) updated for ${shortuuid}\n distance: ${distance}`
      );
      let updateLocation = await getData(
        `UPDATE localups SET loc='${lat},${lng}', reqs=${userGeocodeCount + 1} WHERE uuid='${shortuuid}';`
      );
    } else {
      console.log(
        `EXP: loc (${lat},${lng}) saved to ${shortuuid}\n distance: ${distance}`
      );
      let updateLocation = await getData(
        `INSERT INTO localups (uuid, loc, reqs) VALUES ('${shortuuid}', '${lat},${lng}', 0);`
      );
    }
    console.log(lat, lng);
    return Response.json({
      error: false,
      message: "Location found",
      data: {
        distance: distance,
        uuid: shortuuid,
        formattedAddress: formattedAddress,
      },
    });
  }
}

function calcCrow(region: { latitude: number; longitude: number }) {
  let lat = region.latitude;
  let lon = region.longitude;
  let bbLat = 11.953852;
  let bbLon = 79.797765;
  var R = 6371; // km
  var dLat = toRad(bbLat - lat);
  var dLon = toRad(bbLon - lon);
  var lat1 = toRad(lat);
  var lat2 = toRad(bbLat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}
function toRad(v: number) {
  return (v * Math.PI) / 180;
}
