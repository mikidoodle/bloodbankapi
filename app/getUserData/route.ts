import { getData } from "../actions"
import auth from "../auth";
export const dynamic = 'auto'
export async function POST(
  req: Request
) {
  /**
   * @params {string} uuid,
   * @params {string} token
   */
  if(auth(req) === false) return Response.json({ error: true, message: "Unauthorized" }, {status: 403});
  let request = await req.json()
  let { token } = request
  if (!token) {
    return Response.json({ error: true, message: "User not found" })
  } else {
    let getUserFromToken = await getData(`SELECT name,totaldonated,verified,lastdonated,created_on,log,installed,coords FROM users WHERE uuid='${token}';`)
    if (getUserFromToken.length > 0) {
      //get total donators
      let totalDonators = await getData(`SELECT COUNT(*) FROM users WHERE verified=true;`)
      console.log(getUserFromToken[0])
      return Response.json({ error: false, message: "User found", data: {
        name: getUserFromToken[0].name,
        donated: getUserFromToken[0].totaldonated,
        lastDonated: convertTimestampToShortString(getUserFromToken[0].lastdonated?.toString()),
        totalDonators: totalDonators[0].count,
        donatingSince: convertTimestampToShortString(getUserFromToken[0].created_on?.toString()),
        verified: getUserFromToken[0].verified,
        log: getUserFromToken[0].log,
        installed: getUserFromToken[0].installed,
        coords: getUserFromToken[0].coords
      } })
      
    } else {
      return Response.json({ error: true, message: "User not found" })
    }
  }
}

function convertTimestampToShortString(timestamp: string) {
  if (timestamp?.toString().trim() === "" || timestamp === undefined || timestamp === null
) return "Never"
  let date = new Date(timestamp)
  let month = date.toLocaleString('default', { month: 'short' })
  let year = date.getFullYear().toString().substring(2)
  return `${month} '${year}`
}