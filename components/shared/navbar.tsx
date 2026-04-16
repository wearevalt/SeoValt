"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#features", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "/docs", label: t("docs") },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-border-b"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-muted hover:text-text transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className={cn(
                "px-4 py-1.5 text-sm font-semibold rounded-lg",
                "bg-emerald text-background",
                "hover:bg-emerald-br transition-all duration-200",
                "glow-em-sm hover:glow-em"
              )}
            >
              {t("cta")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-muted hover:text-text transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-border-b md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <div className="flex items-center justify-between">
                <LanguageSwitcher align="left" />
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-muted hover:text-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("login")}
                </Link>
              </div>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full mt-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-emerald text-background text-center hover:bg-emerald-br transition-colors glow-em-sm"
              >
                {t("cta")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
