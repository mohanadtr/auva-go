import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Link, Click } from "@/lib/models";
import { updateLinkSchema, RESERVED_SLUGS } from "@/lib/validations";
import { jsonOk, jsonError, shortUrl } from "@/lib/utils";

/* ── GET /api/links/[id] – Get link details + analytics ─────────────────── */

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getAuthUser();
        if (!user) return jsonError("Unauthorized", 401);

        await connectDB();

        const link = await Link.findOne({
            _id: params.id,
            userId: user.userId,
        }).lean();

        if (!link) return jsonError("Link not found", 404);

        // Fetch daily click data for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateStr = thirtyDaysAgo.toISOString().slice(0, 10);

        const dailyClicks = await Click.find({
            linkId: link._id,
            date: { $gte: dateStr },
        })
            .sort({ date: 1 })
            .lean();

        return jsonOk({
            id: link._id,
            slug: link.slug,
            domain: link.domain || "go.auva.dev",
            shortUrl: shortUrl(link.slug, link.domain),
            destination: link.destination,
            clicks: link.clicks,
            isActive: link.isActive,
            expiresAt: link.expiresAt,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt,
            dailyClicks: dailyClicks.map((c) => ({ date: c.date, count: c.count })),
        });
    } catch (err: any) {
        console.error("Get link error:", err);
        return jsonError("Internal server error", 500);
    }
}

/* ── PATCH /api/links/[id] – Update link ──────────────────────────────── */

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getAuthUser();
        if (!user) return jsonError("Unauthorized", 401);

        const body = await req.json();
        const parsed = updateLinkSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError(parsed.error.errors[0].message, 422);
        }

        await connectDB();

        const link = await Link.findOne({
            _id: params.id,
            userId: user.userId,
        });

        if (!link) return jsonError("Link not found", 404);

        // Handle slug change
        if (parsed.data.slug !== undefined) {
            const newSlug = parsed.data.slug.toLowerCase();
            if (RESERVED_SLUGS.has(newSlug)) {
                return jsonError("This slug is reserved", 422);
            }
            if (newSlug !== link.slug) {
                const exists = await Link.findOne({ slug: newSlug }).lean();
                if (exists) {
                    return jsonError("This slug is already taken", 409);
                }
                link.slug = newSlug;
            }
        }

        if (parsed.data.domain !== undefined) link.domain = parsed.data.domain;
        if (parsed.data.destination !== undefined) link.destination = parsed.data.destination;
        if (parsed.data.isActive !== undefined) link.isActive = parsed.data.isActive;
        if (parsed.data.expiresAt !== undefined) {
            link.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined;
        }

        await link.save();

        return jsonOk({
            id: link._id,
            slug: link.slug,
            domain: link.domain || "go.auva.dev",
            shortUrl: shortUrl(link.slug, link.domain),
            destination: link.destination,
            isActive: link.isActive,
            expiresAt: link.expiresAt,
        });
    } catch (err: any) {
        console.error("Update link error:", err);
        return jsonError("Internal server error", 500);
    }
}

/* ── DELETE /api/links/[id] – Soft-delete (disable) ───────────────────── */

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getAuthUser();
        if (!user) return jsonError("Unauthorized", 401);

        await connectDB();

        const link = await Link.findOneAndUpdate(
            { _id: params.id, userId: user.userId },
            { isActive: false },
            { new: true }
        );

        if (!link) return jsonError("Link not found", 404);

        return jsonOk({ message: "Link disabled", id: link._id });
    } catch (err: any) {
        console.error("Delete link error:", err);
        return jsonError("Internal server error", 500);
    }
}
