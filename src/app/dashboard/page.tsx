"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            window.location.href = "https://account.auva.dev/login";
            return;
        }
        router.replace("/");
    }, [loading, user, router]);

    return null;
}
