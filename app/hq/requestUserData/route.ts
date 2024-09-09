import { log } from "console";
import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {string} uuid
   */
  //
  //auth
  let request = await req.json();
  let { token, uuid } = request;
  let envCode = process.env.HQ_TOKEN;
  console.log(`loginCode: ${token}`);
  if (token === `hq-${envCode}`) {
    uuid = uuid.replace("bloodbank-", "");
    let donor = await getData(`SELECT * FROM users WHERE uuid = '${uuid}';`);
    console.log(uuid)
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" });
    } else {
      console.log(donor[0]);
      return Response.json({ data: donor[0] });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
