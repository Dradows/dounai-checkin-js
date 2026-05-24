export function parseSetCookie(setCookieHeaders = []) {
  const headers = Array.isArray(setCookieHeaders)
    ? setCookieHeaders
    : [setCookieHeaders];

  const cookie = {};

  for (const header of headers) {
    if (!header) {
      continue;
    }

    const [pair] = String(header).split(";");
    const index = pair.indexOf("=");
    if (index <= 0) {
      continue;
    }

    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    cookie[name] = value;
  }

  return {
    uid: cookie.uid || "",
    email: cookie.email || "",
    key: cookie.key || "",
    ip: cookie.ip || "",
    expireIn: Number.parseInt(cookie.expire_in || "0", 10)
  };
}

export function serializeCookie(cookie) {
  const expireIn = Number.isFinite(cookie.expireIn) ? String(cookie.expireIn) : "0";

  return [
    ["uid", cookie.uid],
    ["ip", cookie.ip],
    ["key", cookie.key],
    ["email", cookie.email],
    ["expire_in", expireIn]
  ]
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");
}
