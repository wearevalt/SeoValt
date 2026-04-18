"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

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
                { icon: X, href: "https://twitter.com/seovalt", label: "Twitter/X" },
                { icon: ExternalLink, href: "https://github.com/seovalt", label: "GitHub" },
                { icon: ExternalLink, href: "https://linkedin.com/company/seovalt", label: "LinkedIn" },
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
