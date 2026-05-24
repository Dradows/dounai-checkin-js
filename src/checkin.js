import { serializeCookie } from "./cookie.js";
import { parseJsonResponse, request } from "./http.js";
import { login } from "./login.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function refreshCookie(cookie, config) {
  const expireIn = Number(cookie.expireIn || 0);
  const now = Math.floor(Date.now() / 1000);

  if (expireIn - now > 120) {
    return cookie;
  }

  return login(config.dounaiUrl, config.email, config.password);
}

export async function checkin(cookie, config) {
  const checkinUrl = new URL("/user/checkin", config.dounaiUrl).toString();
  const response = await request(checkinUrl, {
    method: "POST",
    timeoutMs: 15000,
    headers: {
      Cookie: serializeCookie(cookie)
    }
  });

  const ret = parseJsonResponse(response.body, "checkin");
  return ret.msg || "";
}

export async function tryCheckin(cookie, config) {
  const delays = [0, 8000, 8000];
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (delays[attempt] > 0) {
      await sleep(delays[attempt]);
    }

    try {
      return await checkin(cookie, config);
    } catch (error) {
      lastError = error;
      console.error(`checkin attempt ${attempt + 1} failed: ${error.message}`);
    }
  }

  throw lastError;
}
