import { userAgent } from "next/server";
export default function auth(request: Request) {
  let requiredUserAgent = process.env.USER_AGENT || "---";
  let useragent = userAgent(request);
  console.log("User-Agent: ", useragent);
  if (useragent) {
    return true
  } else {
    console.log("Forbidden request from ", useragent);
    return false
  }
}