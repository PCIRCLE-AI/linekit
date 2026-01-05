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

// 產生含 CSRF 保護的 OAuth URL
const state = login.generateState();
const authUrl = generateAuthUrl({
  channelId: "YOUR_CHANNEL_ID",
  redirectUri: "https://example.com/callback",
  state,
});

// 回調後驗證 state 並交換 token
if (login.validateState(savedState, returnedState)) {
  const tokens = await issueAccessToken(channelId, channelSecret, code, redirectUri);
  const user = await login.verify(tokens.id_token, channelId);
  console.log(user.name, user.email);
}
```

## 套件列表

- **@linekit/core**: Webhook 驗證（時序安全）、Context、Router 含錯誤處理。
- **@linekit/messaging**: Messaging API 客戶端 (Reply, Push, Multicast, Rich Menu) 含輸入驗證。
- **@linekit/login**: OAuth 流程、ID Token 驗證、CSRF state 工具。
- **@linekit/express**: Express.js 的適配器。

## LINE API 相容性

本工具包基於以下 LINE API 版本開發：

| API | 版本 | 參考文件 |
|-----|------|---------|
| Messaging API | v2 | [文件](https://developers.line.biz/en/reference/messaging-api/) |
| LINE Login | v2.1 (OAuth 2.1) | [文件](https://developers.line.biz/en/reference/line-login/) |
| LIFF | v2 | [文件](https://developers.line.biz/en/reference/liff/) |

**API 端點 Base URL：**
- Messaging API: `https://api.line.me/v2/bot/`
- LINE Login: `https://api.line.me/oauth2/v2.1/`
- 授權: `https://access.line.me/oauth2/v2.1/`

**API 限制（由 linekit 強制執行）：**
- 每次請求最多 5 則訊息
- 每次 multicast 請求最多 500 位收件人

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
