import { describe, it, expect } from 'vitest';
import { validateMessages, validateRecipients, MAX_MESSAGES_PER_REQUEST, MAX_RECIPIENTS } from './validation.js';
import { LineClientError } from './client.js';
import type { Message } from './types.js';

describe('validateMessages', () => {
    const validMessage: Message = { type: 'text', text: 'Hello' };

    it('should pass with valid messages array', () => {
        expect(() => validateMessages([validMessage])).not.toThrow();
    });

    it('should pass with multiple valid messages', () => {
        const messages = Array(5).fill(validMessage);
        expect(() => validateMessages(messages)).not.toThrow();
    });

    it('should throw if messages is not an array', () => {
        expect(() => validateMessages('not an array' as any)).toThrow(LineClientError);
        expect(() => validateMessages('not an array' as any)).toThrow('messages must be an array');
    });

    it('should throw if messages array is empty', () => {
        expect(() => validateMessages([])).toThrow(LineClientError);
        expect(() => validateMessages([])).toThrow('At least one message is required');
    });

    it('should throw if messages exceed maximum limit', () => {
        const messages = Array(MAX_MESSAGES_PER_REQUEST + 1).fill(validMessage);
        expect(() => validateMessages(messages)).toThrow(LineClientError);
        expect(() => validateMessages(messages)).toThrow(`Maximum ${MAX_MESSAGES_PER_REQUEST} messages per request`);
    });
});

describe('validateRecipients', () => {
    it('should pass with valid recipients array', () => {
        expect(() => validateRecipients(['user1'])).not.toThrow();
    });

    it('should pass with multiple valid recipients', () => {
        const recipients = Array(100).fill('user');
        expect(() => validateRecipients(recipients)).not.toThrow();
    });

    it('should throw if recipients is not an array', () => {
        expect(() => validateRecipients('not an array' as any)).toThrow(LineClientError);
        expect(() => validateRecipients('not an array' as any)).toThrow('recipients (to) must be a non-empty array');
    });

    it('should throw if recipients array is empty', () => {
        expect(() => validateRecipients([])).toThrow(LineClientError);
        expect(() => validateRecipients([])).toThrow('recipients (to) must be a non-empty array');
    });

    it('should throw if recipients exceed maximum limit', () => {
        const recipients = Array(MAX_RECIPIENTS + 1).fill('user');
        expect(() => validateRecipients(recipients)).toThrow(LineClientError);
        expect(() => validateRecipients(recipients)).toThrow(`Maximum ${MAX_RECIPIENTS} recipients per request`);
    });
});
