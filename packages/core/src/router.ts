import { Context } from "./context.js";
import { LineAppConfig, WebhookEvent } from "./types.js";

type EventHandler = (ctx: Context) => Promise<void> | void;

export interface RouterHandlers {
    [key: string]: EventHandler;
}

export function createRouter(config: LineAppConfig, handlers: RouterHandlers) {
    return async (req: any, res: any) => {
        // Expect req.body.events to be present (handled by webhook middleware)
        const events: WebhookEvent[] = req.body?.events || [];

        await Promise.all(
            events.map(async (event) => {
                const handler = handlers[event.type];
                if (handler) {
                    const ctx = new Context(config, event);
                    try {
                        await handler(ctx);
                    } catch (err) {
                        console.error(`Error handling event ${event.type}:`, err);
                        // We generally absorb errors in handlers to avoid crashing the loop, 
                        // but strictly speaking we might want to let it bubble if the user wants.
                        // For a framework, logging and continuing is usually safer for webhooks.
                    }
                }
            })
        );

        // If res is provided (Express-like), send 200
        if (res && typeof res.status === "function") {
            res.status(200).end();
        }
    };
}
