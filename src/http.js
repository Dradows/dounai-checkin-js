import http from "node:http";
import https from "node:https";

// 共享 keepAlive Agent，确保同一 host 的多个请求复用 TCP 连接（避免 IP 不一致）
const agents = new Map();

function getAgent(isHttps) {
  const key = isHttps ? "https" : "http";
  if (!agents.has(key)) {
    const mod = isHttps ? https : http;
    agents.set(key, new mod.Agent({ keepAlive: true }));
  }
  return agents.get(key);
}

export function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const isHttps = target.protocol === "https:";
    const body = options.body || null;

    const req = (isHttps ? https : http).request(
      target,
      {
        agent: getAgent(isHttps),
        method: options.method || "GET",
        headers: {
          ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
          ...(options.headers || {})
        },
        timeout: options.timeoutMs || 15000,
        rejectUnauthorized: options.rejectUnauthorized ?? false
      },
      (res) => {
        const chunks = [];

        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8")
          });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error(`Request timed out: ${url}`));
    });
    req.on("error", reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

export function parseJsonResponse(body, context) {
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`${context} returned invalid JSON: ${error.message}`);
  }
}
