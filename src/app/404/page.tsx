import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

function FourOhFourContent({
    searchParams,
}: {
    searchParams: { reason?: string };
}) {
    const reason = searchParams.reason;

    let message = "This short link doesn't exist or may have been removed.";
    if (reason === "expired") {
        message = "This short link has expired and is no longer active.";
    } else if (reason === "disabled") {
        message = "This short link has been disabled by its owner.";
    }

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <h1 className="text-[10rem] font-black leading-none tracking-tighter text-[hsl(var(--muted))] select-none sm:text-[14rem]">
                    404
                </h1>
                <h1
                    className="absolute inset-0 text-[10rem] font-black leading-none tracking-tighter text-brand-500 select-none blur-2xl opacity-40 sm:text-[14rem]"
                    aria-hidden="true"
                >
                    404
                </h1>
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-[hsl(var(--foreground))]">
                Link not found
            </h2>
            <p className="mb-8 max-w-md text-[hsl(var(--muted-foreground))]">
                {message}
            </p>
            <Link
                href="/"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Create a short link
            </Link>
        </div>
    );
}

export default function Custom404Page({
    searchParams,
}: {
    searchParams: { reason?: string };
}) {
    return (
        <Suspense>
            <FourOhFourContent searchParams={searchParams} />
        </Suspense>
    );
}
