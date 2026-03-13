"use client";

import { useAuth } from "@/components/auth-provider";
import { ShortenForm } from "@/components/shorten-form";
import { DashboardContent } from "@/components/dashboard-content";
import { Link2, Zap, QrCode, Lock, BarChart3, Users, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
    const { user, loading } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
        );
    }

    // Authenticated users see dashboard
    if (user) {
        return <DashboardContent />;
    }

    // Guest view
    return (
        <div className="flex flex-col items-center">
            {/* Hero */}
            <section className="w-full max-w-5xl px-4 pt-16 pb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Shorten links with{" "}
                    <span className="text-brand-500">Auva Go</span>
                </h1>
                <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))] max-w-lg mx-auto">
                    Fast, clean, and privacy-first URL shortener. Create short links, track click counts, and generate QR codes – no personal data stored.
                </p>
            </section>

            {/* Shorten form */}
            <section className="w-full max-w-5xl px-4 pb-12">
                <ShortenForm />

                {/* Sign up CTA */}
                <div className="mt-6 rounded-lg border border-brand-200 dark:border-brand-800 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950 dark:to-blue-950 p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        <h3 className="font-semibold text-brand-900 dark:text-brand-100">
                            Want to track your links?
                        </h3>
                    </div>
                    <p className="text-sm text-brand-700 dark:text-brand-300 mb-4 max-w-md mx-auto">
                        Create a free account to manage all your short links, view detailed analytics, edit destinations, and more.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <a
                            href="https://account.auva.dev/register"
                            className={cn(
                                "inline-flex h-10 items-center rounded-lg bg-brand-600 px-6 text-sm font-medium text-white",
                                "hover:bg-brand-700 transition-colors focus-ring"
                            )}
                        >
                            Sign up free
                        </a>
                        <a
                            href="https://account.auva.dev/login"
                            className={cn(
                                "inline-flex h-10 items-center rounded-lg border border-brand-300 dark:border-brand-700 px-6 text-sm font-medium",
                                "hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors focus-ring"
                            )}
                        >
                            Log in
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="w-full border-t bg-[hsl(var(--muted))]/50 py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">Why use Auva Go?</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                desc: "Sub-50ms redirects powered by edge computing. Your links work instantly anywhere in the world.",
                            },
                            {
                                icon: Lock,
                                title: "Privacy First",
                                desc: "No IPs, user agents, or referrers stored. We respect your privacy and your users' privacy.",
                            },
                            {
                                icon: Link2,
                                title: "Custom Slugs",
                                desc: "Choose memorable slugs for your brand or let us generate short ones automatically.",
                            },
                            {
                                icon: QrCode,
                                title: "QR Codes",
                                desc: "Download PNG or SVG QR codes for any link. Perfect for print materials and displays.",
                            },
                            {
                                icon: BarChart3,
                                title: "Click Analytics",
                                desc: "Track total clicks and daily trends for all your links. No invasive tracking required.",
                            },
                            {
                                icon: Shield,
                                title: "Link Management",
                                desc: "Edit destinations, disable links, set expiration dates, and organize all your URLs in one place.",
                            },
                        ].map((f) => (
                            <div key={f.title} className="space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950">
                                    <f.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                                </div>
                                <h3 className="font-semibold text-lg">{f.title}</h3>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
