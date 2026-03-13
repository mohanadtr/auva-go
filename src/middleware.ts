import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCOUNT_LOGIN_URL = "https://account.auva.dev/login";

function hasValidAccessToken(token: string | undefined): boolean {
    if (!token) return false;

    try {
        const parts = token.split(".");
        if (parts.length !== 3) return false;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (!payload.userId || !payload.username || !payload.email || !payload.name) return false;
        if (payload.exp && payload.exp * 1000 < Date.now()) return false;
        return true;
    } catch {
        return false;
    }
}

/**
 * Edge Middleware – runs before every request on Vercel's edge.
 *
 * Responsibilities:
 *  1. Redirect auva.site to go.auva.dev
 *  2. Add security headers
 *  3. (Future) Move slug lookup to edge with Redis for sub-10ms redirects
 */
export function middleware(request: NextRequest) {
    const { pathname, hostname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("auva_token")?.value;
        if (!hasValidAccessToken(token)) {
            return NextResponse.redirect(ACCOUNT_LOGIN_URL, 302);
        }
    }

    // Redirect auva.site root domain to go.auva.dev
    if (hostname === "auva.site" && pathname === "/") {
        return NextResponse.redirect("https://go.auva.dev", 301);
    }

    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("X-DNS-Prefetch-Control", "on");

    return response;
}

export const config = {
    // Run on all routes except static files and Next.js internals
    matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js).*)"],
};
