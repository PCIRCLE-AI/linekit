import { LiffApp, LiffView, LiffAppsResponse } from "./types.js";

export class LiffClientError extends Error {
    public status?: number;
    public data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = "LiffClientError";
        this.status = status;
        this.data = data;
    }
}

async function liffRequest<T>(token: string, method: string, path: string, body?: any): Promise<T> {
    const url = `https://api.line.me/liff/v1${path}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        let data;
        try {
            data = await res.json();
        } catch {
            data = await res.text();
        }
        throw new LiffClientError(`LIFF API Error: ${res.statusText}`, res.status, data);
    }

    const text = await res.text();
    if (!text) return {} as T;
    return JSON.parse(text) as T;
}

export class LiffClient {
    private channelAccessToken: string;

    constructor(config: { channelAccessToken: string }) {
        this.channelAccessToken = config.channelAccessToken;
    }

    /**
     * GetAll LIFF apps
     */
    async getAll(): Promise<LiffApp[]> {
        const res = await liffRequest<LiffAppsResponse>(this.channelAccessToken, "GET", "/apps");
        return res.apps || [];
    }

    /**
     * Add a new LIFF app
     */
    async add(view: LiffView): Promise<{ liffId: string }> {
        return liffRequest<{ liffId: string }>(this.channelAccessToken, "POST", "/apps", { view });
    }

    /**
     * Update an existing LIFF app
     */
    async update(liffId: string, view: LiffView): Promise<void> {
        return liffRequest<void>(this.channelAccessToken, "PUT", `/apps/${liffId}/view`, { view });
    }

    /**
     * Delete a LIFF app
     */
    async delete(liffId: string): Promise<void> {
        return liffRequest<void>(this.channelAccessToken, "DELETE", `/apps/${liffId}`);
    }
}
