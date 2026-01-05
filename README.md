# linekit

A modular integration toolkit for LINE Messaging API, Login, and LIFF.

[![Website](https://img.shields.io/badge/Website-pcircle--ai.github.io%2Flinekit-06C755)](https://pcircle-ai.github.io/linekit/)
[![GitHub](https://img.shields.io/github/stars/PCIRCLE-AI/linekit?style=social)](https://github.com/PCIRCLE-AI/linekit)

[English](README.md) | [繁體中文](README.zh-TW.md)

## Features

- **Modular**: separate packages for Core, Messaging, Login, and Adapters.
- **Framework Agnostic**: use with Express, Fastify, or standard Web APIs.
- **Type-Safe**: written in TypeScript with complete definitions.
- **Secure**: timing-safe signature verification, input validation, CSRF protection helpers.
- **Developer Friendly**: simple, explicit API for bots and login.

## Installation

```bash
npm install @linekit/core @linekit/messaging @linekit/adapters-express
```

## Usage

### Basic Bot (Express)

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
  lineMiddleware(config), // Validates signature and parses body
  line.router({
    message: async (ctx) => {
      if (ctx.event.message.type === "text") {
        await ctx.replyText(`You said: ${ctx.event.message.text}`);
      }
    },
    follow: async (ctx) => {
      await ctx.pushText("Thanks for following!");
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
});

// After callback, validate state and exchange code for tokens
if (login.validateState(savedState, returnedState)) {
  const tokens = await issueAccessToken(channelId, channelSecret, code, redirectUri);
  const user = await login.verify(tokens.id_token, channelId);
  console.log(user.name, user.email);
}
```

## Packages

- **@linekit/core**: Webhook verification (timing-safe), Context, Router with error handling.
- **@linekit/messaging**: Messaging API client (Reply, Push, Multicast, Rich Menu) with input validation.
- **@linekit/login**: OAuth flow, ID Token verification, CSRF state helpers.
- **@linekit/express**: Adapter for Express.js.

## Documentation

📚 **[Full Tutorials & API Reference](https://pcircle-ai.github.io/linekit/)** - Comprehensive guides with flow diagrams

- [User Guide](docs/usage-guide.md): Detailed usage instructions and code examples.
- [Architecture](docs/architecture.md): System overview and component breakdown.
- [Design Principles](docs/design-principles.md): Core philosophies behind the toolkit.

## Examples

- [**Basic Bot**](examples/bot-basic/): A simple echo bot connecting to the Messaging API.
- [**Login Demo**](examples/login-demo/): A web application demonstrating the "Log in with LINE" OAuth 2.1 flow.
- [**Marketing Demo**](examples/marketing-demo/): A CLI tool for creating and managing Rich Menus.

## License

MIT
