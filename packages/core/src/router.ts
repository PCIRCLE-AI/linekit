import { Context } from "./context.js";
import { LineAppConfig, WebhookEvent } from "./types.js";

type EventHandler = (ctx: Context) => Promise<void> | void;
type ErrorHandler = (error: Error, ctx: Context) => Promise<void> | void;

export interface RouterHandlers {
    [key: string]: EventHandler;
}

export interface RouterOptions {
    onError?: ErrorHandler;
}

// Minimal request/response interfaces for framework compatibility
interface WebhookRequest {
    body?: {
        events?: WebhookEvent[];
    };
}

interface WebhookResponse {
    status?: (code: number) => WebhookResponse;
    end?: () => void;
}

export function createRouter(
    config: LineAppConfig,
    handlers: RouterHandlers,
    options: RouterOptions = {}
) {
    return async (req: WebhookRequest, res?: WebhookResponse) => {
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
                        const error = err instanceof Error ? err : new Error(String(err));
                        if (options.onError) {
                            try {
                                await options.onError(error, ctx);
                            } catch (onErrorErr) {
                                console.error(`Error in onError handler:`, onErrorErr);
                            }
                        } else {
                            console.error(`Error handling event ${event.type}:`, error);
                        }
                    }
                }
            })
        );

        // If res is provided (Express-like), send 200
        if (res && typeof res.status === "function") {
            res.status(200).end?.();
        }
    };
}
