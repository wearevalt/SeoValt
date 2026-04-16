"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const;

export function LanguageSwitcher({ align = "right" }: { align?: "right" | "left" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    // Replace current locale segment in path
    const segments = pathname.split("/");
    if (segments[1] && LOCALES.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    startTransition(() => {
      router.replace(segments.join("/") || "/");
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted",
          "hover:text-text hover:bg-surface-2 transition-all duration-200",
          "border border-transparent hover:border-border",
          isPending && "opacity-50 pointer-events-none"
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{current.code.toUpperCase()}</span>
        <ChevronDown
          className={cn("w-3 h-3 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className={cn(
              "absolute top-full mt-1.5 z-50 w-44",
              "glass rounded-xl border border-border-b shadow-xl",
              "py-1 overflow-hidden",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm",
                  "hover:bg-surface-2 transition-colors",
                  l.code === locale
                    ? "text-emerald font-medium"
                    : "text-text"
                )}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === locale && (
                  <Check className="w-3.5 h-3.5 ml-auto text-emerald" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
