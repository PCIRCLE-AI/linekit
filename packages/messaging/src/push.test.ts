import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pushMessage, pushText } from './push.js';
import { LineClientError } from './client.js';
import type { Message } from './types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('pushMessage', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        });
    });

    const validToken = 'test-token';
    const validTo = 'U1234567890abcdef';
    const validMessage: Message = { type: 'text', text: 'Hello' };

    it('should throw if token is missing', async () => {
        await expect(pushMessage('', validTo, [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(pushMessage('', validTo, [validMessage]))
            .rejects.toThrow('token is required');
    });

    it('should throw if recipient is missing', async () => {
        await expect(pushMessage(validToken, '', [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(pushMessage(validToken, '', [validMessage]))
            .rejects.toThrow('recipient (to) is required');
    });

    it('should throw if messages is empty', async () => {
        await expect(pushMessage(validToken, validTo, []))
            .rejects.toThrow(LineClientError);
    });

    it('should call LINE API with correct parameters', async () => {
        await pushMessage(validToken, validTo, [validMessage]);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/push',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    to: validTo,
                    messages: [validMessage],
                }),
            })
        );
    });
});

describe('pushText', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        });
    });

    it('should throw if text is missing', async () => {
        await expect(pushText('token', 'U1234567890abcdef', ''))
            .rejects.toThrow(LineClientError);
        await expect(pushText('token', 'U1234567890abcdef', ''))
            .rejects.toThrow('text is required');
    });

    it('should create a text message and call pushMessage', async () => {
        await pushText('token', 'U1234567890abcdef', 'Hello World');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/push',
            expect.objectContaining({
                body: JSON.stringify({
                    to: 'U1234567890abcdef',
                    messages: [{ type: 'text', text: 'Hello World' }],
                }),
            })
        );
    });
});
