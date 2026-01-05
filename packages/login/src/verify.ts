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
        throw new Error(`Failed to verify ID token: ${res.statusText}`);
    }

    return res.json();
}
