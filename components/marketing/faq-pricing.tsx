"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQPricing() {
  const t = useTranslations("pricing_faq");
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section className="relative py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          ref={ref}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
              className={cn(
                "rounded-2xl border transition-all duration-200 overflow-hidden",
                open === i
                  ? "border-emerald/30 bg-surface shadow-lg shadow-emerald-500/5"
                  : "border-border bg-surface/50 hover:border-border-b"
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  open === i ? "text-text" : "text-muted"
                )}>
                  {item.q}
                </span>
                <span className={cn(
                  "ml-4 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                  open === i ? "bg-emerald text-white" : "bg-surface-2 text-muted"
                )}>
                  {open === i
                    ? <Minus className="w-3.5 h-3.5" />
                    : <Plus className="w-3.5 h-3.5" />
                  }
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
