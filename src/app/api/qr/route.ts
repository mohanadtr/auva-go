import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { shortUrl, jsonError } from "@/lib/utils";
import { slugSchema } from "@/lib/validations";

/**
 * GET /api/qr?slug=abc&domain=auva.site&format=png|svg&size=300
 * Generates a QR code for the given slug.
 */
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get("slug");
    const domain = req.nextUrl.searchParams.get("domain") || undefined;
    const format = req.nextUrl.searchParams.get("format") || "png";
    const size = Math.min(Math.max(parseInt(req.nextUrl.searchParams.get("size") || "300"), 100), 1000);

    if (!slug) return jsonError("slug query parameter is required", 400);

    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) {
        return jsonError("Invalid slug", 400);
    }

    const url = shortUrl(slug, domain);

    try {
        if (format === "svg") {
            const svg = await QRCode.toString(url, {
                type: "svg",
                width: size,
                margin: 2,
                color: { dark: "#000000", light: "#ffffff" },
            });

            return new NextResponse(svg, {
                headers: {
                    "Content-Type": "image/svg+xml",
                    "Content-Disposition": `attachment; filename="auva-go-${slug}.svg"`,
                    "Cache-Control": "public, max-age=86400",
                },
            });
        }

        // Default: PNG
        const buffer = await QRCode.toBuffer(url, {
            type: "png",
            width: size,
            margin: 2,
            color: { dark: "#000000", light: "#ffffff" },
        });

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename="auva-go-${slug}.png"`,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch (err) {
        console.error("QR generation error:", err);
        return jsonError("Failed to generate QR code", 500);
    }
}
