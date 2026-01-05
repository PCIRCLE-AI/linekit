/**
 * @linekit/liff - LINE LIFF (LINE Front-end Framework) SDK
 *
 * This package is currently under development.
 *
 * Planned features:
 * - LIFF initialization and configuration
 * - User profile access
 * - Message sending capabilities
 * - Share target picker
 * - QR code scanner
 * - Bluetooth integration
 *
 * @see https://developers.line.biz/en/docs/liff/overview/
 */

/**
 * LIFF SDK version
 */
export const VERSION = "0.0.1";

/**
 * Placeholder for LIFF initialization
 * @throws Error - Not yet implemented
 */
export function init(_config: { liffId: string }): Promise<void> {
    throw new Error(
        "@linekit/liff is not yet implemented. This package is a placeholder for future development."
    );
}

/**
 * Placeholder type for LIFF configuration
 */
export interface LiffConfig {
    liffId: string;
}
