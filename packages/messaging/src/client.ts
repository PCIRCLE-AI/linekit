export class LineClientError extends Error {
    public status?: number;
    public data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = "LineClientError";
        this.status = status;
        this.data = data;
    }
}

export async function lineRequest(
    token: string,
    method: string,
    path: string, // starts with /
    body?: any,
    contentType: string = "application/json"
) {
    const url = `https://api.line.me/v2/bot${path}`;
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
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
        } catch (e) {
            data = await res.text();
        }
        throw new LineClientError(`LINE API Error: ${res.statusText}`, res.status, data);
    }

    // Some endpoints return empty body on 200/202
    const text = await res.text();
    return text ? JSON.parse(text) : {};
}

