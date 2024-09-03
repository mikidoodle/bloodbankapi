import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {string} uuid
   */

  let request = await req.json();
  let { token, uuid } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    uuid = uuid.replace("bloodbank-", "");
    let donor = await getData(
      `SELECT name,phone,bloodtype,lastdonated,totaldonated,dob,verified FROM users WHERE uuid = '${uuid}';`
    );
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" });
    } else {
      return Response.json({
        error: false,
        message: "Donor found",
        data: donor[0],
      });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
