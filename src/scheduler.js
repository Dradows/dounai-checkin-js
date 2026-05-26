import { getDomainUrl } from "./domain.js";
import { login } from "./login.js";
import { tryCheckin } from "./checkin.js";
import { sendDingTalk } from "./notify.js";

function now() {
  return new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
}

export async function startAutoCheckin(config) {
  const startTime = now();
  console.log(`[${startTime}] 开始自动签到`);

  const dounaiUrl = await getDomainUrl();
  const runtimeConfig = {
    ...config,
    dounaiUrl
  };

  const cookie = await login(runtimeConfig.dounaiUrl, runtimeConfig.email, runtimeConfig.password);
  console.log(`login success, dounaiUrl=${runtimeConfig.dounaiUrl}`);
  console.log(`cookie: ${JSON.stringify(cookie, null, 2)}`);

  // 暂停 10 秒
  console.log("等待 10 秒后执行签到...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  let msg;
  try {
    msg = await tryCheckin(cookie, runtimeConfig);
    console.log(`checkin result: ${msg}`);
  } catch (error) {
    msg = `签到失败: ${error.message}`;
    console.error(msg);
  }

  // 钉钉通知
  if (config.dingtalkWebhook) {
    const title = "豆奶签到通知";
    const text = `## 豆奶自动签到\n\n` +
      `- **时间**: ${now()}\n` +
      `- **结果**: ${msg}\n` +
      `- **站点**: ${dounaiUrl}\n`;
    await sendDingTalk(config.dingtalkWebhook, config.dingtalkSecret, title, text);
  }
}
