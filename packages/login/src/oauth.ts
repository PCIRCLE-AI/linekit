export interface GenerateAuthUrlOptions {
    channelId: string;
    redirectUri: string;
    state: string;
    scope?: string;
    nonce?: string;
    botPrompt?: 'normal' | 'aggressive';
}

export function generateAuthUrl(options: GenerateAuthUrlOptions): string {
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', options.channelId);
    params.append('redirect_uri', options.redirectUri);
    params.append('state', options.state);
    params.append('scope', options.scope || 'profile openid');

    if (options.nonce) params.append('nonce', options.nonce);
    if (options.botPrompt) params.append('bot_prompt', options.botPrompt);

    return `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
}

export interface IssueAccessTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    id_token?: string;
}

export async function issueAccessToken(
    channelId: string,
    channelSecret: string,
    code: string,
    redirectUri: string
): Promise<IssueAccessTokenResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', channelId);
    params.append('client_secret', channelSecret);

    const res = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to issue access token: ${res.statusText} ${err}`);
    }

    return res.json();
}
