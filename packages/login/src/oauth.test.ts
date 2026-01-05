import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAuthUrl, issueAccessToken } from './oauth.js';
import { LineLoginError } from './errors.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('generateAuthUrl', () => {
    const validOptions = {
        channelId: 'test-channel-id',
        redirectUri: 'https://example.com/callback',
        state: 'random-state-string',
    };

    it('should generate valid authorization URL', () => {
        const url = generateAuthUrl(validOptions);

        expect(url).toContain('https://access.line.me/oauth2/v2.1/authorize');
        expect(url).toContain('response_type=code');
        expect(url).toContain(`client_id=${validOptions.channelId}`);
        expect(url).toContain(`redirect_uri=${encodeURIComponent(validOptions.redirectUri)}`);
        expect(url).toContain(`state=${validOptions.state}`);
        expect(url).toContain('scope=profile+openid'); // default scope
    });

    it('should include custom scope', () => {
        const url = generateAuthUrl({ ...validOptions, scope: 'profile openid email' });

        expect(url).toContain('scope=profile+openid+email');
    });

    it('should include nonce when provided', () => {
        const url = generateAuthUrl({ ...validOptions, nonce: 'test-nonce' });

        expect(url).toContain('nonce=test-nonce');
    });

    it('should include botPrompt when provided', () => {
        const url = generateAuthUrl({ ...validOptions, botPrompt: 'aggressive' });

        expect(url).toContain('bot_prompt=aggressive');
    });

    it('should throw if channelId is missing', () => {
        expect(() => generateAuthUrl({ ...validOptions, channelId: '' }))
            .toThrow(LineLoginError);
        expect(() => generateAuthUrl({ ...validOptions, channelId: '' }))
            .toThrow('channelId is required');
    });

    it('should throw if redirectUri is missing', () => {
        expect(() => generateAuthUrl({ ...validOptions, redirectUri: '' }))
            .toThrow(LineLoginError);
        expect(() => generateAuthUrl({ ...validOptions, redirectUri: '' }))
            .toThrow('redirectUri is required');
    });

    it('should throw if state is missing', () => {
        expect(() => generateAuthUrl({ ...validOptions, state: '' }))
            .toThrow(LineLoginError);
        expect(() => generateAuthUrl({ ...validOptions, state: '' }))
            .toThrow('state is required for CSRF protection');
    });
});

describe('issueAccessToken', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    const channelId = 'test-channel-id';
    const channelSecret = 'test-channel-secret';
    const code = 'test-code';
    const redirectUri = 'https://example.com/callback';

    it('should call LINE API with correct parameters', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                access_token: 'test-access-token',
                token_type: 'Bearer',
                refresh_token: 'test-refresh-token',
                expires_in: 2592000,
                scope: 'profile openid',
            }),
        });

        const result = await issueAccessToken(channelId, channelSecret, code, redirectUri);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.line.me/oauth2/v2.1/token',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
        );

        expect(result.access_token).toBe('test-access-token');
    });

    it('should throw if channelId is missing', async () => {
        await expect(issueAccessToken('', channelSecret, code, redirectUri))
            .rejects.toThrow(LineLoginError);
    });

    it('should throw if channelSecret is missing', async () => {
        await expect(issueAccessToken(channelId, '', code, redirectUri))
            .rejects.toThrow(LineLoginError);
    });

    it('should throw if code is missing', async () => {
        await expect(issueAccessToken(channelId, channelSecret, '', redirectUri))
            .rejects.toThrow(LineLoginError);
    });

    it('should throw if redirectUri is missing', async () => {
        await expect(issueAccessToken(channelId, channelSecret, code, ''))
            .rejects.toThrow(LineLoginError);
    });

    it('should throw on API error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            text: () => Promise.resolve('Invalid code'),
        });

        await expect(issueAccessToken(channelId, channelSecret, code, redirectUri))
            .rejects.toThrow(LineLoginError);
    });
});
