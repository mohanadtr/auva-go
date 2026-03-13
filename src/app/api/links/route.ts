import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Link } from "@/lib/models";
import { createLinkSchema, RESERVED_SLUGS } from "@/lib/validations";
import { generateSlug, jsonOk, jsonError, shortUrl } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

/* ── POST /api/links – Create a short link ─────────────────────────────── */

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();

        // Rate limit: use userId if logged in, otherwise IP
        const key = user
            ? `links:${user.userId}`
            : `links:${req.headers.get("x-forwarded-for") ?? "anon"}`;

        const rl = rateLimit(key);
        if (!rl.success) {
            return jsonError(`Rate limit exceeded. Retry after ${rl.retryAfter}s`, 429);
        }

        const body = await req.json();
        const parsed = createLinkSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError(parsed.error.errors[0].message, 422);
        }

        await connectDB();

        // Determine slug
        let slug = parsed.data.slug?.toLowerCase();
        if (slug) {
            if (RESERVED_SLUGS.has(slug)) {
                return jsonError("This slug is reserved", 422);
            }
            const exists = await Link.findOne({ slug }).lean();
            if (exists) {
                return jsonError("This slug is already taken", 409);
            }
        } else {
            // Generate random slug, retry on collision
            let attempts = 0;
            do {
                slug = generateSlug();
                attempts++;
            } while ((await Link.findOne({ slug }).lean()) && attempts < 5);

            if (attempts >= 5) {
                return jsonError("Could not generate a unique slug. Please try again.", 500);
            }
        }

        const domain = parsed.data.domain || "go.auva.dev";

        const link = await Link.create({
            slug,
            destination: parsed.data.destination,
            domain,
            userId: user?.userId,
            expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
        });

        return jsonOk(
            {
                id: link._id,
                slug: link.slug,
                domain: link.domain,
                shortUrl: shortUrl(link.slug, link.domain),
                destination: link.destination,
                expiresAt: link.expiresAt,
                createdAt: link.createdAt,
            },
            201
        );
    } catch (err: any) {
        console.error("Create link error:", err);
        return jsonError("Internal server error", 500);
    }
}

/* ── GET /api/links – List links for authenticated user ─────────────────── */

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return jsonError("Unauthorized", 401);
        }

        await connectDB();

        const userId = user.userId;
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "20"), 100);
        const skip = (page - 1) * limit;

        const [links, total] = await Promise.all([
            Link.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Link.countDocuments({ userId }),
        ]);

        return jsonOk({
            links: links.map((l) => ({
                id: l._id,
                slug: l.slug,
                domain: l.domain || "go.auva.dev",
                shortUrl: shortUrl(l.slug, l.domain),
                destination: l.destination,
                clicks: l.clicks,
                isActive: l.isActive,
                expiresAt: l.expiresAt,
                createdAt: l.createdAt,
            })),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err: any) {
        console.error("List links error:", err);
        return jsonError("Internal server error", 500);
    }
}
