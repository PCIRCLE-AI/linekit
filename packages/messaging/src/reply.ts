import { lineRequest, LineClientError } from "./client.js";
import { validateMessages } from "./validation.js";
import type { Message } from "./types.js";

// Re-export types for backwards compatibility
export type {
    Message,
    TextMessage,
    StickerMessage,
    ImageMessage,
    VideoMessage,
    AudioMessage,
    LocationMessage,
    TemplateMessage,
    FlexMessage,
} from "./types.js";

export async function replyMessage(token: string, replyToken: string, messages: Message[]) {
    if (!token) throw new LineClientError("token is required");
    if (!replyToken) throw new LineClientError("replyToken is required");
    validateMessages(messages);

    return lineRequest(token, "POST", "/message/reply", {
        replyToken,
        messages,
    });
}

export async function replyText(token: string, replyToken: string, text: string) {
    if (!text) throw new LineClientError("text is required");
    return replyMessage(token, replyToken, [{ type: "text", text }]);
}
