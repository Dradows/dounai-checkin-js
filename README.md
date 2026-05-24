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
| `QQ_BOT_APP_ID` | QQ 官方机器人的 AppID |
| `QQ_BOT_CLIENT_SECRET` | QQ 官方机器人的 ClientSecret |
| `QQ_BOT_TARGET_ID` | 接收消息的目标 ID（用户 openid 或群 openid） |
| `QQ_BOT_TARGET_TYPE` | 目标类型：`user`（私聊，默认）或 `group`（群聊） |

### 配置 QQ 官方机器人

1. 前往 [QQ 开放平台](https://q.qq.com) 创建机器人，获取 **AppID** 和 **ClientSecret**
2. 在 GitHub Secrets 中配置 `QQ_BOT_APP_ID` 和 `QQ_BOT_CLIENT_SECRET`
3. 添加机器人为 QQ 好友（私聊通知）或邀请机器人进群（群通知）
4. 获取目标 ID：
   - 私聊：在 [QQ 开放平台](https://q.qq.com) 的"沙箱频道"或通过 API 获取用户 openid
   - 群聊：通过机器人 API 获取群 openid
5. 将目标 ID 填入 `QQ_BOT_TARGET_ID`，类型填入 `QQ_BOT_TARGET_TYPE`

### 执行频率

每天 0:20 和 9:20（北京时间）自动执行。如需修改，编辑 `.github/workflows/checkin.yml` 中的 `cron` 表达式。

### 手动触发

进入仓库的 **Actions** 标签页 → 选择 **Dounai Daily Check-in** → 点击 **Run workflow**。

### QQ 通知

无论打卡成功或失败，都会通过 QQ 官方机器人发送通知。
