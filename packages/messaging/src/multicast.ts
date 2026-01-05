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
