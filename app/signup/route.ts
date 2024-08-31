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

  let getUserFromUsername = await getData(
    `SELECT uuid FROM users WHERE phone='${request.phonenumber.toString()}';`
  );
  console.log(getUserFromUsername);
  if (getUserFromUsername.length > 0) {
    return Response.json({ error: true, message: "User already exists" });
  } else {
    console.log(request);
    /*
1   birthdayhero	boolean
2	  verified	boolean [DONE]
3	  log	ARRAY [DONE]
4	  otp	integer [DONE]
5	  affiliated	boolean
6   affiliatedata	jsonb
7	  dob	TIMESTAMPTZ [DONE]
8	  distance	numeric
9	  id integer [DONE]
10	lastdonated	TIMESTAMPTZ [DONE]
11	sms	boolean [DONE]
12	totaldonated	numeric [DONE]
13	weight	numeric [DONE]
14	height	numeric [DONE]
15	created_on	TIMESTAMPTZ [DONE]
16	name	TEXT [DONE]
17	phone	TEXT [DONE]
18	bloodtype	TEXT [DONE]
19	uuid	TEXT [DONE]
20	sex	VARCHAR
21	medications	TEXT[]
22	notification	TEXT
23	conditions	TEXT[]
);
 */
    let insertUser = await getData(
      `INSERT INTO users (name, phone, uuid, bloodtype, lastdonated, sms, totaldonated, weight, height, dob, verified, otp, birthdayhero, affiliated, affiliatedata, distance, sex, medications, conditions ) VALUES ('${
        request.name
      }' , '${request.phonenumber.toString()}', '${shortid.generate()}', '${
        request.bloodtype
      }', NULL, true, ${0}, ${parseInt(request.weight)}, ${parseInt(
        request.height
      )}, '${request.dob}', false, null, ${request.birthdayhero}, ${
        request.affiliated
      }, '${request.affiliatedata}', ${request.distance}, '${request.sex}', '${
        request.medications
      }', '${request.conditions}') returning name,phone,uuid;`
    );
    console.log(insertUser)
    return Response.json({ error: false, message: "Account created!", data: insertUser[0] });
  }
}
