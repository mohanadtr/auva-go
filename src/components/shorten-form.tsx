"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Link2, Copy, Check, QrCode, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortenResult {
    shortUrl: string;
    slug: string;
    destination: string;
    domain: string;
}

const DOMAINS = [
    { value: "go.auva.dev", label: "go.auva.dev" },
    { value: "auva.site", label: "auva.site" },
] as const;

export function ShortenForm() {
    const [destination, setDestination] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [domain, setDomain] = useState<string>("go.auva.dev");
    const [expiresAt, setExpiresAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ShortenResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
    const [checkingSlug, setCheckingSlug] = useState(false);

    async function checkSlug(slug: string) {
        if (slug.length < 3) {
            setSlugAvailable(null);
            return;
        }
        setCheckingSlug(true);
        try {
            const res = await fetch(`/api/links/check?slug=${encodeURIComponent(slug)}`);
            const data = await res.json();
            setSlugAvailable(data.available);
        } catch {
            setSlugAvailable(null);
        } finally {
            setCheckingSlug(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const body: Record<string, string> = { destination, domain };
        if (customSlug && customSlug.length >= 3) body.slug = customSlug;
        if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();

        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to create link");
                return;
            }

            setResult({
                shortUrl: data.shortUrl,
                slug: data.slug,
                destination: data.destination,
                domain: data.domain,
            });
            setDestination("");
            setCustomSlug("");
            setExpiresAt("");
            toast.success("Short link created!");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    function copyToClipboard() {
        if (!result) return;
        navigator.clipboard.writeText(result.shortUrl);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* URL Input */}
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium mb-1.5">
                        Destination URL
                    </label>
                    <input
                        id="destination"
                        type="url"
                        required
                        placeholder="https://example.com/your-long-url"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className={cn(
                            "w-full rounded-lg border bg-[hsl(var(--input))] px-4 py-2.5 text-sm",
                            "placeholder:text-[hsl(var(--muted-foreground))]",
                            "focus-ring transition-colors"
                        )}
                    />
                </div>

                {/* Domain & Slug row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Domain selector */}
                    <div className="w-full sm:w-48">
                        <label htmlFor="domain" className="block text-sm font-medium mb-1.5">
                            Domain
                        </label>
                        <select
                            id="domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className={cn(
                                "w-full rounded-lg border bg-[hsl(var(--input))] px-4 py-2.5 text-sm font-mono",
                                "focus-ring transition-colors appearance-none cursor-pointer"
                            )}
                        >
                            {DOMAINS.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Slug input */}
                    <div className="flex-1">
                        <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
                            Alias (optional)
                        </label>
                        <div className="relative">
                            <input
                                id="slug"
                                type="text"
                                placeholder="Add alias here"
                                value={customSlug}
                                onChange={(e) => {
                                    const v = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                                    setCustomSlug(v);
                                    if (v.length >= 3) checkSlug(v);
                                }}
                                className={cn(
                                    "w-full rounded-lg border bg-[hsl(var(--input))] px-4 py-2.5 pr-20 text-sm font-mono",
                                    "placeholder:text-[hsl(var(--muted-foreground))]",
                                    "focus-ring transition-colors"
                                )}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {checkingSlug && <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--muted-foreground))]" />}
                                {!checkingSlug && customSlug.length >= 3 && slugAvailable === true && (
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                )}
                                {!checkingSlug && customSlug.length >= 3 && slugAvailable === false && (
                                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                        </div>
                        {customSlug.length > 0 && customSlug.length < 3 && (
                            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Must be at least 3 characters</p>
                        )}
                    </div>
                </div>

                {/* Custom slug toggle - REMOVED */}

                {/* Expiration */}
                <div>
                    <label htmlFor="expiresAt" className="block text-sm font-medium mb-1.5">
                        Expiration (optional)
                    </label>
                    <input
                        id="expiresAt"
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className={cn(
                            "w-full rounded-lg border bg-[hsl(var(--input))] px-4 py-2.5 text-sm",
                            "focus-ring transition-colors"
                        )}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || (customSlug.length >= 3 && slugAvailable === false)}
                    className={cn(
                        "w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
                        "bg-brand-600 text-white font-medium text-sm",
                        "hover:bg-brand-700 transition-colors focus-ring",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Link2 className="h-4 w-4" />
                    )}
                    Shorten URL
                </button>
            </form>

            {/* Result card */}
            {result && (
                <div className="mt-6 rounded-lg border bg-[hsl(var(--card))] p-4 space-y-3">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Your short link</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md bg-[hsl(var(--muted))] px-3 py-2 text-sm font-mono truncate">
                            {result.shortUrl}
                        </code>
                        <button
                            onClick={copyToClipboard}
                            className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-md",
                                "hover:bg-[hsl(var(--muted))] transition-colors focus-ring"
                            )}
                            aria-label="Copy link"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                            href={`/api/qr?slug=${result.slug}&domain=${result.domain || "go.auva.dev"}&format=png&size=400`}
                            download
                            className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-md",
                                "hover:bg-[hsl(var(--muted))] transition-colors focus-ring"
                            )}
                            aria-label="Download QR code"
                        >
                            <QrCode className="h-4 w-4" />
                        </a>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                        → {result.destination}
                    </p>
                </div>
            )}
        </div>
    );
}
