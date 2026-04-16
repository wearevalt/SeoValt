"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
        </motion.div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
              className={cn(
                "rounded-xl border transition-all duration-200 overflow-hidden",
                open === i ? "border-emerald/30 bg-surface" : "border-border bg-surface hover:border-border-b"
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
                  "ml-4 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all",
                  open === i ? "bg-emerald-dim text-emerald" : "bg-surface-2 text-muted"
                )}>
                  {open === i
                    ? <Minus className="w-3 h-3" />
                    : <Plus className="w-3 h-3" />
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
                    <p className="px-5 pb-4 text-sm text-muted leading-relaxed">
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
