import auth from "@/app/auth";
import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {string} uuid
   */
  if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" });
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  let request = await req.json();
  let { token, uuid } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    uuid = uuid.replace("bloodbank-", "");
    let donor = await getData(
      `SELECT phone FROM users WHERE uuid = '${uuid}';`
    );
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" });
    }
    try {
      let updatedDonor = await getData(
        `DELETE FROM users WHERE uuid = '${uuid}';`
      );
      let send = await client.messages.create({
        body: `Your request for blood donation has been rejected. Please contact JIPMER blood bank for more information.`,
        from: `+16467987493`,
        to: `+91${donor[0].phone}`,
      }).catch(() => {
        return Response.json({
          error: true,
          message: "Error sending rejection SMS"
        });
      })
      return Response.json({ error: false, message: "Records updated" });
    } catch (err) {
      return Response.json({
        error: false,
        message: `Error sending rejection SMS.`,
      });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
