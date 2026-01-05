import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure random state string for OAuth CSRF protection.
 * @param length - Length of the random bytes (default: 32, resulting in 64 hex characters)
 * @returns A random hex string
 */
export function generateState(length: number = 32): string {
    return randomBytes(length).toString("hex");
}

/**
 * Validate that the returned state matches the expected state.
 * Uses timing-safe comparison to prevent timing attacks.
 * @param expected - The state that was sent in the authorization request
 * @param actual - The state returned from the authorization server
 * @returns true if states match, false otherwise
 */
export function validateState(expected: string, actual: string): boolean {
    if (!expected || !actual) {
        return false;
    }
    if (expected.length !== actual.length) {
        return false;
    }
    // Simple timing-safe comparison for strings
    let result = 0;
    for (let i = 0; i < expected.length; i++) {
        result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }
    return result === 0;
}

/**
 * Generate a cryptographically secure nonce for ID token validation.
 * @param length - Length of the random bytes (default: 32)
 * @returns A random hex string
 */
export function generateNonce(length: number = 32): string {
    return randomBytes(length).toString("hex");
}
