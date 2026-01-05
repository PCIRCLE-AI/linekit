import { describe, it, expect, vi, beforeEach } from 'vitest';
import { multicast } from './multicast.js';
import { LineClientError } from './client.js';
import type { Message } from './types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('multicast', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('{}'),
            json: () => Promise.resolve({}),
        });
    });

    const validToken = 'test-token';
    const validRecipients = ['U1234567890abcdef', 'U0987654321fedcba'];
    const validMessage: Message = { type: 'text', text: 'Hello' };

    it('should throw if token is missing', async () => {
        await expect(multicast('', validRecipients, [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(multicast('', validRecipients, [validMessage]))
            .rejects.toThrow('token is required');
    });

    it('should throw if recipients array is empty', async () => {
        await expect(multicast(validToken, [], [validMessage]))
            .rejects.toThrow(LineClientError);
        await expect(multicast(validToken, [], [validMessage]))
            .rejects.toThrow('recipients (to) must be a non-empty array');
    });

    it('should throw if messages is empty', async () => {
        await expect(multicast(validToken, validRecipients, []))
            .rejects.toThrow(LineClientError);
    });

    it('should call LINE API with correct parameters', async () => {
        await multicast(validToken, validRecipients, [validMessage]);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/multicast',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    to: validRecipients,
                    messages: [validMessage],
                }),
            })
        );
    });

    it('should handle multiple messages', async () => {
        const messages: Message[] = [
            { type: 'text', text: 'Hello' },
            { type: 'text', text: 'World' },
        ];

        await multicast(validToken, validRecipients, messages);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/v2/bot/message/multicast',
            expect.objectContaining({
                body: JSON.stringify({
                    to: validRecipients,
                    messages: messages,
                }),
            })
        );
    });
});
