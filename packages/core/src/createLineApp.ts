import { createWebhookMiddleware } from "./webhook.js";
import { createRouter, RouterHandlers } from "./router.js";
import { LineAppConfig } from "./types.js";

export function createLineApp(config: LineAppConfig) {
    return {
        webhook: () => createWebhookMiddleware(config),
        router: (handlers: RouterHandlers) => createRouter(config, handlers),
        // Expose config if needed?
        config
    };
}
