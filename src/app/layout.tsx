import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import "./globals.css";

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "Auva Go – Free URL Shortener | Privacy-First Link Shortening",
        template: "%s | Auva Go",
    },
    description:
        "Free, fast, and privacy-first URL shortener. Create short links in seconds, track clicks, generate QR codes, and customize slugs. No tracking, no ads, no personal data stored.",
    keywords: [
        "url shortener",
        "link shortener",
        "short link",
        "custom url",
        "free url shortener",
        "qr code generator",
        "link tracker",
        "privacy-first",
        "go.auva.dev",
        "shorten url",
        "tiny url",
    ],
    authors: [{ name: "Auva" }],
    creator: "Auva",
    publisher: "Auva",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://go.auva.dev"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "Auva Go – Free URL Shortener | Privacy-First Link Shortening",
        description:
            "Free, fast, and privacy-first URL shortener. Create short links, track clicks, and generate QR codes – no personal data stored.",
        siteName: "Auva Go",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Auva Go URL Shortener",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Auva Go – Free URL Shortener | Privacy-First",
        description: "Fast, privacy-first URL shortener. Create short links, track clicks, generate QR codes.",
        images: ["/og-image.png"],
        creator: "@auva",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        // Add your verification codes here when ready:
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
        // bing: 'your-bing-verification-code',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')` }} />
            </head>
            <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen`}>
                <ThemeProvider>
                    <AuthProvider>
                        <div className="flex min-h-screen flex-col">
                            <Header />
                            <main className="flex-1">{children}</main>
                            <footer className="border-t py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                                <div className="max-w-5xl mx-auto px-4 space-y-4">
                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                        <Link href="/about" className="hover:text-[hsl(var(--foreground))] transition-colors">
                                            About
                                        </Link>
                                        <Link href="/privacy" className="hover:text-[hsl(var(--foreground))] transition-colors">
                                            Privacy
                                        </Link>
                                        <a
                                            href="mailto:hello@auva.dev"
                                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                                        >
                                            Contact
                                        </a>
                                    </div>
                                    <p>
                                        Part of the{" "}
                                        <a href="https://auva.dev" className="text-[hsl(var(--foreground))] hover:underline">
                                            Auva
                                        </a>{" "}
                                        ecosystem &middot; &copy; {new Date().getFullYear()}
                                    </p>
                                </div>
                            </footer>
                        </div>
                        <Toaster position="bottom-right" richColors />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
