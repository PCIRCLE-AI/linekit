# Developer Usage Guide

This guide explains how to use `linekit` to build LINE applications.

## 1. Installation

Currently, `linekit` is a local monorepo. To use it in the provided examples or a new package within this repo:

```bash
# In your package.json
{
  "dependencies": {
    "@linekit/core": "workspace:*",
    "@linekit/messaging": "workspace:*",
    "@linekit/login": "workspace:*",
    "@linekit/express": "workspace:*"
  }
}
```

If you publish these packages to npm, usage would be:

```bash
npm install @linekit/core @linekit/messaging @linekit/express
```

## 2. Quick Start: Messaging Bot (Express)

This is the fastest way to get a bot running.

### Prerequisites

- A LINE Channel (Messaging API)
- Channel Access Token (Long-lived)
- Channel Secret

### Code Setup

```typescript
import express from "express";
import { createLineApp } from "@linekit/core";
import { lineMiddleware } from "@linekit/express";

// 1. Configure
const config = {
  channelId: "YOUR_CHANNEL_ID",
  channelSecret: "YOUR_CHANNEL_SECRET",
  channelAccessToken: "YOUR_ACCESS_TOKEN",
};

// 2. Initialize App
const app = express();
const line = createLineApp(config);

// 3. Define Routes
app.post(
  "/webhook",
  // Middleware handles signature validation automatically
  lineMiddleware(config),
  // Router handles event dispatching
  line.router({
    // Handle Text Messages
    message: async (ctx) => {
      const { message } = ctx.event;
      if (message.type === "text") {
        await ctx.replyText(`Echo: ${message.text}`);
      }
    },
    // Handle Follow Events (Friend added)
    follow: async (ctx) => {
      await ctx.pushText("Thanks for adding me!");
    },
    // Handle Postbacks (Button clicks)
    postback: async (ctx) => {
      console.log("Data:", ctx.event.postback.data);
    }
  })
);

app.listen(3000);
```

## 3. LINE Login Integration

Use `@linekit/login` to handle LINE Login for web apps.

### Prerequisites

- A LINE Channel (LINE Login)

### Verify ID Token (Backend)

When your frontend sends an ID Token (from LIFF or iOS/Android SDK):

```typescript
import { login } from "@linekit/login";

try {
  const profile = await login.verify(idToken, "YOUR_CHANNEL_ID");
  console.log(`User: ${profile.name}, Email: ${profile.email}`);
} catch (error) {
  console.error("Invalid token");
}
```

### OAuth Flow (Backend)

To manually redirect users to login:

```typescript
import { generateAuthUrl, issueAccessToken } from "@linekit/login";

// 1. Generate URL
const url = generateAuthUrl({
  channelId: "YOUR_CHANNEL_ID",
  redirectUri: "http://localhost:3000/callback",
  state: "random_string",
  scope: "profile openid email"
});
// -> Redirect user to `url`

// 2. Handle Callback
// In your /callback route:
const { code } = req.query;
const tokens = await issueAccessToken(
  "YOUR_CHANNEL_ID", 
  "YOUR_CHANNEL_SECRET", 
  code, 
  "http://localhost:3000/callback"
);

console.log("Access Token:", tokens.access_token);
console.log("ID Token:", tokens.id_token);
```

## 4. Advanced Messaging Features

The `ctx` object in your router provides convenient helpers, but you can also use the `@linekit/messaging` package directly.

### Sending Rich Menus

```typescript
import { richMenu } from "@linekit/messaging";

// Create a menu
const menuId = await richMenu.create(token, {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "Main Menu",
  chatBarText: "Open Menu",
  areas: [/* ... defined areas ... */]
});

// Link to a specific user
await richMenu.linkUser(token, userId, menuId);
```

### Multicast (Send to multiple users)

```typescript
import { multicast } from "@linekit/messaging";

await multicast(token, ["userId1", "userId2"], [
  { type: "text", text: "Broadcast message" }
]);
```
