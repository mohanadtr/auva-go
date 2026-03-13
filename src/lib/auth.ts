import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface AuthUser {
    userId: string;
    name: string;
    username: string;
    email: string;
}

/**
 * Server-side: reads the access token cookie and verifies the JWT locally.
 * Used by API routes to authenticate requests.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auva_token")?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload.userId || !payload.name || !payload.username || !payload.email) {
            return null;
        }
        return {
            userId: payload.userId as string,
            name: payload.name as string,
            username: payload.username as string,
            email: payload.email as string,
        };
    } catch {
        return null;
    }
}
