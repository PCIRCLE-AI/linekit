# @linekit/liff

The LIFF (LINE Front-end Framework) module for `linekit`.

This package provides:

1. **Server-side API Client**: Manage LIFF apps (Create, Read, Update, Delete) using your Channel Access Token.
2. **Type Definitions**: TypeScript interfaces for LIFF views and configurations.

## Installation

```bash
pnpm add @linekit/liff
```

## Usage

### Server-side Management

Use `LiffClient` to manage your LIFF apps dynamically.

```typescript
import { LiffClient } from "@linekit/liff";

const client = new LiffClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

async function setupLiff() {
  // 1. List all apps
  const apps = await client.getAll();
  console.log("Current apps:", apps);

  // 2. Create a new LIFF app
  const newApp = await client.add({
    type: "full",
    url: "https://mysite.com/liff",
    description: "My Awesome LIFF App",
    features: {
      qrCode: true
    }
  });
  console.log("Created LIFF ID:", newApp.liffId);
}
```

### Frontend Initialization Example

To use LIFF in your frontend (browser), you should use the official `@line/liff` package. `linekit` focuses on backend management, but here is a typical initialization pattern.

```html
<!-- index.html -->
<script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
<script>
  async function main() {
    await liff.init({ liffId: "YOUR_LIFF_ID" });
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      console.log("Hello " + profile.displayName);
    } else {
      liff.login();
    }
  }
  main();
</script>
```

Or with npm:

```bash
npm install @line/liff
```

```typescript
import liff from "@line/liff";

liff.init({ liffId: "YOUR_LIFF_ID" })
  .then(() => {
    // Start using LIFF
  })
  .catch((err) => {
    console.error(err);
  });
```
