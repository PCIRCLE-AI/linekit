import { bulkMulticast } from "@linekit/messaging";
import { config } from "dotenv";

config();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || "";

if (!CHANNEL_ACCESS_TOKEN) {
    console.error("Please set CHANNEL_ACCESS_TOKEN in .env");
    process.exit(1);
}

// Simulated audience (e.g., from CSV or Database)
const audience = Array.from({ length: 1200 }, (_, i) => `U_MOCK_USER_ID_${i}`);

async function main() {
    console.log(`Starting bulk push to ${audience.length} users...`);

    const results = await bulkMulticast(
        CHANNEL_ACCESS_TOKEN,
        audience,
        [
            {
                type: "text",
                text: "Hello! This is a bulk message.",
            },
        ],
        {
            chunkSize: 500, // Default is 500
            delayMs: 1000,   // Wait 1 second between chunks to be safe
        }
    );

    console.log("Bulk push completed.");

    // Analyze results
    const successCount = results!.filter(r => r.success).reduce((acc, r) => acc + r.count, 0);
    const failureCount = results!.filter(r => !r.success).reduce((acc, r) => acc + r.count, 0);

    console.log(`Success: ${successCount}`);
    console.log(`Failure: ${failureCount}`);
}

main().catch(console.error);
