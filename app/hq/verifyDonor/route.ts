import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: false, // this can be set to true in order to use the FCM v1 API
});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {string} uuid
   * @params {string} bloodtype
   * @params {string} conditions
   * @params {string} medications
   */
  let request = await req.json();
  let { token, uuid, bloodtype,conditions,medications } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    uuid = uuid.replace("bloodbank-", "");
    let donor = await getData(
      `SELECT bloodtype,uuid,phone FROM users WHERE uuid = '${uuid}';`
    );
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" });
    } else {
      let updatedDonor = await getData(
        `UPDATE users SET bloodtype = '${bloodtype}' WHERE uuid = '${uuid}';`
      );
      let verifyDonor = await getData(
        `UPDATE users SET verified = true WHERE uuid = '${uuid}';`
      );
      let updatedLog = await getData(
        `UPDATE users SET log = log || '${JSON.stringify({
          x: `v-${bloodtype}`,
          y: new Date().toISOString(),
        })}'::jsonb WHERE uuid = '${uuid}';`
      );
      if(conditions.trim() != "") {
        let updatedConditions = await getData(
          `UPDATE users SET conditions = ${conditions}' WHERE uuid = '${uuid}';`
        );
      }
      if(medications.trim() != "") {
        let updatedMedications = await getData(
          `UPDATE users SET medications = '${medications}' WHERE uuid = '${uuid}';`
        );
      }
      let send = await client.messages.create({
        body: `You've been verified as a donor for blood type ${bloodtype}! Please contact the JIPMER blood bank if there are any issues.`,
        from: `+16467987493`,
        to: `+91${donor[0].phone}`,
      });
      console.log(send);
      return Response.json({ error: false, message: "Records updated" });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
