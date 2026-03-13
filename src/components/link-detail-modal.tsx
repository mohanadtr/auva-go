"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    X,
    BarChart3,
    Copy,
    QrCode,
    ExternalLink,
    Loader2,
    Calendar,
    Globe,
} from "lucide-react";

interface LinkDetail {
    id: string;
    slug: string;
    domain: string;
    shortUrl: string;
    destination: string;
    clicks: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    dailyClicks: { date: string; count: number }[];
}

interface Props {
    linkId: string;
    onClose: () => void;
}

export function LinkDetailModal({ linkId, onClose }: Props) {
    const [link, setLink] = useState<LinkDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [editDest, setEditDest] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editDomain, setEditDomain] = useState("");
    const [saving, setSaving] = useState(false);
    const [savingSlug, setSavingSlug] = useState(false);
    const [savingDomain, setSavingDomain] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/links/${linkId}`);
                if (res.ok) {
                    const data = await res.json();
                    setLink(data);
                    setEditDest(data.destination);
                    setEditSlug(data.slug);
                    setEditDomain(data.domain || "go.auva.dev");
                } else {
                    toast.error("Failed to load link details");
                    onClose();
                }
            } catch {
                toast.error("Failed to load link details");
                onClose();
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [linkId, onClose]);

    async function handleSave() {
        if (!link || editDest === link.destination) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/links/${linkId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ destination: editDest }),
            });
            if (res.ok) {
                const data = await res.json();
                setLink((prev) => (prev ? { ...prev, destination: data.destination } : prev));
                toast.success("Destination updated");
            } else {
                const data = await res.json();
                toast.error(data.error || "Update failed");
            }
        } catch {
            toast.error("Update failed");
        } finally {
            setSaving(false);
        }
    }

    async function handleSlugSave() {
        if (!link || editSlug === link.slug) return;
        setSavingSlug(true);
        try {
            const res = await fetch(`/api/links/${linkId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: editSlug }),
            });
            if (res.ok) {
                const data = await res.json();
                setLink((prev) =>
                    prev ? { ...prev, slug: data.slug, shortUrl: data.shortUrl } : prev
                );
                setEditSlug(data.slug);
                toast.success("Slug updated");
            } else {
                const data = await res.json();
                toast.error(data.error || "Update failed");
            }
        } catch {
            toast.error("Update failed");
        } finally {
            setSavingSlug(false);
        }
    }

    async function handleDomainSave(newDomain: string) {
        if (!link || newDomain === link.domain) return;
        setSavingDomain(true);
        try {
            const res = await fetch(`/api/links/${linkId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: newDomain }),
            });
            if (res.ok) {
                const data = await res.json();
                setLink((prev) =>
                    prev ? { ...prev, domain: data.domain, shortUrl: data.shortUrl } : prev
                );
                setEditDomain(data.domain);
                toast.success("Domain updated");
            } else {
                const data = await res.json();
                toast.error(data.error || "Update failed");
            }
        } catch {
            toast.error("Update failed");
        } finally {
            setSavingDomain(false);
        }
    }

    // Simple bar chart for daily clicks
    const maxCount = link
        ? Math.max(...link.dailyClicks.map((d) => d.count), 1)
        : 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-lg border bg-[hsl(var(--card))] shadow-lg max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold">Link Details</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : link ? (
                    <div className="p-4 space-y-5">
                        {/* Short URL */}
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Short URL</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm font-mono bg-[hsl(var(--muted))] rounded-md px-3 py-2 truncate">
                                    {link.shortUrl}
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(link.shortUrl);
                                        toast.success("Copied!");
                                    }}
                                    className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </button>
                                <a
                                    href={`/api/qr?slug=${link.slug}&domain=${link.domain || "go.auva.dev"}&format=svg&size=600`}
                                    download
                                    className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                    title="Download QR (SVG)"
                                >
                                    <QrCode className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Slug (editable) */}
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Slug</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[hsl(var(--muted-foreground))] shrink-0">{link.domain || "go.auva.dev"}/</span>
                                <input
                                    type="text"
                                    value={editSlug}
                                    onChange={(e) =>
                                        setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                                    }
                                    className={cn(
                                        "flex-1 rounded-lg border bg-[hsl(var(--input))] px-3 py-2 text-sm font-mono",
                                        "focus-ring transition-colors"
                                    )}
                                />
                                <button
                                    onClick={handleSlugSave}
                                    disabled={savingSlug || editSlug === link.slug || editSlug.length < 3}
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium",
                                        "bg-brand-600 text-white hover:bg-brand-700 transition-colors",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {savingSlug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>

                        {/* Domain (switchable) */}
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Domain</p>
                            <select
                                value={link.domain || "go.auva.dev"}
                                disabled={savingDomain}
                                onChange={(e) => {
                                    setEditDomain(e.target.value);
                                    handleDomainSave(e.target.value);
                                }}
                                className={cn(
                                    "w-full rounded-lg border bg-[hsl(var(--input))] px-3 py-2 text-sm font-mono",
                                    "focus-ring transition-colors appearance-none cursor-pointer",
                                    savingDomain && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <option value="go.auva.dev">go.auva.dev</option>
                                <option value="auva.site">auva.site</option>
                            </select>
                        </div>

                        {/* Destination (editable) */}
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Destination</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="url"
                                    value={editDest}
                                    onChange={(e) => setEditDest(e.target.value)}
                                    className={cn(
                                        "flex-1 rounded-lg border bg-[hsl(var(--input))] px-3 py-2 text-sm",
                                        "focus-ring transition-colors"
                                    )}
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={saving || editDest === link.destination}
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-medium",
                                        "bg-brand-600 text-white hover:bg-brand-700 transition-colors",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg border p-3 text-center">
                                <BarChart3 className="h-4 w-4 mx-auto mb-1 text-[hsl(var(--muted-foreground))]" />
                                <p className="text-lg font-bold">{link.clicks}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Total clicks</p>
                            </div>
                            <div className="rounded-lg border p-3 text-center">
                                <Calendar className="h-4 w-4 mx-auto mb-1 text-[hsl(var(--muted-foreground))]" />
                                <p className="text-sm font-medium">{new Date(link.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Created</p>
                            </div>
                            <div className="rounded-lg border p-3 text-center">
                                <Globe className="h-4 w-4 mx-auto mb-1 text-[hsl(var(--muted-foreground))]" />
                                <p className="text-sm font-medium">
                                    {link.isActive ? (
                                        <span className="text-green-600 dark:text-green-400">Active</span>
                                    ) : (
                                        <span className="text-red-600 dark:text-red-400">Disabled</span>
                                    )}
                                </p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))]">Status</p>
                            </div>
                        </div>

                        {/* Daily clicks chart (last 30 days) */}
                        {link.dailyClicks.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                                    Clicks – last 30 days
                                </p>
                                <div className="flex items-end gap-px h-24 rounded-lg bg-[hsl(var(--muted))] p-2">
                                    {link.dailyClicks.map((d) => (
                                        <div
                                            key={d.date}
                                            className="flex-1 bg-brand-500 rounded-t-sm transition-all hover:bg-brand-400"
                                            style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? 2 : 0 }}
                                            title={`${d.date}: ${d.count} clicks`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* QR Preview */}
                        <div className="space-y-2 text-center">
                            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">QR Code</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`/api/qr?slug=${link.slug}&domain=${link.domain || "go.auva.dev"}&format=png&size=200`}
                                alt="QR Code"
                                className="mx-auto rounded-lg border"
                                width={200}
                                height={200}
                            />
                            <div className="flex justify-center gap-2">
                                <a
                                    href={`/api/qr?slug=${link.slug}&domain=${link.domain || "go.auva.dev"}&format=png&size=600`}
                                    download
                                    className="text-xs text-brand-600 hover:underline"
                                >
                                    PNG
                                </a>
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">·</span>
                                <a
                                    href={`/api/qr?slug=${link.slug}&domain=${link.domain || "go.auva.dev"}&format=svg&size=600`}
                                    download
                                    className="text-xs text-brand-600 hover:underline"
                                >
                                    SVG
                                </a>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
