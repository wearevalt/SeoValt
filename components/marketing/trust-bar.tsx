"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// Fake startup logo SVGs
const FakeLogos = [
  { name: "Nexify", svg: <svg viewBox="0 0 80 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="700" fontSize="16">NEXIFY</text></svg> },
  { name: "Shopra", svg: <svg viewBox="0 0 80 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="700" fontSize="16">shopra</text></svg> },
  { name: "Bloqo", svg: <svg viewBox="0 0 70 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="800" fontSize="16">BLOQO</text></svg> },
  { name: "Velora", svg: <svg viewBox="0 0 80 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="600" fontSize="16" letterSpacing="2">velora</text></svg> },
  { name: "Craftly", svg: <svg viewBox="0 0 90 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="700" fontSize="16">craftly</text></svg> },
  { name: "Pixolio", svg: <svg viewBox="0 0 90 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="700" fontSize="16">PIXOLIO</text></svg> },
  { name: "Launch", svg: <svg viewBox="0 0 80 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="800" fontSize="16">LAUNCH</text></svg> },
  { name: "Stackly", svg: <svg viewBox="0 0 85 24" fill="currentColor" className="h-5"><text x="0" y="18" fontFamily="system-ui" fontWeight="700" fontSize="16">STACKLY</text></svg> },
];

export function TrustBar() {
  const t = useTranslations("trust");
  const items = [...FakeLogos, ...FakeLogos]; // doubled for seamless loop

  return (
    <section className="relative py-10 border-y border-border overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(90deg, var(--bg) 0%, transparent 100%)" }}
        aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(270deg, var(--bg) 0%, transparent 100%)" }}
        aria-hidden />

      <p className="text-center text-xs text-muted uppercase tracking-widest mb-6 px-4">
        {t("label")}
      </p>

      <div className="relative flex overflow-hidden">
        <div className="flex gap-12 items-center marquee-track whitespace-nowrap">
          {items.map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              className={cn(
                "text-muted/50 hover:text-muted transition-colors flex-shrink-0",
              )}
              title={logo.name}
            >
              {logo.svg}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
