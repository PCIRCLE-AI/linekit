import { describe, it, expect, vi, beforeEach } from 'vitest';
import { replyMessage, replyText } from './reply.js';
import { LineClientError } from './client.js';
import type { Message } from './types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('replyMessage', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        });
    });

    const validToken = 'test-token';
    const validReplyToken = 'test-reply-token';
    const validMessage: Message = { type: 'text', text: 'Hello' };

    it('should throw if token is missing', async () => {
        await expect(replyMessage('', validReplyToken, [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(replyMessage('', validReplyToken, [validMessage]))
            .rejects.toThrow('token is required');
    });

    it('should throw if replyToken is missing', async () => {
        await expect(replyMessage(validToken, '', [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(replyMessage(validToken, '', [validMessage]))
            .rejects.toThrow('replyToken is required');
    });

    it('should throw if messages is empty', async () => {
        await expect(replyMessage(validToken, validReplyToken, []))
            .rejects.toThrow(LineClientError);
    });

    it('should call LINE API with correct parameters', async () => {
        await replyMessage(validToken, validReplyToken, [validMessage]);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/reply',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    replyToken: validReplyToken,
                    messages: [validMessage],
                }),
            })
        );
    });
});

describe('replyText', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        });
    });

    it('should throw if text is missing', async () => {
        await expect(replyText('token', 'reply-token', ''))
            .rejects.toThrow(LineClientError);
        await expect(replyText('token', 'reply-token', ''))
            .rejects.toThrow('text is required');
    });

    it('should create a text message and call replyMessage', async () => {
        await replyText('token', 'reply-token', 'Hello World');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/reply',
            expect.objectContaining({
                body: JSON.stringify({
                    replyToken: 'reply-token',
                    messages: [{ type: 'text', text: 'Hello World' }],
                }),
            })
        );
    });
});
