import type { MetadataRoute } from "next";

const BASE_URL = "https://seovalt.io";
const LOCALES = ["en", "fr", "es"];
const ROUTES = [
  "",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/pricing",
  "/features",
  "/changelog",
  "/roadmap",
  "/documentation",
  "/api-reference",
  "/status",
  "/support",
  "/resources",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/gdpr",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${route}`])
          ),
        },
      });
    }
  }

  return entries;
}
