import { connectDB } from "@/lib/db";
import { jsonOk, jsonError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();
        return jsonOk({ status: "ok", timestamp: new Date().toISOString() });
    } catch {
        return jsonError("Database connection failed", 503);
    }
}
