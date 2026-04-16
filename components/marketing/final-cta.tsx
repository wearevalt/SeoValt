"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  const t = useTranslations("cta");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* Animated gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #10b98112 0%, #0ea5e908 40%, transparent 80%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" aria-hidden />

      <div className="max-w-3xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text leading-tight">
            {t("title")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h2>

          <p className="mt-6 text-lg text-muted max-w-xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(
                "group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold",
                "bg-emerald text-background",
                "hover:bg-emerald-br transition-all duration-200",
                "glow-em hover:shadow-[0_0_40px_#10b98170,0_0_100px_#10b98130]"
              )}
            >
              {t("button")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#pricing"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold border border-border-b text-muted hover:text-text hover:border-emerald/30 transition-all duration-200"
            >
              {t("buttonSecondary")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
