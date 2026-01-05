# LINE Login Demo

A simple Express application demonstrating the OAuth 2.1 flow using `@linekit/login`.

## Setup

1. Create a **LINE Login** channel in the LINE Developer Console.
2. In "LINE Login" tab, add `http://localhost:3000/callback` to **Callback URL**.
3. Create a `.env` file (or just export env vars):

```bash
export LINE_LOGIN_CHANNEL_ID="your_channel_id"
export LINE_LOGIN_CHANNEL_SECRET="your_channel_secret"
```

## Run

```bash
npm run dev
```

1. Open `http://localhost:3000`.
2. Click "Log in with LINE".
3. Log in with your LINE account.
4. See your profile data (Name, Picture, Email) and tokens displayed.
