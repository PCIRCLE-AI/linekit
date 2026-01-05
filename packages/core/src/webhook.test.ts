import { describe, it, expect, vi } from 'vitest';
import { createWebhookMiddleware } from './webhook.js';
import * as crypto from 'crypto';
import { SignatureValidationFailedError } from './errors.js';

describe('webhook middleware', () => {
    const config = { channelSecret: 'test_secret' };
    const middleware = createWebhookMiddleware(config);

    it('should pass validation with correct signature', async () => {
        const body = JSON.stringify({ events: [] });
        const signature = crypto.createHmac('sha256', config.channelSecret).update(body).digest('base64');

        const req: any = {
            rawBody: body,
            headers: { 'x-line-signature': signature }
        };
        const res: any = {};
        const next = vi.fn();

        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should fail with incorrect signature', async () => {
        const body = JSON.stringify({ events: [] });
        const req: any = {
            rawBody: body,
            headers: { 'x-line-signature': 'wrong_signature' }
        };
        const res: any = {
            statusCode: 200,
            end: vi.fn()
        };
        const next = vi.fn();

        await middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res.end).toHaveBeenCalledWith('Signature validation failed');
    });

    it('should fail without rawBody', async () => {
        const req: any = {
            headers: { 'x-line-signature': 'signature' },
            // no rawBody - stream not readable
            body: {},
            readable: false
        };
        const res: any = {
            statusCode: 200,
            end: vi.fn()
        };
        const next = vi.fn();

        await middleware(req, res, next);

        // When rawBody is not available, middleware returns 401
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res.end).toHaveBeenCalledWith('Signature validation failed');
    });

    it('should fail without signature header', async () => {
        const body = JSON.stringify({ events: [] });
        const req: any = {
            rawBody: body,
            headers: {}  // missing x-line-signature
        };
        const res: any = {
            statusCode: 200,
            end: vi.fn()
        };
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res.end).toHaveBeenCalledWith('Signature validation failed');
    });

    it('should read body from stream if rawBody is missing', async () => {
        const bodyStr = JSON.stringify({ events: [] });
        const signature = crypto.createHmac('sha256', config.channelSecret).update(bodyStr).digest('base64');

        // Mock a readable stream
        const req: any = {
            headers: { 'x-line-signature': signature },
            readable: true,
            listeners: {},
            on: function (event: string, callback: any) {
                if (event === 'data') {
                    callback(Buffer.from(bodyStr));
                }
                if (event === 'end') {
                    callback();
                }
                return this;
            }
        };

        const res: any = {};
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.rawBody).toBe(bodyStr);
        expect(req.body).toEqual(JSON.parse(bodyStr));
    });
});
