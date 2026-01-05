import { describe, it, expect } from "vitest";
import { VERSION, LiffClient } from "./index.js";

describe("@linekit/liff", () => {
    it("should export VERSION", () => {
        expect(VERSION).toBe("0.1.0");
    });

    it("should export LiffClient", () => {
        expect(LiffClient).toBeDefined();
    });
});
