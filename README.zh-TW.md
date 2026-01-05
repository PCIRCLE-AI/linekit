# linekit

一個用於整合 LINE Messaging API、Login 和 LIFF 的模組化整合工具包。

[English](README.md) | [繁體中文](README.zh-TW.md)

## 特色

- **模組化**：將 Core、Messaging、Login 和 Adapters 分離為獨立套件。
- **框架無關**：可與 Express、Fastify 或標準 Web API 一起使用。
- **型別安全**：使用 TypeScript 編寫，提供完整的型別定義。
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
import { login } from "@linekit/login";

// 驗證來自客戶端的 ID Token
const user = await login.verify(idToken, channelId);
console.log(user.name, user.email);
```

## 套件列表

- **@linekit/core**: Webhook 驗證、Context、Router。
- **@linekit/messaging**: Messaging API 客戶端 (Reply, Push, Multicast)。
- **@linekit/login**: OAuth 和 ID Token 驗證。
- **@linekit/express**: Express.js 的適配器。

## 文件

- [使用指南](docs/usage-guide.md): 詳細的使用說明和程式碼範例。
- [架構說明](docs/architecture.md): 系統概觀和元件細節。
- [設計原則](docs/design-principles.md): 工具包背後的核心理念。

## 範例

- [**Basic Bot**](examples/bot-basic/): 連接 Messaging API 的簡單 Echo 機器人。
- [**Login Demo**](examples/login-demo/): 展示 "Log in with LINE" OAuth 2.1 流程的 Web 應用程式。
- [**Marketing Demo**](examples/marketing-demo/): 建立和管理圖文選單 (Rich Menu) 的 CLI 工具。

## 授權

MIT
