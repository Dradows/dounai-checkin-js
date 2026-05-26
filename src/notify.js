import crypto from "node:crypto";
import { request } from "./http.js";

/**
 * 对 webhook URL 进行加签，追加 timestamp 和 sign 参数
 */
function signWebhook(webhookUrl, secret) {
  if (!secret) {
    return webhookUrl;
  }
  const timestamp = String(Date.now());
  const stringToSign = `${timestamp}\n${secret}`;
  const sign = crypto.createHmac("sha256", secret).update(stringToSign).digest("base64");
  const separator = webhookUrl.includes("?") ? "&" : "?";
  return `${webhookUrl}${separator}timestamp=${encodeURIComponent(timestamp)}&sign=${encodeURIComponent(sign)}`;
}

/**
 * 发送钉钉机器人通知
 * @param {string} webhookUrl - 钉钉机器人 webhook 地址
 * @param {string} secret     - 加签密钥（可选）
 * @param {string} title      - 消息标题
 * @param {string} text       - markdown 格式的消息正文
 */
export async function sendDingTalk(webhookUrl, secret, title, text) {
  if (!webhookUrl) {
    return;
  }

  try {
    const url = signWebhook(webhookUrl, secret);
    const body = JSON.stringify({
      msgtype: "markdown",
      markdown: {
        title,
        text
      }
    });

    const response = await request(url, {
      method: "POST",
      timeoutMs: 10000,
      headers: {
        "Content-Type": "application/json"
      },
      body
    });

    const ret = JSON.parse(response.body);
    if (ret.errcode !== 0) {
      console.error(`钉钉通知发送失败: errcode=${ret.errcode}, errmsg=${ret.errmsg || ""}`);
    } else {
      console.log("钉钉通知发送成功");
    }
  } catch (error) {
    console.error(`钉钉通知发送异常: ${error.message}`);
  }
}
