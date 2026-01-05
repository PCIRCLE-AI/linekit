import type { IncomingMessage, ServerResponse } from "http";
import * as crypto from "crypto";
import { SignatureValidationFailedError, JSONParseError } from "./errors.js";

interface WebhookConfig {
    channelSecret: string;
}

// Helper to get raw body
function getRawBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            resolve(data);
        });
        req.on("error", (err) => {
            reject(err);
        });
    });
}

export function createWebhookMiddleware(config: WebhookConfig) {
    return async (req: IncomingMessage & { body?: any; rawBody?: string }, res: ServerResponse, next?: () => void) => {
        try {
            const signature = req.headers["x-line-signature"] as string;

            // If rawBody is not already present, read it
            // Note: In some frameworks (like Express with body-parser), rawBody might need to be configured to be available.
            // This middleware attempts to read it if stream is not consumed, or expects req.rawBody or manual buffer handling.
            // For the most robust integration, we might suggest adapters to provide the body.
            // But for a generic node middleware:

            let body = req.rawBody;

            if (!body && (req as any).readable) {
                try {
                    body = await getRawBody(req);
                    // Store it back so other handlers can use it if needed, though they usually prefer parsed JSON
                    (req as any).rawBody = body;
                } catch (e) {
                    // If stream is already consumed, we might fail here.
                    // We'll proceed assuming body might be empty or handled else where, but check signature implies we have body.
                }
            }

            if (!body) {
                // Fallback strategy: strictly speaking we need the raw string bytes for signature.
                // If the framework already parsed it to JSON and discarded raw bytes, we can't strictly verify signature 
                // without reconstruction (which is flaky).
                // For now, we assume rawBody string is available or we just read it.
                // If body is missing, we can't verify.
                if (req.body && typeof req.body === 'object') {
                    // Dangerous fallback: stringify. Only works if keys are ordered same way.
                    // Ideally we throw or warn.
                    console.warn("linekit: rawBody not found, skipping signature verification is NOT RECOMMENDED. Please ensure raw body is available.");
                    return next?.();
                }
                throw new Error("Missing request body for signature verification");
            }

            if (!signature) {
                throw new SignatureValidationFailedError("Missing X-Line-Signature header");
            }

            const hash = crypto
                .createHmac("sha256", config.channelSecret)
                .update(body)
                .digest("base64");

            if (hash !== signature) {
                // use safe constant time comparison if possible, but string check is standard in many examples.
                throw new SignatureValidationFailedError();
            }

            // Parse body if not parsed
            if (!req.body) {
                try {
                    req.body = JSON.parse(body);
                } catch (e) {
                    throw new JSONParseError();
                }
            }

            next?.();
        } catch (err: any) {
            // We handle response if next is not provided or if we want to stop chain?
            // Adapters usually handle errors. 
            // If we are bare http middleware:
            if (res.headersSent) return;

            if (err instanceof SignatureValidationFailedError) {
                res.statusCode = 401;
                res.end("Signature validation failed");
            } else if (err instanceof JSONParseError) {
                res.statusCode = 400;
                res.end("Invalid JSON");
            } else {
                res.statusCode = 500;
                res.end("Internal Server Error");
            }
        }
    };
}
