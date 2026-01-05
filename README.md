# linekit

一個用於整合 LINE Messaging API、Login 和 LIFF 的模組化整合工具包。

[![網站](https://img.shields.io/badge/網站-pcircle--ai.github.io%2Flinekit-06C755)](https://pcircle-ai.github.io/linekit/)
[![GitHub](https://img.shields.io/github/stars/PCIRCLE-AI/linekit?style=social)](https://github.com/PCIRCLE-AI/linekit)

[繁體中文](README.md) | [English](README.en.md)

## 特色

- **模組化**：將 Core、Messaging、Login 和 Adapters 分離為獨立套件。
- **框架無關**：可與 Express、Fastify 或標準 Web API 一起使用。
- **型別安全**：使用 TypeScript 編寫，提供完整的型別定義。
- **安全性**：時序安全的簽章驗證、輸入驗證、CSRF 保護工具。
- **開發者友善**：為機器人和登入功能提供簡單、明確的 API。

## 安裝

```bash
npm install @linekit/core @linekit/messaging @linekit/adapters-express
```

## 使用方式

### 基礎機器人 (Express)

```ts
import express from "express";
import { createLineApp } from "@linekit/core";
import { lineMiddleware } from "@linekit/express";

const app = express();
const config = {
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const line = createLineApp(config);

app.post(
  "/webhook",
  lineMiddleware(config), // 自動驗證簽章並解析 body
  line.router({
    message: async (ctx) => {
      if (ctx.event.message.type === "text") {
        await ctx.replyText(`你說了：${ctx.event.message.text}`);
      }
    },
    follow: async (ctx) => {
      await ctx.pushText("感謝您的追蹤！");
    },
  })
);

app.listen(3000, () => console.log("Bot running on port 3000"));
```

### LINE Login

```ts
import { login, generateAuthUrl, issueAccessToken } from "@linekit/login";

// Generate OAuth URL with CSRF protection
const state = login.generateState();
const authUrl = generateAuthUrl({
  channelId: "YOUR_CHANNEL_ID",
  redirectUri: "https://example.com/callback",
  state,
  scope: ["profile", "openid", "email"],
});

// Callback handling
if (login.validateState(savedState, returnedState)) {
  const tokens = await issueAccessToken(process.env.CHANNEL_ID!, process.env.CHANNEL_SECRET!, code, redirectUri);
  const user = await login.verify(tokens.id_token!, process.env.CHANNEL_ID!);
  console.log(user.name, user.email);
}
```

### LIFF Management

```ts
import { LiffClient } from "@linekit/liff";

const client = new LiffClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
});

// Manage LIFF apps server-side
const apps = await client.getAll();
const { liffId } = await client.add({
  view: { type: "full", url: "https://mysite.com" }
});
```

## Packages

- **@linekit/core**: Webhook signature verification, Context, Router.
- **@linekit/messaging**: Messaging API client (Reply, Push, Multicast) with validation.
- **@linekit/login**: OAuth 2.1 flow, ID Token verification, State management.
- **@linekit/liff**: Server-side LIFF app management (CRUD).
- **@linekit/express**: Express.js middleware adapter.

## API Compatibility

Built for:

| API | Version | Reference |
| :--- | :--- | :--- |
| Messaging API | v2 | [Docs](https://developers.line.biz/en/reference/messaging-api/) |
| LINE Login | v2.1 | [Docs](https://developers.line.biz/en/reference/line-login/) |
| LIFF | v1 (Mgmt) | [Docs](https://developers.line.biz/en/reference/liff-server/) |

**Base URLs:**

- Messaging: `https://api.line.me/v2/bot/`
- Login: `https://api.line.me/oauth2/v2.1/`
- LIFF Mgmt: `https://api.line.me/liff/v1/`

**Safety & Limits:**

- Automating batch size limits (5 msgs/req, 500 users/multicast).

## 文件

📚 **[完整教學與 API 參考](https://pcircle-ai.github.io/linekit/index-zh.html)** - 附流程圖的詳細指南

- [使用指南](docs/usage-guide.md): 詳細的使用說明和程式碼範例。
- [架構說明](docs/architecture.md): 系統概觀和元件細節。
- [設計原則](docs/design-principles.md): 工具包背後的核心理念。

## 範例

- [**Basic Bot**](examples/bot-basic/): 連接 Messaging API 的簡單 Echo 機器人。
- [**Login Demo**](examples/login-demo/): 展示 "Log in with LINE" OAuth 2.1 流程的 Web 應用程式。
- [**Marketing Demo**](examples/marketing-demo/): 建立和管理圖文選單 (Rich Menu) 的 CLI 工具。

## 授權

MIT
