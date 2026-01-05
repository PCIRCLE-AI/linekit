import { Request, Response, NextFunction } from "express";

// Define a minimal interface that matches linekit core's generic types
// We don't import specific internal types from core if we want to be loose, 
// but importing generic helper types is good.

// Re-export utility to make it easy to use
export * from "@linekit/core";

// Adapter to convert Express req/res to linekit Core middleware signature
// Since linekit core middleware is (req, res, next), it's already compatible with Express!
// We manage this file for explicit typing and future bridging if signatures diverge.

import { createWebhookMiddleware as coreCreateWebhookMiddleware } from "@linekit/core";

export function lineMiddleware(config: { channelSecret: string }) {
    // Create middleware instance once during initialization, not per request
    const middleware = coreCreateWebhookMiddleware(config);

    // linekit core middleware signature matches (req: IncomingMessage, res: ServerResponse, next: ...)
    // Express Req/Res extend these.
    return (req: Request, res: Response, next: NextFunction) => {
        // Ensure rawBody is available if not handled by body-parser
        // If the user uses a body parser that swallows stream, core middleware might fail.
        // We can add logic here to buffer it if needed, or documentation.
        return middleware(req, res, next);
    };
}
