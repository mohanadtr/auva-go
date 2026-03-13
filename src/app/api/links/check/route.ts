import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Link } from "@/lib/models";
import { slugSchema } from "@/lib/validations";
import { jsonOk, jsonError } from "@/lib/utils";

/**
 * GET /api/links/check?slug=myslug
 * Public endpoint – checks slug availability.
 */
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug) return jsonError("slug query parameter is required", 400);

    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) {
        return jsonOk({ available: false, reason: parsed.error.errors[0].message });
    }

    await connectDB();
    const exists = await Link.findOne({ slug: slug.toLowerCase() }).lean();

    return jsonOk({ available: !exists, slug: slug.toLowerCase() });
}
