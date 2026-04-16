import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/dashboard/", "/fr/dashboard/", "/es/dashboard/"],
      },
    ],
    sitemap: "https://seovalt.io/sitemap.xml",
    host: "https://seovalt.io",
  };
}
