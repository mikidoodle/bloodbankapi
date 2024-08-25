import { getData } from "../actions"
export const dynamic = 'force-static'
export async function POST(
  req: Request
) {
  /**
   * @params {string} uuid
   * @params {string} notificationToken
   */
  let request = await req.json()
  let { uuid, notificationToken } = request
  let donor = await getData(`SELECT * FROM users WHERE uuid = '${uuid}';`)
  if (donor.length === 0) {
    return Response.json({ error: true, message: "Donor not found" })
  } else {
    await getData(`UPDATE users SET notification= '${notificationToken}' WHERE uuid = '${uuid}';`)
    return Response.json({ error: false, message: "Notifications are enabled!" })
  }
}