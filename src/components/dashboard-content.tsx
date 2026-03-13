"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Link2,
    Copy,
    QrCode,
    BarChart3,
    ToggleLeft,
    ToggleRight,
    ExternalLink,
    Loader2,
    Trash2,
} from "lucide-react";
import { ShortenForm } from "@/components/shorten-form";
import { LinkDetailModal } from "@/components/link-detail-modal";

interface LinkItem {
    id: string;
    slug: string;
    domain: string;
    shortUrl: string;
    destination: string;
    clicks: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export function DashboardContent() {
    const { user } = useAuth();
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLink, setSelectedLink] = useState<string | null>(null);

    const fetchLinks = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/links?page=${page}&limit=20`);
            const data = await res.json();
            if (res.ok) {
                setLinks(data.links);
                setPagination(data.pagination);
            }
        } catch {
            toast.error("Failed to load links");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    async function toggleLink(id: string, currentActive: boolean) {
        try {
            const res = await fetch(`/api/links/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentActive }),
            });
            if (res.ok) {
                setLinks((prev) =>
                    prev.map((l) => (l.id === id ? { ...l, isActive: !currentActive } : l))
                );
                toast.success(currentActive ? "Link disabled" : "Link enabled");
            }
        } catch {
            toast.error("Failed to update link");
        }
    }

    async function deleteLink(id: string) {
        try {
            const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
            if (res.ok) {
                setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive: false } : l)));
                toast.success("Link disabled");
            }
        } catch {
            toast.error("Failed to delete link");
        }
    }

    function copyLink(url: string) {
        navigator.clipboard.writeText(url);
        toast.success("Copied to clipboard!");
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    Welcome back, {user?.name || user?.username}.
                </p>
            </div>

            {/* Create new link */}
            <div className="rounded-lg border bg-[hsl(var(--card))] p-6">
                <h2 className="text-lg font-semibold mb-4">Create a new link</h2>
                <ShortenForm />
            </div>

            {/* Links table */}
            <div className="rounded-lg border bg-[hsl(var(--card))]">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Your Links</h2>
                    <button
                        onClick={() => fetchLinks(pagination?.page || 1)}
                        className="text-sm text-brand-600 hover:underline"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
                        <Link2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p>No links yet. Create your first one above!</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {links.map((link) => (
                            <div
                                key={link.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 transition-colors hover:bg-[hsl(var(--muted))]/50",
                                    !link.isActive && "opacity-60"
                                )}
                            >
                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">{link.domain || "go.auva.dev"}</span>
                                        <code className="text-sm font-mono font-medium truncate">
                                            /{link.slug}
                                        </code>
                                        {!link.isActive && (
                                            <span className="rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-400">
                                                Disabled
                                            </span>
                                        )}
                                        {link.expiresAt && new Date(link.expiresAt) < new Date() && (
                                            <span className="rounded-full bg-yellow-100 dark:bg-yellow-950 px-2 py-0.5 text-[10px] font-medium text-yellow-700 dark:text-yellow-400">
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                                        → {link.destination}
                                    </p>
                                </div>

                                {/* Clicks */}
                                <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    {link.clicks}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => copyLink(link.shortUrl)}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                        title="Copy link"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                    <a
                                        href={`/api/qr?slug=${link.slug}&domain=${link.domain || "go.auva.dev"}&format=png&size=400`}
                                        download
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                        title="Download QR"
                                    >
                                        <QrCode className="h-3.5 w-3.5" />
                                    </a>
                                    <button
                                        onClick={() => setSelectedLink(link.id)}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                        title="View details"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => toggleLink(link.id, link.isActive)}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                                        title={link.isActive ? "Disable link" : "Enable link"}
                                    >
                                        {link.isActive ? (
                                            <ToggleRight className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ToggleLeft className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteLink(link.id)}
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-red-600 dark:text-red-400"
                                        title="Soft delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-4 border-t">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => fetchLinks(p)}
                                className={cn(
                                    "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                                    p === pagination.page
                                        ? "bg-brand-600 text-white"
                                        : "hover:bg-[hsl(var(--muted))]"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail modal */}
            {selectedLink && (
                <LinkDetailModal
                    linkId={selectedLink}
                    onClose={() => setSelectedLink(null)}
                />
            )}
        </div>
    );
}
