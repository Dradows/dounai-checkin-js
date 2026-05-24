import { parseSetCookie } from "./cookie.js";
import { parseJsonResponse, request } from "./http.js";

const SUCCESS_RET_CODE = 1;

export async function login(dounaiUrl, email, password) {
  const loginUrl = new URL("/auth/login", dounaiUrl).toString();
  const form = new URLSearchParams();
  form.set("email", email);
  form.set("passwd", password);

  const response = await request(loginUrl, {
    method: "POST",
    body: form.toString(),
    timeoutMs: 10000,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const ret = parseJsonResponse(response.body, "login");
  if (ret.ret !== SUCCESS_RET_CODE) {
    throw new Error(`${loginUrl} returned ret=${ret.ret}, msg=${ret.msg || ""}`);
  }

  const cookie = parseSetCookie(response.headers["set-cookie"] || []);
  if (!cookie.uid || !cookie.key) {
    throw new Error("Login succeeded but required cookies were missing");
  }

  return cookie;
}
