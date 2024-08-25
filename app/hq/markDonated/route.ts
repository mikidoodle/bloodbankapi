import { getData } from "../../actions"
import bcrypt from 'bcrypt'
export const dynamic = 'force-static'
export async function POST(
  req: Request
) {
  /**
   * @params {string} token
   * @params {string} uuid
   */
  let request = await req.json()
  let { token, uuid, bloodtype } = request
  let envCode = process.env.HQ_TOKEN
  if(token === `hq-${envCode}`) {
    uuid = uuid.replace('bloodbank-', '')
    let donor = await getData(`SELECT name,phone,totaldonated FROM users WHERE uuid = '${uuid}';`)
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" })
    } else {
      const now = new Date()
      let updatedLog = await getData(`UPDATE users SET log = log || '${JSON.stringify({
         x: `d-${bloodtype}`,
         y: now.toISOString()
        })}'::jsonb WHERE uuid = '${uuid}';`)
        //update last donated
      let updatedDonor = await getData(`UPDATE users SET lastdonated = '${now.toISOString()}' WHERE uuid = '${uuid}';`)
      //add to total donated
      let newTotal = donor[0].totaldonated + 1
      let updatedTotal = await getData(`UPDATE users SET totaldonated = ${newTotal} WHERE uuid = '${uuid}';`)
      return Response.json({ error: false, message: "Records updated" })
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" })
  }
}