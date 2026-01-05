import { describe, it, expect } from 'vitest';
import { generateState, validateState, generateNonce } from './state.js';

describe('generateState', () => {
    it('should generate a random hex string', () => {
        const state = generateState();

        expect(state).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate 64 character string by default (32 bytes = 64 hex chars)', () => {
        const state = generateState();

        expect(state.length).toBe(64);
    });

    it('should generate different states each time', () => {
        const state1 = generateState();
        const state2 = generateState();

        expect(state1).not.toBe(state2);
    });

    it('should respect custom length parameter', () => {
        const state = generateState(16);

        expect(state.length).toBe(32); // 16 bytes = 32 hex chars
    });
});

describe('validateState', () => {
    it('should return true for matching states', () => {
        const state = 'test-state-12345';

        expect(validateState(state, state)).toBe(true);
    });

    it('should return false for non-matching states', () => {
        expect(validateState('state1', 'state2')).toBe(false);
    });

    it('should return false for different length states', () => {
        expect(validateState('short', 'muchlonger')).toBe(false);
    });

    it('should return false if expected is empty', () => {
        expect(validateState('', 'actual')).toBe(false);
    });

    it('should return false if actual is empty', () => {
        expect(validateState('expected', '')).toBe(false);
    });

    it('should return false if both are empty', () => {
        expect(validateState('', '')).toBe(false);
    });

    it('should return false for null/undefined values', () => {
        expect(validateState(null as any, 'actual')).toBe(false);
        expect(validateState('expected', undefined as any)).toBe(false);
    });

    it('should be timing-safe (same result for different character positions)', () => {
        // Testing that different character positions produce same false result
        // (This is a basic test - real timing attack tests would need actual timing measurements)
        const base = 'abcdefgh';
        const diff1 = 'Xbcdefgh'; // first char different
        const diff2 = 'abcdefgX'; // last char different

        expect(validateState(base, diff1)).toBe(false);
        expect(validateState(base, diff2)).toBe(false);
    });
});

describe('generateNonce', () => {
    it('should generate a random hex string', () => {
        const nonce = generateNonce();

        expect(nonce).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate 64 character string by default', () => {
        const nonce = generateNonce();

        expect(nonce.length).toBe(64);
    });

    it('should generate different nonces each time', () => {
        const nonce1 = generateNonce();
        const nonce2 = generateNonce();

        expect(nonce1).not.toBe(nonce2);
    });

    it('should respect custom length parameter', () => {
        const nonce = generateNonce(8);

        expect(nonce.length).toBe(16); // 8 bytes = 16 hex chars
    });
});
