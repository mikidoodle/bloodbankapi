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

  phone = phone.replace(/\s/g, "");
  phone = phone.replace("+91", "");
  
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
      `SELECT uuid FROM users WHERE phone = '${phone}';`
    );
    if (checkIFUserExists.length === 0) {
      if (allowSignup) {
        let otp = Math.floor(1000 + Math.random() * 9000);
        let sendOTPRecord = await sendOTP(phone, otp).catch((err) => {
          return Response.json({ error: true, message: "Error sending OTP" });
        });
        console.log(sendOTPRecord.sid);
        return Response.json({ error: false, otp: otp });
      } else {
        return Response.json({ error: true, message: "User not found" });
      }
    } else {
      console.log("User exists");
      let otp = Math.floor(1000 + Math.random() * 9000);
      let sendOTPRecord = await sendOTP(phone, otp).catch((err) => {
        return Response.json({ error: true, message: "Error sending OTP" });
      });
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
  //sanitise phone number
  //remove spaces, country code
  console.log(phone)
  let send = await client.messages.create({
    body: `Thank you for signing up with JIPMER Blood Bank! Your OTP is ${otp}`,
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
