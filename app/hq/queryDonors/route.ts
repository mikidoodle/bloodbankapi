import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {number} months
   * @params {boolean} verified
   * @params {string} bloodtype
   * @params {number} distance
   * @params {boolean} affiliated
   * @params {boolean} unverified
   * @params {boolean} name
   */
  let request = await req.json();
  let { token, months, verified, bloodtype, distance, affiliated, name } =
    request;
  let envCode = process.env.HQ_TOKEN;
  let initialTimestamp = new Date();
  if (token === `hq-${envCode}`) {
    if (request.unverified === true) {
      let queryString = `SELECT name,uuid,verified,bloodtype,distance,affiliated,phone,lastdonated,totaldonated,dob,sex FROM users where verified=false`;
      let users = await getData(queryString);
      let finalTimestamp = new Date();
      let elapsed = finalTimestamp.getTime() - initialTimestamp.getTime();
      return Response.json({ data: users, time: isNaN(elapsed) ? 0 : elapsed }); 
    }
    let whereHasBeenUsed = false;
    let queryString = `SELECT name,uuid,verified,bloodtype,distance,affiliated,phone,lastdonated,totaldonated,dob,sex FROM users ${
      verified == true ? "WHERE verified = true" : ""
    } ${
      affiliated
        ? `${verified === true ? "AND" : "WHERE"} affiliated = true`
        : ""
    }`;
    if (months?.trim() != "") {
      let date = new Date();
      date.setMonth(date.getMonth() - months);
      queryString += ` ${
        verified === true || whereHasBeenUsed ? "AND" : "WHERE"
      } (lastdonated < '${date.toISOString()}' OR lastdonated IS NULL)`;

      if (verified === false) {
        whereHasBeenUsed = true;
      }
    }

    if (distance?.trim() != "") {
      queryString += ` ${
        verified === true || whereHasBeenUsed === true ? "AND" : "WHERE"
      } distance < ${distance}`;

      if (verified === false) {
        whereHasBeenUsed = true;
      }
    }

    if (bloodtype?.trim() != "") {
      queryString += ` ${
        verified === true || whereHasBeenUsed === true ? "AND" : "WHERE"
      } bloodtype = '${bloodtype}'`;

      if (verified === false) {
        whereHasBeenUsed = true;
      }
    }
    if (name?.trim() != "") {
      queryString += ` ${
        verified === true || whereHasBeenUsed === true ? "AND" : "WHERE"
      } name ILIKE '%${name}%' OR phone ILIKE '%${name}%'`;

      if (verified === false) {
        whereHasBeenUsed = true;
      }
    }
    queryString += ` ORDER BY distance ASC`;
    console.log(queryString);

    let users = await getData(queryString);
    console.log(users);
    let finalTimestamp = new Date();
    console.log(
      `Query took ${finalTimestamp.getTime() - initialTimestamp.getTime()}ms`
    );
    let timetaken = finalTimestamp.getTime() - initialTimestamp.getTime();
    return Response.json({ data: users, time: isNaN(timetaken) ? 0 : timetaken });
  } else {
    return Response.json({ error: true, message: "Unauthorized Access" });
  }
}
