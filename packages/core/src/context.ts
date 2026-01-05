import {
    replyMessage,
    pushMessage,
    Message,
} from "@linekit/messaging";
import { WebhookEvent, LineAppConfig, isReplyableEvent } from "./types.js";

export class Context {
    public readonly event: WebhookEvent;
    public readonly config: LineAppConfig;

    constructor(config: LineAppConfig, event: WebhookEvent) {
        this.config = config;
        this.event = event;
    }

    get userId(): string | undefined {
        return this.event.source?.userId;
    }

    get replyToken(): string | undefined {
        return isReplyableEvent(this.event) ? this.event.replyToken : undefined;
    }

    public async reply(messages: Message[] | Message) {
        if (!this.replyToken) {
            throw new Error("Cannot reply to an event without a replyToken");
        }
        const msgs = Array.isArray(messages) ? messages : [messages];
        return replyMessage(this.config.channelAccessToken, this.replyToken, msgs);
    }

    public async replyText(text: string) {
        return this.reply({ type: "text", text });
    }

    public async push(messages: Message[] | Message) {
        if (!this.userId) {
            throw new Error("Cannot push to an event without a userId");
        }
        const msgs = Array.isArray(messages) ? messages : [messages];
        return pushMessage(this.config.channelAccessToken, this.userId, msgs);
    }

    public async pushText(text: string) {
        return this.push({ type: "text", text });
    }
}

