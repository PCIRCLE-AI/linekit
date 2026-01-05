export class LineLoginError extends Error {
    public code?: string;
    public status?: number;

    constructor(message: string, code?: string, status?: number) {
        super(message);
        this.name = "LineLoginError";
        this.code = code;
        this.status = status;
    }
}
