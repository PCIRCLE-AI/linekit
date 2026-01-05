import { lineRequest } from "./client.js";

// Basic Message Types (Should probably be shared or defined in messaging types)
// For now inline simple ones
export interface Message {
    type: string;
    [key: string]: any;
}

export async function replyMessage(token: string, replyToken: string, messages: Message[]) {
    return lineRequest(token, "POST", "/message/reply", {
        replyToken,
        messages,
    });
}

export async function replyText(token: string, replyToken: string, text: string) {
    return replyMessage(token, replyToken, [{ type: "text", text }]);
}
