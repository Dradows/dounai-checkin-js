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
| `QMSG_KEY` | Qmsg酱 的 Key（在 https://qmsg.zendee.cn 获取） |
| `QMSG_QQ` | 接收通知的 QQ 号（需先添加 Qmsg酱 机器人为好友） |

### 配置 Qmsg酱 QQ 通知

1. 打开 [Qmsg酱](https://qmsg.zendee.cn)，用 QQ 登录
2. 获取你的 Key
3. 添加 Qmsg酱 的 QQ 机器人为好友（页面有指引）
4. 将 Key 和接收通知的 QQ 号填入 GitHub Secrets

### 执行频率

每天 0:20 和 9:20（北京时间）自动执行。如需修改，编辑 `.github/workflows/checkin.yml` 中的 `cron` 表达式。

### 手动触发

进入仓库的 **Actions** 标签页 → 选择 **Dounai Daily Check-in** → 点击 **Run workflow**。

### QQ 通知

无论打卡成功或失败，都会通过 Qmsg酱 QQ 机器人发送通知。
