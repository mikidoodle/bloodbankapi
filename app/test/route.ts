import { getData } from "../actions";
import bcrypt from "bcrypt";
import auth from "../auth";
import { userAgent } from "next/server";
export const dynamic = "auto";
export async function GET(req: Request) {
    if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" }, {status: 403});
    return Response.json({ error: false, message: "Hello, world!" });
}
