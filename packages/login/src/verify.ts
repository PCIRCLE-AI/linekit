import { LineLoginError } from "./errors.js";

export interface VerifyIdTokenResponse {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    nonce?: string;
    amr?: string[];
    name?: string;
    picture?: string;
    email?: string;
}

export async function verifyIdToken(idToken: string, channelId: string): Promise<VerifyIdTokenResponse> {
    if (!idToken) {
        throw new LineLoginError("idToken is required", "INVALID_PARAMETER");
    }
    if (!channelId) {
        throw new LineLoginError("channelId is required", "INVALID_PARAMETER");
    }

    const params = new URLSearchParams();
    params.append('id_token', idToken);
    params.append('client_id', channelId);

    const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new LineLoginError(
            `Failed to verify ID token: ${res.statusText}`,
            "VERIFICATION_FAILED",
            res.status
        );
    }

    return res.json();
}
