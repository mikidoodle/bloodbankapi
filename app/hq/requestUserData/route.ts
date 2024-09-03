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
  let { token,uuid } = request;
  let envCode = process.env.HQ_TOKEN;
  console.log(`loginCode: ${token}`);
  if (token === `hq-${envCode}`) {
    let donor = await getData(`SELECT * FROM users WHERE uuid = '${uuid}';`);
    return Response.json({ data: donor[0] });
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
