import { richMenu } from "@linekit/messaging";
import fs from "fs";
import path from "path";

// Config
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

if (!channelAccessToken) {
    console.error("Missing LINE_CHANNEL_ACCESS_TOKEN");
    process.exit(1);
}

async function main() {
    try {
        console.log("1. Creating Rich Menu...");
        // 1. Create the menu object
        const menuId = await richMenu.create(channelAccessToken, {
            size: { width: 2500, height: 1686 },
            selected: true,
            name: "Demo Menu",
            chatBarText: "Open Demo",
            areas: [
                {
                    bounds: { x: 0, y: 0, width: 2500, height: 1686 },
                    action: {
                        type: "postback",
                        data: "action=clicked_main",
                        displayText: "You clicked the big button"
                    }
                }
            ]
        });
        console.log(`   -> Created Menu ID: ${menuId}`);

        // 2. Upload Image (Placeholder logic as we don't have a real image file guaranteed to exist)
        // In a real app:
        // const imageBuffer = fs.readFileSync(path.join(__dirname, '../assets/menu.png'));
        // await richMenu.uploadImage(channelAccessToken, menuId, imageBuffer, 'image/png');
        console.log("   -> (Skipping image upload for this demo - requires a valid 2500x1686 JPEG/PNG)");

        // 3. Set as Default
        console.log("2. Setting as Default Rich Menu...");
        await richMenu.setDefault(channelAccessToken, menuId);
        console.log("   -> Done. Check your bot in the LINE app!");

        // 4. Cleanup (Optional, just to show how)
        // await richMenu.delete(channelAccessToken, menuId);

    } catch (err: any) {
        console.error("Error:", err.message);
    }
}

main();
