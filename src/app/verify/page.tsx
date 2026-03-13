"use client";

import { useEffect } from "react";

export default function VerifyPage() {
    useEffect(() => {
        const params = window.location.search;
        window.location.href = `https://account.auva.dev/verify${params}`;
    }, []);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Redirecting to Auva...</p>
        </div>
    );
}
