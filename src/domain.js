import { request } from "./http.js";

export async function getDomainUrl() {
  return `https://dounai.pro/`;
  const response = await request("https://doubledou.win/", {
    method: "GET",
    timeoutMs: 15000
  });

  const match = response.body.match(/<h1>(.*?)<\/h1>/i);
  if (!match) {
    throw new Error("Could not find dounai domain in doubledou response");
  }

  const host = match[1].replaceAll("新地址", "").trim();
  if (!host) {
    throw new Error("Dounai domain is empty in doubledou response");
  }

  return `https://${host}`;
}
