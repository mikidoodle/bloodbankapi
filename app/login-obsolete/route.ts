import { getData } from "../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
export async function POST(req: Request) {
  let request = await req.json();
  let getUserFromUsername = await getData(
    `SELECT * FROM users WHERE phone='${request.phonenumber}'`
  );
  if (getUserFromUsername.length === 0) {
    return Response.json({ error: true, message: "User not found" });
  } else {
    let user = getUserFromUsername[0];
    let password = request.password;
    let hashedPassword = user.password;
    let isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (isPasswordCorrect) {
      return Response.json({
        error: false,
        token: user.uuid,
        message: "Login successful",
      });
    } else {
      return Response.json({ error: true, message: "Password is incorrect" });
    }
  }
}
