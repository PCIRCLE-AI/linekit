import { lineRequest, LineClientError } from "./client.js";

// Message Types
export interface TextMessage {
    type: "text";
    text: string;
    emojis?: Array<{ index: number; productId: string; emojiId: string }>;
}

export interface StickerMessage {
    type: "sticker";
    packageId: string;
    stickerId: string;
}

export interface ImageMessage {
    type: "image";
    originalContentUrl: string;
    previewImageUrl: string;
}

export interface VideoMessage {
    type: "video";
    originalContentUrl: string;
    previewImageUrl: string;
    trackingId?: string;
}

export interface AudioMessage {
    type: "audio";
    originalContentUrl: string;
    duration: number;
}

export interface LocationMessage {
    type: "location";
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface TemplateMessage {
    type: "template";
    altText: string;
    template: Record<string, unknown>;
}

export interface FlexMessage {
    type: "flex";
    altText: string;
    contents: Record<string, unknown>;
}

export type Message =
    | TextMessage
    | StickerMessage
    | ImageMessage
    | VideoMessage
    | AudioMessage
    | LocationMessage
    | TemplateMessage
    | FlexMessage;

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
