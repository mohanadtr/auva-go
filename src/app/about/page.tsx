import type { Metadata } from "next";
import { Link2, Zap, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Auva Go - the privacy-first URL shortener built for speed and simplicity.",
};

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-950 mb-4">
                    <Link2 className="h-8 w-8 text-brand-600" />
                </div>
                <h1 className="text-3xl font-bold mb-3">About Auva Go</h1>
                <p className="text-lg text-[hsl(var(--muted-foreground))]">
                    A privacy-first URL shortener built for speed and simplicity
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                        We believe URL shortening should be fast, simple, and respect your privacy. No tracking pixels,
                        no surveillance capitalism, no bloat. Just clean, fast redirects and the analytics that matter.
                    </p>
                </section>

                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        {
                            icon: Zap,
                            title: "Lightning Fast",
                            desc: "Edge redirects in under 50ms worldwide",
                        },
                        {
                            icon: Shield,
                            title: "Privacy First",
                            desc: "Zero tracking, zero personal data collection",
                        },
                        {
                            icon: Heart,
                            title: "Open & Free",
                            desc: "Free to use, built with modern open-source tech",
                        },
                    ].map((feature) => (
                        <div key={feature.title} className="text-center space-y-2">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--muted))]">
                                <feature.icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                            </div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Technology</h2>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                        Built with Next.js 14, TypeScript, MongoDB, and deployed on Vercel's edge network for maximum
                        performance. All code is open-source and available for review.
                    </p>
                    <div className="rounded-lg border bg-[hsl(var(--muted))]/50 p-4">
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            <strong>Tech Stack:</strong> Next.js, React, TypeScript, MongoDB, Tailwind CSS, NextAuth.js
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Why We Built This</h2>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Most URL shorteners track everything you do. They sell your data, serve ads, and slow down your
                        redirects. We wanted something different: a tool that just works, respects your privacy, and
                        doesn't clutter your experience with unnecessary features.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Contact</h2>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                        Have questions, feedback, or just want to say hi? Reach us at{" "}
                        <a href="mailto:hello@auva.dev" className="text-brand-600 hover:underline">
                            hello@auva.dev
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
