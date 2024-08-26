import { log } from "console";
import { getData } from "../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export async function POST(req: Request) {
  /**
   * @params {string} phone
   * @params {boolean} allowSignup
   * @params {boolean} intentVerifyOTPlogin
   */
  //
  let request = await req.json();
  let {
    phone,
    allowSignup,
    intentVerifyOTPlogin,
    userEnteredOTP,
  }: {
    phone: string;
    allowSignup: boolean;
    intentVerifyOTPlogin: boolean;
    userEnteredOTP: string;
  } = request;

  if (intentVerifyOTPlogin) {
    let checkIFUserExists = await getData(
      `SELECT phone,otp,uuid FROM users WHERE phone = '${phone}';`
    );
    if (checkIFUserExists.length === 0) {
      return Response.json({ error: true, message: "User not found" });
    } else {
      console.log(checkIFUserExists[0].otp, userEnteredOTP);
      if (checkIFUserExists[0].otp === parseInt(userEnteredOTP)) {
        return Response.json({
          error: false,
          message: "OTP verified",
          uuid: checkIFUserExists[0].uuid,
        });
      } else {
        return Response.json({ error: true, message: "OTP incorrect" });
      }
    }
  } else {
    let checkIFUserExists = await getData(
      `SELECT * FROM users WHERE phone = '${phone}';`
    );
    if (checkIFUserExists.length === 0) {
      if (allowSignup) {
        let otp = Math.floor(1000 + Math.random() * 9000);
        let sendOTPRecord = await sendOTP(phone, otp);
        console.log(sendOTPRecord.sid);
        return Response.json({ error: false, otp: otp });
      } else {
        return Response.json({ error: true, message: "User not found" });
      }
    } else {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let sendOTPRecord = await sendOTP(phone, otp);
      let setOTPRecord = getData(
        `UPDATE users SET otp = '${otp}' WHERE phone = '${phone}';`
      );
      return Response.json({
        error: false,
        message: "OTP sent",
        otpSent: true,
      });
    }
  }
}

async function sendOTP(phone: string, otp: number) {
  let send = await client.messages.create({
    body: `Thank you for signing up with JIPMER Blood Bank! Your OTP is ${otp}`,
    from: `+16467987493`,
    to: `+91${phone}`,
  });
  console.log(send.sid);
  return send.sid;
}
