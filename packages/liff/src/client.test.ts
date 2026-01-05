
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { LiffClient } from "./client.js";

describe("LiffClient", () => {
    const token = "test-token";
    let client: LiffClient;
    let fetchMock: Mock;

    beforeEach(() => {
        client = new LiffClient({ channelAccessToken: token });
        fetchMock = vi.fn();
        global.fetch = fetchMock;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should instantiate correctly", () => {
        expect(client).toBeInstanceOf(LiffClient);
    });

    describe("getAll", () => {
        it("should fetch apps correctly", async () => {
            const mockApps = [{ liffId: "123", view: { type: "full", url: "https://example.com" } }];
            fetchMock.mockResolvedValue({
                ok: true,
                text: () => Promise.resolve(JSON.stringify({ apps: mockApps })),
            });

            const apps = await client.getAll();
            expect(apps).toEqual(mockApps);
            expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/liff/v1/apps", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: undefined, // GET request body is undefined
            });
        });

        it("should handle error", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 401,
                statusText: "Unauthorized",
                text: () => Promise.resolve("Error"),
            });

            await expect(client.getAll()).rejects.toThrow("LIFF API Error: Unauthorized");
        });
    });

    describe("add", () => {
        it("should add app correctly", async () => {
            const mockView = { type: "full" as const, url: "https://example.com" };
            fetchMock.mockResolvedValue({
                ok: true,
                text: () => Promise.resolve(JSON.stringify({ liffId: "new-id" })),
            });

            const res = await client.add(mockView);
            expect(res).toEqual({ liffId: "new-id" });
            expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/liff/v1/apps", expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ view: mockView }),
            }));
        });
    });

    describe("update", () => {
        it("should update app correctly", async () => {
            const mockView = { type: "compact" as const, url: "https://example.com" };
            fetchMock.mockResolvedValue({
                ok: true,
                text: () => Promise.resolve("{}"),
            });

            await client.update("test-id", mockView);
            expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/liff/v1/apps/test-id/view", expect.objectContaining({
                method: "PUT",
                body: JSON.stringify({ view: mockView }),
            }));
        });
    });

    describe("delete", () => {
        it("should delete app correctly", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                text: () => Promise.resolve("{}"),
            });

            await client.delete("test-id");
            expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/liff/v1/apps/test-id", expect.objectContaining({
                method: "DELETE",
            }));
        });
    });
});
