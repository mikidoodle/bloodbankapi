import { log } from "console";
import { getData } from "../../actions";
import bcrypt from "bcrypt";
import auth from "@/app/auth";
export const dynamic = "auto";
export async function POST(req: Request) {
  /**
   * @params {string} loginCode
   */
  //
  if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" }, {status: 403});
  let request = await req.json();
  let { loginCode } = request;
  let envCode: any = process.env.HQ_SECRET;
  if (loginCode === envCode) {
    let uuid = process.env.HQ_TOKEN;
    return Response.json({
      error: false,
      message: "Login successful",
      token: uuid,
    });
  } else {
    return Response.json({ error: true, message: "Incorrect code." });
  }
}
