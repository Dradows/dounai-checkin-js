#!/usr/bin/env node
import { getDomainUrl } from "./domain.js";
import { startAutoCheckin } from "./scheduler.js";

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
    args[key] = value;

    if (value !== "true") {
      i += 1;
    }
  }

  return args;
}

function printUsage() {
  console.log(`Usage:
  node src/cli.js start --email <email> --password <password>
  node src/cli.js domain

Environment variables are also supported:
  EMAIL=<email> PASSWORD=<password> node src/cli.js start`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (command === "domain") {
    console.log(await getDomainUrl());
    return;
  }

  if (command !== "start") {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const email = args.email || process.env.EMAIL;
  const password = args.password || process.env.PASSWORD;
  const dingtalkWebhook = args["dingtalk-webhook"] || process.env.DINGTALK_WEBHOOK || "";
  const dingtalkSecret = args["dingtalk-secret"] || process.env.DINGTALK_SECRET || "";

  if (!email || !password) {
    throw new Error("Missing required --email/EMAIL or --password/PASSWORD");
  }

  await startAutoCheckin({ email, password, dingtalkWebhook, dingtalkSecret });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
