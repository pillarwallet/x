/**
 * Session Manager for Keystore Security
 * 
 * Manages inactivity timeout for cached private keys to enhance security.
 * Automatically clears sensitive data from memory after configured inactivity period.
 */

// Configuration
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

// State
let lastActivityTimestamp: number = Date.now();
let timeoutId: NodeJS.Timeout | null = null;
let onSessionExpiredCallback: (() => void) | null = null;

/**
 * Initialize the session manager with a callback to execute when session expires
 */
export function initializeSessionManager(onSessionExpired: () => void): void {
    onSessionExpiredCallback = onSessionExpired;
    resetInactivityTimer();
}

/**
 * Reset the inactivity timer
 * Call this on any wallet operation to keep the session alive
 */
export function resetInactivityTimer(): void {
    lastActivityTimestamp = Date.now();

    // Clear existing timeout
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
        console.log('[SessionManager] Session expired due to inactivity');
        clearSession();
    }, INACTIVITY_TIMEOUT_MS);
}

/**
 * Manually clear the session
 * Call this on logout or lock operations
 */
export function clearSession(): void {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    if (onSessionExpiredCallback) {
        onSessionExpiredCallback();
    }

    lastActivityTimestamp = 0;
}

/**
 * Get time remaining until session expires (in milliseconds)
 */
export function getTimeUntilExpiry(): number {
    if (!lastActivityTimestamp) return 0;

    const elapsed = Date.now() - lastActivityTimestamp;
    const remaining = INACTIVITY_TIMEOUT_MS - elapsed;

    return Math.max(0, remaining);
}

/**
 * Check if session is still active
 */
export function isSessionActive(): boolean {
    return getTimeUntilExpiry() > 0;
}

/**
 * Get the configured timeout duration (in milliseconds)
 */
export function getTimeoutDuration(): number {
    return INACTIVITY_TIMEOUT_MS;
}
