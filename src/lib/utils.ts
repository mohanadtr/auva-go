import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ─── Slug generation ─────────────────────────────────────────────────── */

// URL-safe, unambiguous alphabet (no l/1/I/0/O)
const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
const generate = customAlphabet(alphabet, 7);

export function generateSlug(): string {
    return generate();
}

/* ─── Tailwind cn helper ──────────────────────────────────────────────── */

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* ─── Date helpers ────────────────────────────────────────────────────── */

export function todayDateString(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function isExpired(expiresAt?: Date | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
}

/* ─── Generic API response helpers ────────────────────────────────────── */

export function jsonOk<T>(data: T, status = 200) {
    return Response.json(data, { status });
}

export function jsonError(message: string, status = 400) {
    return Response.json({ error: message }, { status });
}

/* ─── Absolute URL builder ────────────────────────────────────────────── */

const DOMAIN_BASE_URLS: Record<string, string> = {
    "go.auva.dev": "https://go.auva.dev",
    "auva.site": "https://auva.site",
};

export function shortUrl(slug: string, domain?: string): string {
    const base = domain
        ? DOMAIN_BASE_URLS[domain] || DOMAIN_BASE_URLS["go.auva.dev"]
        : process.env.NEXT_PUBLIC_APP_URL || "https://go.auva.dev";
    return `${base}/${slug}`;
}
