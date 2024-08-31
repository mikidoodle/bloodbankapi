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
   */
  let request = await req.json();
  let { token, months, verified, bloodtype, distance, affiliated } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    let queryString = `SELECT name,uuid,verified,bloodtype,distance,affiliated,phone,lastdonated,totaldonated,dob,sex FROM users WHERE verified=${verified} AND affiliated = ${affiliated}`;
    if (months?.trim() != "") {
      let date = new Date();
      date.setMonth(date.getMonth() - months);
      queryString += ` AND lastdonated > '${date.toISOString()} OR lastdonated IS NULL'`;
    }

    if (distance?.trim() != "") {
      queryString += ` AND distance < ${distance}`;
    }
    console.log(queryString);
    let users = await getData(queryString);
    return Response.json({ data: users });
  } else {
    return Response.json({ error: true, message: "Unauthorized Access" });
  }
}
