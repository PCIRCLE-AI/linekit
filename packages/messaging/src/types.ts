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
