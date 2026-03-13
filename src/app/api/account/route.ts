import { getAuthUser } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/utils";

/* GET /api/account – Get current user info from JWT */

export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) return jsonError("Unauthorized", 401);

        return jsonOk({
            id: user.userId,
            username: user.username,
            email: user.email,
        });
    } catch (err: any) {
        console.error("Get account error:", err);
        return jsonError("Internal server error", 500);
    }
}
