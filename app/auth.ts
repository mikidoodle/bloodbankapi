import { userAgent } from "next/server";
export default function auth(request: Request) {
  let requiredIOSUserAgent = process.env.IOS_USER_AGENT || "---";
  let requiredAndroidUserAgent = process.env.AND_USER_AGENT || "---";
  let useragent = userAgent(request);
  console.log("User-Agent: ", useragent);
  if ((useragent.ua.startsWith(requiredIOSUserAgent) || useragent.ua.startsWith(requiredAndroidUserAgent)) && !useragent.isBot) {
    return true
  } else {
    console.log("Forbidden request from ", useragent.ua);
    return false
  }
}