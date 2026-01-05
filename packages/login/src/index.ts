export * from "./verify.js";
export * from "./oauth.js";

// Facade for convenience (as requested by user)
import { verifyIdToken } from "./verify.js";
export const login = {
    verify: verifyIdToken
};
