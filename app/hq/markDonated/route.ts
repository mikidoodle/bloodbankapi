import { getData } from "../../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
import { Expo, ExpoPushTicket } from "expo-server-sdk";
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: false, // this can be set to true in order to use the FCM v1 API
});
export async function POST(req: Request) {
  /**
   * @params {string} token
   * @params {string} uuid
   */
  let request = await req.json();
  let { token, uuid, bloodtype } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    uuid = uuid.replace("bloodbank-", "");
    let donor = await getData(
      `SELECT name,phone,totaldonated,notification,bloodtype FROM users WHERE uuid = '${uuid}';`
    );
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" });
    } else {
      const now = new Date();
      let updatedLog = await getData(
        `UPDATE users SET log = log || '${JSON.stringify({
          x: `d-${donor[0].bloodtype}`,
          y: now.toISOString(),
        })}'::jsonb WHERE uuid = '${uuid}';`
      );
      //update last donated
      let updatedDonor = await getData(
        `UPDATE users SET lastdonated = '${now.toISOString()}' WHERE uuid = '${uuid}';`
      );
      //add to total donated
      let newTotal = donor[0].totaldonated + 1;
      let updatedTotal = await getData(
        `UPDATE users SET totaldonated = ${newTotal} WHERE uuid = '${uuid}';`
      );
      //notification
      let messages = [];
      let pushToken = donor[0].notification;
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return Response.json({ error: false, message: "Records updated" });
      }
      messages.push({
        to: pushToken,
        subtitle: `Thank you for donating, ${donor[0].name.split(" ")[0]}!`,
        body: "",
        interruptionLevel: "critical",
        sound: {
          critical: true,
          volume: 1,
        },
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets: ExpoPushTicket[] = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
      return Response.json({ error: false, message: "Records updated" });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
