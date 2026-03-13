import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://go.auva.dev";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/login", "/register", "/dashboard"],
                disallow: ["/api/", "/verify", "/settings"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
