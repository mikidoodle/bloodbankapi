import { getData } from "../actions";
import bcrypt from "bcrypt";
import auth from "../auth";
import { userAgent } from "next/server";
export const dynamic = "force-static";
export async function GET(req: Request) {
    const { device } = userAgent(req)
  console.log(userAgent(req))
    if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" });
    return Response.json({ error: false, message: "Hello, world!" });
}
