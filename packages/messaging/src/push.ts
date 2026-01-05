import { lineRequest } from "./client.js";
import { Message } from "./reply.js";

export async function pushMessage(token: string, to: string, messages: Message[]) {
    return lineRequest(token, "POST", "/message/push", {
        to,
        messages,
    });
}

export async function pushText(token: string, to: string, text: string) {
    return pushMessage(token, to, [{ type: "text", text }]);
}
