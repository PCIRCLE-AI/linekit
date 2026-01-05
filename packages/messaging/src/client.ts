export interface LineAPIErrorResponse {
    message?: string;
    details?: Array<{
        message?: string;
        property?: string;
    }>;
}

export class LineClientError extends Error {
    public status?: number;
    public data?: LineAPIErrorResponse | string;

    constructor(message: string, status?: number, data?: LineAPIErrorResponse | string) {
        super(message);
        this.name = "LineClientError";
        this.status = status;
        this.data = data;
    }
}

export async function lineRequest<T = Record<string, unknown>>(
    token: string,
    method: string,
    path: string, // starts with /
    body?: object,
    contentType: string = "application/json"
): Promise<T> {
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
        let data: LineAPIErrorResponse | string;
        try {
            data = await res.json();
        } catch {
            data = await res.text();
        }
        throw new LineClientError(`LINE API Error: ${res.statusText}`, res.status, data);
    }

    // Some endpoints return empty body on 200/202
    const text = await res.text();
    if (!text) {
        return {} as T;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        throw new LineClientError(
            "Failed to parse LINE API response as JSON",
            res.status,
            text
        );
    }
}

