import express from "express";
import { createLineApp } from "@linekit/core";
import { lineMiddleware } from "@linekit/express";

// Ensure environment variables are set
const config = {
    channelId: process.env.LINE_CHANNEL_ID || "",
    channelSecret: process.env.LINE_CHANNEL_SECRET || "",
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
};

if (!config.channelSecret || !config.channelAccessToken) {
    console.error("Missing LINE_CHANNEL_SECRET or LINE_CHANNEL_ACCESS_TOKEN");
    process.exit(1);
}

const app = express();
const line = createLineApp(config);

app.post(
    "/webhook",
    lineMiddleware(config),
    line.router({
        message: async (ctx) => {
            const { message } = ctx.event;
            if (message.type === "text") {
                console.log(`Received text: ${message.text}`);
                await ctx.replyText(`Echo: ${message.text}`);
            } else {
                await ctx.replyText("Received non-text message");
            }
        },
        follow: async (ctx) => {
            console.log(`New follower: ${ctx.userId}`);
            if (ctx.userId) {
                await ctx.pushText("Thanks for adding me!");
            }
        },
    })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Bot running at http://localhost:${port}`);
});
