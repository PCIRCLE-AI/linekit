import { lineRequest, LineClientError } from "./client.js";
import { validateMessages, validateRecipients } from "./validation.js";
import type { Message } from "./types.js";

export async function multicast(token: string, to: string[], messages: Message[]) {
    if (!token) throw new LineClientError("token is required");
    validateRecipients(to);
    validateMessages(messages);

    return lineRequest(token, "POST", "/message/multicast", {
        to,
        messages,
    });
}

/**
 * Sends messages to multiple users, automatically chunking recipients into groups of 500.
 * (LINE API limit for multicast is 500 recipients per request)
 * 
 * @param options.chunkSize default 500
 * @param options.delayMs delay between chunks in ms (default 0)
 */
export interface BulkMulticastResult {
    success: boolean;
    count: number;
    res?: any;
    error?: any;
}

export async function bulkMulticast(
    token: string,
    to: string[],
    messages: Message[],
    options: { chunkSize?: number; delayMs?: number } = {}
): Promise<BulkMulticastResult[]> {
    const chunkSize = options.chunkSize || 500;
    const delayMs = options.delayMs || 0;

    // Validate all recipients first (lite validation)
    if (!to.length) return [];

    const results: BulkMulticastResult[] = [];

    for (let i = 0; i < to.length; i += chunkSize) {
        const chunk = to.slice(i, i + chunkSize);

        // We can't validateRecipients(chunk) here efficiently if the list is huge,
        // but multicast() calls checking anyway.

        try {
            const res = await multicast(token, chunk, messages);
            results.push({ success: true, count: chunk.length, res });
        } catch (err) {
            results.push({ success: false, count: chunk.length, error: err });
        }

        if (delayMs > 0 && i + chunkSize < to.length) {
            await new Promise(r => setTimeout(r, delayMs));
        }
    }

    return results;
}
