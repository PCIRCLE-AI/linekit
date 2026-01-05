import express from "express";
import { generateAuthUrl, issueAccessToken, verifyIdToken } from "@linekit/login";

const app = express();
const port = 3000;

// Config
const channelId = process.env.LINE_LOGIN_CHANNEL_ID || "";
const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET || "";
const redirectUri = `http://localhost:${port}/callback`;

if (!channelId || !channelSecret) {
    console.error("Missing LINE_LOGIN_CHANNEL_ID or LINE_LOGIN_CHANNEL_SECRET");
    process.exit(1);
}

// 1. Home Page: "Login with LINE" button
app.get("/", (req, res) => {
    const state = Math.random().toString(36).substring(7); // In prod, use a proper CSPRNG and store in session
    const authUrl = generateAuthUrl({
        channelId,
        redirectUri,
        state,
        scope: "profile openid email",
    });

    res.send(`
        <h1>LINE Login Demo</h1>
        <a href="${authUrl}">
            <button style="padding: 10px 20px; font-size: 16px; background-color: #06C755; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Log in with LINE
            </button>
        </a>
    `);
});

// 2. Callback handling
app.get("/callback", async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send(`Error: ${error}`);
    }

    if (!code) {
        return res.status(400).send("No code provided");
    }

    try {
        // Exchange code for tokens
        const tokens = await issueAccessToken(channelId, channelSecret, code as string, redirectUri);

        // Verify ID Token to get user profile (securely)
        let userProfile = {};
        if (tokens.id_token) {
            userProfile = await verifyIdToken(tokens.id_token, channelId);
        }

        res.send(`
            <h1>Login Success!</h1>
            <h2>User Profile</h2>
            <pre>${JSON.stringify(userProfile, null, 2)}</pre>
            <h2>Tokens</h2>
            <pre>${JSON.stringify(tokens, null, 2)}</pre>
            <br/>
            <a href="/">Go Back</a>
        `);
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Error during login: ${err.message}`);
    }
});

app.listen(port, () => {
    console.log(`Login demo running at http://localhost:${port}`);
    console.log(`Make sure your LINE Login Channel has "${redirectUri}" as a Callback URL.`);
});
