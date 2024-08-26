import { getData } from "../actions";
import bcrypt from "bcrypt";
export const dynamic = "force-static";
import shortid from "shortid";
export async function POST(req: Request) {
  /**
   * @params {string} phonenumber
   * @params {string} password
   * @params {string} name
   * @params {string} weight
   * @params {string} height
   * @params {string} age
   * @params {string} bloodtype
   */
  const request = await req.json();

  if (
    !request.phonenumber ||
    !request.password ||
    !request.name ||
    !request.weight ||
    !request.height ||
    !request.age ||
    !request.bloodtype
  ) {
    return Response.json({
      error: true,
      message: `missing ${
        !request.phonenumber
          ? "phonenumber"
          : !request.password
          ? "password"
          : !request.name
          ? "name"
          : !request.weight
          ? "weight"
          : !request.height
          ? "height"
          : !request.age
          ? "age"
          : "bloodtype"
      }`,
    });
  } else if (request.age < 18) {
    return Response.json({
      error: true,
      message: "You must be 18 years or older to sign up",
    });
  }

  let getUserFromUsername = await getData(
    `SELECT * FROM users WHERE phone='${request.phonenumber.toString()}';`
  );
  console.log(getUserFromUsername);
  if (getUserFromUsername.length > 0) {
    return Response.json({ error: true, message: "User already exists" });
  } else {
    console.log(request);
    let password = request.password;
    //let hashedPassword = await bcrypt.hash(password, 10)

    /*CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing unique identifier
    name TEXT NOT NULL,     -- Name field for the user
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    uuid TEXT NOT NULL,
    lastdonated TIMESTAMPTZ,
    sms BOOLEAN,
    notification UUID,
    totaldonated NUMERIC,
    weight NUMERIC,
    height NUMERIC,
    age INTEGER,
    log JSONB,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
 */
    let insertUser = await getData(
      `INSERT INTO users (name, phone, uuid, bloodtype, lastdonated, sms, totaldonated, weight, height, age, verified, otp) VALUES ('${
        request.name
      }', '${request.phonenumber.toString()}', '${shortid.generate()}', '${
        request.bloodtype
      }', NULL, true, ${0}, ${parseInt(request.weight)}, ${parseInt(
        request.height
      )}, ${parseInt(request.age)}, false, null)`
    );
    return Response.json({ error: false, message: "Account created!" });
  }
}
