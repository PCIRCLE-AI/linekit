import { describe, it, expect } from "vitest";
import { VERSION, init } from "./index.js";

describe("@linekit/liff", () => {
    it("should export VERSION", () => {
        expect(VERSION).toBe("0.0.1");
    });

    it("should throw not implemented error when calling init", () => {
        expect(() => init({ liffId: "test-liff-id" })).toThrow(
            "@linekit/liff is not yet implemented"
        );
    });
});
