import { describe, it, expect, vi } from "vitest";
import { lineMiddleware } from "./index.js";

// Mock the core module
vi.mock("@linekit/core", () => ({
    createWebhookMiddleware: vi.fn(() => {
        return vi.fn((_req, _res, next) => next());
    }),
}));

describe("@linekit/express", () => {
    it("should export lineMiddleware function", () => {
        expect(typeof lineMiddleware).toBe("function");
    });

    it("should create middleware with channel secret config", () => {
        const middleware = lineMiddleware({ channelSecret: "test-secret" });
        expect(typeof middleware).toBe("function");
    });

    it("should return a function that accepts req, res, next", () => {
        const middleware = lineMiddleware({ channelSecret: "test-secret" });
        const req = {} as any;
        const res = {} as any;
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
