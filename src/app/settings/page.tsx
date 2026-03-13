"use client";

import { useEffect } from "react";

export default function SettingsPage() {
    useEffect(() => {
        window.location.href = "https://account.auva.dev/profile";
    }, []);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Redirecting to Auva settings...</p>
        </div>
    );
}
