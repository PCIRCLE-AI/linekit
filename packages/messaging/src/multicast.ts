import { lineRequest, LineClientError } from "./client.js";
import { Message } from "./reply.js";

const MAX_MESSAGES_PER_REQUEST = 5;
const MAX_RECIPIENTS = 500;

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

export async function multicast(token: string, to: string[], messages: Message[]) {
    if (!token) throw new LineClientError("token is required");
    if (!Array.isArray(to) || to.length === 0) {
        throw new LineClientError("recipients (to) must be a non-empty array");
    }
    if (to.length > MAX_RECIPIENTS) {
        throw new LineClientError(`Maximum ${MAX_RECIPIENTS} recipients per request`);
    }
    validateMessages(messages);

    return lineRequest(token, "POST", "/message/multicast", {
        to,
        messages,
    });
}
