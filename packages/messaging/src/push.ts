import { lineRequest, LineClientError } from "./client.js";
import { Message } from "./reply.js";

const MAX_MESSAGES_PER_REQUEST = 5;

function validateMessages(messages: Message[]): void {
    if (!Array.isArray(messages)) {
        throw new LineClientError("messages must be an array");
    }
    if (messages.length === 0) {
        throw new LineClientError("At least one message is required");
    }
    if (messages.length > MAX_MESSAGES_PER_REQUEST) {
        throw new LineClientError(`Maximum ${MAX_MESSAGES_PER_REQUEST} messages per request`);
    }
}

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
