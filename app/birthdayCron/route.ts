import { getData } from "../actions";
import bcrypt from "bcrypt";
export const dynamic = "auto";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export async function POST(req: Request) {
  /**
   * @params {string} token
   */
  let request = await req.json();
  let { token } = request;
  let envCode = process.env.HQ_TOKEN;
  if (token === `hq-${envCode}`) {
    let now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const prompt = `SELECT name, phone, notification
  FROM users
  WHERE EXTRACT(MONTH FROM dob) = ${month}
    AND EXTRACT(DAY FROM dob) = ${day}; AND installed = true`;

    console.log(prompt);
    let donors = await getData(prompt);
    console.log(donors);
    if (donors.length === 0) {
      return Response.json({ error: true, message: "No donors found." });
    } else {
      let messages: ExpoPushMessage[] = [];
      let sent = 0;
      for (let notificationobj of donors) {
        let pushToken = notificationobj.notification;
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(
            `Push token ${pushToken} is not a valid Expo push token`
          );
          let sendOTPRecord = await sendSMS(
            notificationobj.phone,
            notificationobj.name
          )
            .then((res) => {
              sent = sent + 1;
            })
            .catch((err) => {
              console.warn("Error pushing notif: ", err);
            });
          continue;
        }
        messages.push({
          to: pushToken,
          subtitle: `Happy Birthday, ${notificationobj.name}! 🎉`,
          body: "Celebrate your birthday by donating blood at the JIPMER Blood Center today!",
          priority: "normal",
          data: {
            url: `tel:+914132296666`,
          },
          sound: {
            critical: false,
            name: "default",
            volume: 1,
          },
        });
        sent = sent + 1;
      }

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
      return Response.json({
        error: false,
        message: `identified and notified ${sent} donor${
          sent == 1 ? "" : "s"
        }!`,
      });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}

async function sendSMS(phone: string, name: string) {
  //sanitise phone number
  //remove spaces, country code
  phone = phone.replace(/\s/g, "");
  phone = phone.replace("+91", "");
  let send = await client.messages.create({
    body: `Happy Birthday ${name}! Celebrate your birthday by donating blood at the JIPMER Blood Center today!`,
    from: `+16467987493`,
    to: `+91${phone}`,
  });
  console.log(send);
  try {
    return send;
  } catch (err) {
    return err;
  }
}
