import { z } from "zod";

/* ─── Reserved slugs ──────────────────────────────────────────────────── */

export const RESERVED_SLUGS = new Set([
    "admin",
    "api",
    "login",
    "register",
    "signup",
    "signin",
    "signout",
    "logout",
    "forgot-password",
    "reset-password",
    "report",
    "abuse",
    "dashboard",
    "settings",
    "account",
    "help",
    "about",
    "terms",
    "privacy",
    "health",
    "status",
    "static",
    "verify",
    "_next",
    "favicon.ico",
]);

/* ─── Slug rules ──────────────────────────────────────────────────────── */

const SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

export const slugSchema = z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(64, "Slug must be 64 characters or fewer")
    .regex(SLUG_REGEX, "Slug may only contain letters, numbers, hyphens, and underscores")
    .refine((s) => !RESERVED_SLUGS.has(s.toLowerCase()), {
        message: "This slug is reserved",
    });

/* ─── URL validation ──────────────────────────────────────────────────── */

export const urlSchema = z
    .string()
    .url("Please enter a valid URL")
    .max(2048, "URL is too long")
    .refine(
        (u) => {
            try {
                const url = new URL(u);
                return ["http:", "https:"].includes(url.protocol);
            } catch {
                return false;
            }
        },
        { message: "Only http and https URLs are allowed" }
    );

/* ─── Domain validation ───────────────────────────────────────────────── */

export const domainSchema = z.enum(["go.auva.dev", "auva.site"]).default("go.auva.dev");

/* ─── Link creation payload ───────────────────────────────────────────── */

export const createLinkSchema = z.object({
    destination: urlSchema,
    slug: slugSchema.optional(), // if omitted, generate random
    domain: domainSchema.optional(),
    expiresAt: z
        .string()
        .datetime()
        .optional()
        .refine(
            (d) => {
                if (!d) return true;
                return new Date(d) > new Date();
            },
            { message: "Expiration date must be in the future" }
        ),
});

/* ─── Link update payload ─────────────────────────────────────────────── */

export const updateLinkSchema = z.object({
    destination: urlSchema.optional(),
    slug: slugSchema.optional(),
    domain: z.enum(["go.auva.dev", "auva.site"]).optional(),
    isActive: z.boolean().optional(),
    expiresAt: z
        .string()
        .datetime()
        .nullable()
        .optional(),
});

/* ─── Account update schemas ──────────────────────────────────────────── */

export const updateProfileSchema = z.object({
    username: z.string().min(3).max(20).optional(),
});
