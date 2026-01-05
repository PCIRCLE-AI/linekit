import { lineRequest } from "./client.js";
import { Message } from "./reply.js";

export async function multicast(token: string, to: string[], messages: Message[]) {
    return lineRequest(token, "POST", "/message/multicast", {
        to,
        messages,
    });
}
