import { LiffClient } from "@linekit/liff";

const client = new LiffClient({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
});

async function main() {
    try {
        // 1. List all LIFF apps
        const apps = await client.getAll();
        console.log("Current apps:", apps);

        // 2. Add a new LIFF app
        const { liffId } = await client.add({
            view: {
                type: "full",
                url: "https://example.com/my-liff-app",
            },
        });
        console.log("Created LIFF app:", liffId);

        // 3. Update the view url
        await client.update(liffId, {
            type: "tall",
            url: "https://example.com/updated-url",
        });
        console.log("Updated LIFF app");

        // 4. Delete the app
        await client.delete(liffId);
        console.log("Deleted LIFF app");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
