import { getDomainUrl } from "./domain.js";
import { login } from "./login.js";
import { tryCheckin } from "./checkin.js";

export async function startAutoCheckin(config) {
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

  const msg = await tryCheckin(cookie, runtimeConfig);
  console.log(`checkin result: ${msg}`);
}
