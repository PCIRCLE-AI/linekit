export interface LineAppConfig {
    channelId?: string;
    channelSecret: string;
    channelAccessToken: string;
}

export interface WebhookRequestBody {
    destination: string;
    events: WebhookEvent[];
}

export type WebhookEvent =
    | MessageEvent
    | FollowEvent
    | UnfollowEvent
    | PostbackEvent
    | UnknownEvent;

export interface EventBase {
    type: string;
    mode: "active" | "standby";
    timestamp: number;
    source: EventSource;
    webhookEventId: string;
    deliveryContext: {
        isRedelivery: boolean;
    };
}

export interface EventSource {
    type: "user" | "group" | "room";
    userId?: string;
    groupId?: string;
    roomId?: string;
}

export interface MessageEvent extends EventBase {
    type: "message";
    replyToken: string;
    message: EventMessage;
}

export type EventMessage =
    | TextEventMessage
    | ImageEventMessage
    | VideoEventMessage
    | AudioEventMessage
    | LocationEventMessage
    | StickerEventMessage;

export interface TextEventMessage {
    type: "text";
    id: string;
    text: string;
    emojis?: {
        index: number;
        length: number;
        productId: string;
        emojiId: string;
    }[];
    mention?: {
        mentionees: {
            index: number;
            length: number;
            userId: string;
        }[];
    };
}

export interface ImageEventMessage {
    type: "image";
    id: string;
    contentProvider: {
        type: "line" | "external";
        originalContentUrl?: string;
        previewImageUrl?: string;
    };
    imageSet?: {
        id: string;
        index: number;
        total: number;
    };
}

export interface VideoEventMessage {
    type: "video";
    id: string;
    duration: number;
    contentProvider: {
        type: "line" | "external";
        originalContentUrl?: string;
        previewImageUrl?: string;
    };
}

export interface AudioEventMessage {
    type: "audio";
    id: string;
    duration: number;
    contentProvider: {
        type: "line" | "external";
        originalContentUrl?: string;
    };
}

export interface LocationEventMessage {
    type: "location";
    id: string;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface StickerEventMessage {
    type: "sticker";
    id: string;
    packageId: string;
    stickerId: string;
}

export interface FollowEvent extends EventBase {
    type: "follow";
    replyToken: string;
}

export interface UnfollowEvent extends EventBase {
    type: "unfollow";
}

export interface PostbackEvent extends EventBase {
    type: "postback";
    replyToken: string;
    postback: {
        data: string;
        params?: Record<string, any>;
    };
}

export interface UnknownEvent extends EventBase {
    type: string;
    [key: string]: any;
}
