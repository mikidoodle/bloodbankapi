import { getData } from "../actions";
import auth from "../auth";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} uuid,
   * @params {string} distance
   */
  if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" });
  let request = await req.json();
  let { uuid, distance, coords, lookupid } = request;
  console.log(`EXP: ${uuid} is ${distance} km away, coords/address: ${coords}`);
  if (!uuid) {
    return Response.json({ error: true, message: "User not found" });
  } else {
    let user = await getData(
      `SELECT installed,uuid FROM users WHERE uuid = '${uuid}';`
    );
    if (user.length > 0) {
      await getData(
        `UPDATE users SET distance = '${distance}' WHERE uuid = '${uuid}';`
      );
      await getData(
        `UPDATE users SET coords = '${coords}' WHERE uuid = '${uuid}';`
      );
      if (user[0].installed === false) {
        await getData(
          `UPDATE users SET installed = true WHERE uuid = '${uuid}';`
        );
      }
      if (lookupid !== "") {
        await getData(
          `DELETE FROM localups WHERE uuid = '${lookupid}';`
        );
      }
      return Response.json({ error: false, message: "Distance updated!" });
    } else {
      return Response.json({ error: true, message: "User not found" });
    }
  }
}

function convertTimestampToShortString(timestamp: string) {
  if (
    timestamp?.toString().trim() === "" ||
    timestamp === undefined ||
    timestamp === null
  )
    return "Never";
  let date = new Date(timestamp);
  let month = date.toLocaleString("default", { month: "short" });
  let year = date.getFullYear().toString().substring(2);
  return `${month} '${year}`;
}
