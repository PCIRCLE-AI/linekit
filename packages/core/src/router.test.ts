import { describe, it, expect, vi } from 'vitest';
import { createRouter } from './router.js';

describe('router', () => {
    const config = { channelSecret: 's', channelAccessToken: 't' };

    it('should dispatch message event to handler', async () => {
        const handler = vi.fn();
        const router = createRouter(config, {
            message: handler
        });

        const req: any = {
            body: {
                events: [{ type: 'message', source: { userId: 'u1' } }]
            }
        };
        const res: any = { status: () => ({ end: () => { } }) };

        await router(req, res);
        expect(handler).toHaveBeenCalled();
    });

    it('should ignore unknown event types', async () => {
        const handler = vi.fn();
        const router = createRouter(config, {
            message: handler
        });

        const req: any = {
            body: {
                events: [{ type: 'unknown_event' }]
            }
        };
        const res: any = { status: () => ({ end: () => { } }) };

        await router(req, res);
        expect(handler).not.toHaveBeenCalled();
    });
});
