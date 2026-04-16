"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{
    quote: string; name: string; role: string; company: string; avatar: string;
  }>;

  const avatarColors = ["#10b981", "#0ea5e9", "#8b5cf6"];

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 text-emerald fill-emerald" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar from dicebear */}
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${avatarColors[i % avatarColors.length].slice(1)}&backgroundType=gradientLinear`}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="rounded-full border border-border-b"
                />
                <div>
                  <p className="text-sm font-semibold text-text">{item.name}</p>
                  <p className="text-xs text-muted">{item.role} · {item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
