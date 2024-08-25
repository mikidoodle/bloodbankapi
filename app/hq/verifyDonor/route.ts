import { getData } from "../../actions"
import bcrypt from 'bcrypt'
export const dynamic = 'force-static'
export async function POST(
  req: Request
) {
  /**
   * @params {string} token
   * @params {string} uuid
   * @params {string} bloodtype
   */
  let request = await req.json()
  let { token, uuid, bloodtype } = request
  let envCode = process.env.HQ_TOKEN
  if(token === `hq-${envCode}`) {
    uuid = uuid.replace('bloodbank-', '')
    let donor = await getData(`SELECT bloodtype,uuid FROM users WHERE uuid = '${uuid}';`)
    if (donor.length === 0) {
      return Response.json({ error: true, message: "Donor not found" })
    } else {
      let updatedDonor = await getData(`UPDATE users SET bloodtype = '${bloodtype}' WHERE uuid = '${uuid}';`)
      let verifyDonor = await getData(`UPDATE users SET verified = true WHERE uuid = '${uuid}';`)
      let updatedLog = await getData(`UPDATE users SET log = log || '${JSON.stringify({
         x: `v-${bloodtype}`,
         y: new Date().toISOString()
        })}'::jsonb WHERE uuid = '${uuid}';`)
      return Response.json({ error: false, message: "Records updated" })
    }
  } else {
    return Response.json({ error: true, message: "Unauthorized" })
  }
}