"use client";

import { useEffect } from "react";

export default function RegisterPage() {
    useEffect(() => {
        window.location.href = "https://account.auva.dev/register";
    }, []);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Redirecting to Auva...</p>
        </div>
    );
}
