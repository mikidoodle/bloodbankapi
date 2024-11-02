import auth from "@/app/auth";
import { getData } from "../../actions";
export const dynamic = "force-static";
export async function POST(req: Request) {
  /**
   * @params {string} loginCode
   */
  //
  //auth
  if(auth(req.headers.get("User-Agent") || "") === false) return Response.json({ error: true, message: "Unauthorized" });
  let request = await req.json();
  let { loginCode } = request;
  let envCode = process.env.HQ_TOKEN;
  console.log(`loginCode: ${loginCode}`);
  if (loginCode === `hq-${envCode}`) {
    /**
     * return:
     * totaldonors:
     * totaldonated:
     */
    let totalDonators = await getData(
      `SELECT verified FROM users;`
    );
    let totalDonated = await getData(`SELECT SUM(totaldonated) FROM users;`);
    return Response.json({
      error: false,
      message: "Login successful",
      data: {
        totalDonors: totalDonators,
        totalDonated: totalDonated[0].sum,
      },
    });
  } else {
    return Response.json({ error: true, message: "Unauthorized" });
  }
}
