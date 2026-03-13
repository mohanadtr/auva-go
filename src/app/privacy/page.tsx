import type { Metadata } from "next";
import { Shield, Eye, Database, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Auva Go protects your privacy. We don't track, store, or sell your data.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8">
                Last updated: {new Date().toLocaleDateString()}
            </p>

            {/* Privacy Highlights */}
            <div className="grid gap-4 sm:grid-cols-2 mb-12">
                {[
                    {
                        icon: Eye,
                        title: "No Tracking",
                        desc: "We don't store IP addresses, user agents, or referrers",
                    },
                    {
                        icon: Database,
                        title: "Minimal Data",
                        desc: "Only click counts are stored, no personal information",
                    },
                    {
                        icon: Shield,
                        title: "Your Links",
                        desc: "Only you can see and manage your authenticated links",
                    },
                    {
                        icon: Lock,
                        title: "Secure",
                        desc: "All connections are encrypted with HTTPS",
                    },
                ].map((item) => (
                    <div key={item.title} className="rounded-lg border p-4">
                        <item.icon className="h-5 w-5 text-brand-600 dark:text-brand-400 mb-2" />
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">What We Collect</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        We believe in radical transparency. Here's exactly what we collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li>
                            <strong>Account information:</strong> Email, name, and password (hashed) if you create an
                            account
                        </li>
                        <li>
                            <strong>Link data:</strong> Short URLs you create and their destinations
                        </li>
                        <li>
                            <strong>Click counts:</strong> Number of times each link is clicked (aggregated daily)
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">What We DON'T Collect</h2>
                    <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li>IP addresses</li>
                        <li>User agents (browser/device information)</li>
                        <li>Referrer URLs</li>
                        <li>Geographic location</li>
                        <li>Cookies for tracking</li>
                        <li>Third-party analytics</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">How We Use Your Data</h2>
                    <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li>To provide the URL shortening service</li>
                        <li>To display click statistics to you</li>
                        <li>To send you account verification emails (if you sign up)</li>
                        <li>To authenticate your access to your dashboard</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Links with expiration dates are automatically deleted when they expire. Account data is retained
                        until you delete your account. You can delete your links at any time from your dashboard.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        We use MongoDB for database hosting and Vercel for infrastructure. Both services are GDPR
                        compliant and do not access your data.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li>Access your data</li>
                        <li>Delete your account and all associated data</li>
                        <li>Export your link data</li>
                        <li>Opt out of verification emails</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Contact</h2>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        For privacy concerns or data deletion requests, contact us at{" "}
                        <a href="mailto:privacy@auva.dev" className="text-brand-600 hover:underline">
                            privacy@auva.dev
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
