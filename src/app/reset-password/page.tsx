"use client";

import { useEffect } from "react";

export default function ResetPasswordPage() {
    useEffect(() => {
        window.location.href = "https://account.auva.dev/reset-password";
    }, []);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Redirecting to Auva...</p>
        </div>
    );
}
