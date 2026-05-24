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
| `MAIL_SERVER_ADDRESS` | SMTP 服务器地址（如 `smtp.gmail.com`） |
| `MAIL_SERVER_PORT` | SMTP 端口（如 `465`） |
| `MAIL_USERNAME` | 发送通知的邮箱地址 |
| `MAIL_PASSWORD` | 邮箱的 SMTP 授权码（非邮箱密码） |
| `MAIL_TO` | 失败通知接收邮箱 |

### 执行频率

默认每天早上 8:00（北京时间）自动执行。如需修改，编辑 `.github/workflows/checkin.yml` 中的 `cron` 表达式。

### 手动触发

进入仓库的 **Actions** 标签页 → 选择 **Dounai Daily Check-in** → 点击 **Run workflow**。

### 失败通知

打卡失败时会自动发送邮件到 `MAIL_TO` 配置的邮箱，邮件中包含 Actions 运行日志链接。
