import { lineRequest, LineClientError } from "./client.js";
import { validateMessages } from "./validation.js";
import type { Message } from "./types.js";

export async function pushMessage(token: string, to: string, messages: Message[]) {
    if (!token) throw new LineClientError("token is required");
    if (!to) throw new LineClientError("recipient (to) is required");
    validateMessages(messages);

    return lineRequest(token, "POST", "/message/push", {
        to,
        messages,
    });
}

export async function pushText(token: string, to: string, text: string) {
    if (!text) throw new LineClientError("text is required");
    return pushMessage(token, to, [{ type: "text", text }]);
}
