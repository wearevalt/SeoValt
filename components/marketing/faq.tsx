"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{ q: string; a: string }>;
  const subtitle = typeof t.has === "function" && t.has("subtitle")
    ? t("subtitle")
    : "Everything you need to know before you buy. Can't find the answer to your question?";
  const contactLabel = typeof t.has === "function" && t.has("contactLabel")
    ? t("contactLabel")
    : "Email";

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start"
          ref={ref}
        >
          <div className="lg:pt-2 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
              {t("badge")}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-text tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg text-muted leading-8 max-w-sm">
              {subtitle}
            </p>

            <a
              href="mailto:support@wearevalt.co"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(236,72,153,0.35)] bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 transition-all"
            >
              <Mail className="w-5 h-5" />
              {contactLabel}
            </a>
          </div>

          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden shadow-[0_8px_28px_rgba(2,12,37,0.08)]",
                  open === i
                    ? "border-pink-400/40 bg-surface"
                    : "border-border bg-surface hover:border-border-b"
                )}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-6 text-left"
                  aria-expanded={open === i}
                >
                  <span className={cn(
                    "text-lg font-semibold",
                    open === i ? "text-text" : "text-text"
                  )}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "ml-4 flex-shrink-0 w-5 h-5 text-pink-500 transition-transform duration-200",
                      open === i ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    >
                      <p className="px-6 pb-6 text-base text-muted leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
