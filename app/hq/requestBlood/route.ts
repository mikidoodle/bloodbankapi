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
   * @params {string} type
   * @params {string} token
   * @params {number} units
   * @params {number} months
   * @params {string} contact
   */
  let request = await req.json();
  let { type, token, units, months, contact } = request;
  let envCode = process.env.HQ_TOKEN;

  //check if units and months are numbers
  /*if (isNaN(units) || isNaN(months)) {
    return Response.json({ error: true, message: "Invalid number of units or months." })
  }*/
  if (token === `hq-${envCode}`) {
    let now = new Date();
    //get time 3 months ago as a date object
    let minimumDate = new Date(
      now.getFullYear(),
      now.getMonth() - parseInt(months),
      now.getDate()
    );
    let donors = await getData(
      `SELECT name, notification FROM users WHERE bloodtype = '${type}' AND (lastdonated < '${minimumDate.toISOString()}' OR lastdonated IS NULL);`
    );
    if (donors.length === 0) {
      return Response.json({ error: true, message: "No donors found." });
    } else {
      let messages = [];
      for (let notificationobj of donors) {
        let pushToken = notificationobj.notification;
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(
            `Push token ${pushToken} is not a valid Expo push token`
          );
          continue;
        }
        messages.push({
          to: pushToken,
          subtitle: `Blood Center requires ${units} unit${
            units == 1 ? "" : "s"
          } of ${type} blood.`,
          body: "Please donate if you can.",
          interruptionLevel: "critical",
          data: {
            url: `tel:+91${contact}`,
          },
          sound: {
            critical: true,
            volume: 1,
          },
        });
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
        message: `Identified and notified ${donors.length} donor${
          donors.length == 1 ? "" : "s"
        }.`,
      });
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
