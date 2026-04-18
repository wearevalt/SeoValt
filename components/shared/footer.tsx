"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.18-3.35-1.18-.45-1.15-1.1-1.45-1.1-1.45-.9-.62.07-.6.07-.6 1 .07 1.53 1.02 1.53 1.02.88 1.51 2.3 1.07 2.86.82.09-.64.35-1.08.63-1.33-2.21-.25-4.53-1.11-4.53-4.94 0-1.09.39-1.98 1.02-2.68-.1-.26-.44-1.3.1-2.72 0 0 .84-.27 2.75 1.03A9.52 9.52 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.3 2.74-1.03 2.74-1.03.54 1.42.2 2.46.1 2.72.64.7 1.02 1.59 1.02 2.68 0 3.84-2.32 4.69-4.54 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14.75 3c.28 1.63 1.2 3.03 2.55 3.8.78.45 1.69.7 2.65.7v2.9c-1.47 0-2.88-.43-4.05-1.24v5.68c0 3.5-2.85 6.35-6.35 6.35S3.2 18.34 3.2 14.84s2.85-6.35 6.35-6.35c.28 0 .56.02.84.06v3.08a3.2 3.2 0 0 0-.84-.11 3.32 3.32 0 1 0 3.32 3.32V3h1.88Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.9 3h2.98l-6.5 7.43L23 21h-5.94l-4.65-6.08L7.1 21H4.1l6.95-7.95L1 3h6.1l4.2 5.55L18.9 3Zm-1.04 16.22h1.65L6.2 4.69H4.44l13.42 14.53Z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const base = `/${locale}`;

  const sections = [
    {
      title: t("product"),
      links: [
        { label: t("links.features"), href: "#features" },
        { label: t("links.pricing"), href: "#pricing" },
        { label: t("links.changelog"), href: "/changelog" },
        { label: t("links.roadmap"), href: "/roadmap" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("links.about"), href: "/about" },
        { label: t("links.blog"), href: "/blog" },
        { label: t("links.careers"), href: "/careers" },
        { label: t("links.contact"), href: "/contact" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("links.docs"), href: `${base}/documentation` },
        { label: t("links.api"), href: `${base}/api-reference` },
        { label: t("links.status"), href: `${base}/status` },
        { label: t("links.support"), href: `${base}/support` },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("links.privacy"), href: `${base}/legal/privacy` },
        { label: t("links.terms"), href: `${base}/legal/terms` },
        { label: t("links.cookies"), href: `${base}/legal/cookies` },
        { label: t("links.gdpr"), href: `${base}/legal/gdpr` },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: "https://instagram.com/wearevalt", label: "Instagram" },
                { icon: GitHubIcon, href: "https://github.com/wearevalt", label: "GitHub" },
                { icon: TikTokIcon, href: "https://www.tiktok.com/@wearevalt", label: "TikTok" },
                { icon: XIcon, href: "https://x.com/wearevalt", label: "X" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-emerald hover:bg-emerald-dim transition-all duration-200 border border-border hover:border-emerald"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">{t("copyright")}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
