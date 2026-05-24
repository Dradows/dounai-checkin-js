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

  const msg = await tryCheckin(cookie, runtimeConfig);
  console.log(`checkin result: ${msg}`);
}
