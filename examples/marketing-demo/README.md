# Marketing Demo (Rich Menu)

A CLI script demonstrating how to programmatically create and set a Rich Menu using `@linekit/messaging`.

## Setup

1. Get your **Channel Access Token** from the LINE Developer Console.
2. Export it:

```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_access_token"
```

## Run

```bash
npm start
```

This script will:

1. Create a new Rich Menu object.
2. (Log where you would upload the image).
3. Set this new menu as the **Default** menu for all users.

Open your bot in the LINE app to see the new menu bar (note: without an actual image uploaded, it might look blank or show a default placeholder depending on client caching, but the area will be clickable).
