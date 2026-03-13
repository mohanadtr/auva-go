"use client";

import Link from "next/link";
import { AlertOctagon } from "lucide-react";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <AlertOctagon className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-6">
                An unexpected error occurred. Please try again or go back to the homepage.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                    Homepage
                </Link>
            </div>
        </div>
    );
}
