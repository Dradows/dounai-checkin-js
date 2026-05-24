# dounai-checkin-js

JavaScript rewrite of the original Go check-in tool.

## Requirements

- Node.js 18 or newer

## Run

```bash
npm start -- --email your@email.com --password your-password
```

The `start` command logs in, checks in once, prints the result, and exits.

Environment variables are also supported:

```bash
EMAIL=your@email.com PASSWORD=your-password node src/cli.js start
```

Check the current dounai domain:

```bash
npm run domain
```

## Core Flow

1. `src/domain.js` returns the current dounai domain.
2. `src/login.js` posts `email` and `passwd` to `/auth/login`.
3. `src/cookie.js` extracts `uid`, `key`, `email`, `ip`, and `expire_in` from `Set-Cookie`.
4. `src/checkin.js` posts to `/user/checkin` with those cookies.
5. `src/scheduler.js` runs the one-shot flow: get domain, login, check in, then exit.

## Test

```bash
npm test
```

## GitHub Actions 自动打卡

项目已配置 GitHub Actions，可每日自动执行打卡。

### 配置步骤

1. 在 GitHub 仓库中，进入 **Settings → Secrets and variables → Actions**
2. 添加以下 **Repository secrets**：

| Secret 名称 | 说明 |
|---|---|
| `EMAIL` | 豆奶签到账号（邮箱） |
| `PASSWORD` | 豆奶签到密码 |
| `DINGTALK_WEBHOOK` | 钉钉机器人 Webhook 地址（完整 URL） |

### 配置钉钉机器人

1. 打开钉钉电脑版/手机版，进入需要接收通知的群聊
2. 群设置 → **智能群助手** → **添加机器人** → **自定义**（通过 Webhook 接入）
3. 设置机器人名称，安全设置选 **"自定义关键词"**，填入 `豆奶签到`
4. 复制生成的 **Webhook 地址**，填入 GitHub Secrets 的 `DINGTALK_WEBHOOK`

### 执行频率

每天 0:20 和 9:20（北京时间）自动执行。如需修改，编辑 `.github/workflows/checkin.yml` 中的 `cron` 表达式。

### 手动触发

进入仓库的 **Actions** 标签页 → 选择 **Dounai Daily Check-in** → 点击 **Run workflow**。

### 钉钉通知

无论打卡成功或失败，都会通过钉钉机器人发送 Markdown 格式通知。
