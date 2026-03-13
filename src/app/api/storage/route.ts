import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Link } from "@/lib/models";
import { jsonOk, jsonError } from "@/lib/utils";

function getUserId(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = JSON.parse(atob(auth.slice(7).split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload.userId || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return jsonError("Unauthorized", 401);

  await connectDB();

  const result = await Link.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        bytes: {
          $sum: {
            $add: [{ $strLenBytes: "$slug" }, { $strLenBytes: "$destination" }],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const data = result[0] || { bytes: 0, count: 0 };

  return jsonOk({ bytes: data.bytes, count: data.count, limit: 1073741824 });
}
