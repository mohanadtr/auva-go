import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Link, Click } from "@/lib/models";
import { RESERVED_SLUGS } from "@/lib/validations";
import { todayDateString, isExpired } from "@/lib/utils";

/**
 * High-performance redirect handler.
 * Route: GET /[slug]
 *
 * Uses Next.js dynamic route at the root level.
 * For true edge performance, deploy with `export const runtime = "edge"` when
 * using a Redis/Upstash cache instead of Mongoose (Mongoose requires Node runtime).
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;

    // Skip reserved slugs - let Next.js routing handle them
    if (RESERVED_SLUGS.has(slug.toLowerCase())) {
        return new NextResponse(null, { status: 404 });
    }

    try {
        await connectDB();

        const link = await Link.findOne({ slug }).lean();

        if (!link) {
            return NextResponse.redirect(new URL("/404", _req.url), 302);
        }

        if (!link.isActive) {
            return NextResponse.redirect(new URL("/404?reason=disabled", _req.url), 302);
        }

        if (isExpired(link.expiresAt)) {
            return NextResponse.redirect(new URL("/404?reason=expired", _req.url), 302);
        }

        // Fire-and-forget analytics increment (privacy-first: no IP/UA stored)
        incrementClickCount(link._id.toString()).catch(() => { });

        return NextResponse.redirect(link.destination, 302);
    } catch (err) {
        console.error("Redirect error:", err);
        return NextResponse.redirect(new URL("/404", _req.url), 302);
    }
}

async function incrementClickCount(linkId: string) {
    const date = todayDateString();

    await Promise.all([
        // Increment total counter on the link document
        Link.updateOne({ _id: linkId }, { $inc: { clicks: 1 } }),
        // Upsert daily click bucket
        Click.updateOne(
            { linkId, date },
            { $inc: { count: 1 } },
            { upsert: true }
        ),
    ]);
}
