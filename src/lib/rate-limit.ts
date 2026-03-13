/* ─── In-memory sliding-window rate limiter ───────────────────────────── */
// Suitable for Vercel serverless – for high-scale, swap with Upstash Redis.

interface RateLimitEntry {
    timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "20", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

/**
 * Returns `{ success: true }` if under limit, or `{ success: false, retryAfter }` if over.
 * Key should be a stable per-user identifier (userId or hashed IP).
 */
export function rateLimit(key: string): { success: boolean; retryAfter?: number } {
    const now = Date.now();
    let entry = store.get(key);

    if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

    if (entry.timestamps.length >= MAX_REQUESTS) {
        const oldest = entry.timestamps[0];
        const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
        return { success: false, retryAfter };
    }

    entry.timestamps.push(now);
    return { success: true };
}

// Periodic cleanup every 5 minutes to prevent memory leak
if (typeof globalThis !== "undefined") {
    const CLEANUP_INTERVAL = 5 * 60 * 1000;
    setInterval(() => {
        const now = Date.now();
        store.forEach((entry, key) => {
            entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
            if (entry.timestamps.length === 0) store.delete(key);
        });
    }, CLEANUP_INTERVAL).unref?.();
}
