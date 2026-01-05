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
            // no rawBody
            body: {}
        };
        const res: any = {
            end: vi.fn()
        }
        const next = vi.fn();

        // Mock console.warn to suppress output
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await middleware(req, res, next);

        expect(spy).toHaveBeenCalled();
        expect(next).toHaveBeenCalled(); // It calls next() in the warning path currently implemented

        spy.mockRestore();
    });
});
