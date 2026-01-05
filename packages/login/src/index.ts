export * from "./verify.js";
export * from "./oauth.js";
export * from "./errors.js";
export * from "./state.js";

// Facade for convenience
import { verifyIdToken } from "./verify.js";
import { generateState, validateState, generateNonce } from "./state.js";

export const login = {
    verify: verifyIdToken,
    generateState,
    validateState,
    generateNonce,
};
