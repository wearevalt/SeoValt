"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{
    quote: string; name: string; role: string; company: string; avatar: string;
  }>;

  const avatarColors = ["#10b981", "#0ea5e9", "#8b5cf6"];

  // Split testimonials into two rows of 8 each with overlap for visual effect
  const topRow = items.slice(0, 8);
  const bottomRow = items.slice(4, 12);

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
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

        {/* Top row - scrolls right */}
        <div className="relative mb-8">
          <motion.div
            className="flex gap-6 animate-scroll-right"
            style={{
              width: 'calc(212px * 16)', // 8 testimonials * 2 for duplication (200px + 12px gap)
            }}
          >
            {/* First set of testimonials */}
            {topRow.map((item, i) => (
              <div
                key={`top-${i}`}
                className="glass-card rounded-2xl p-4 flex flex-col gap-3 min-w-[200px] flex-shrink-0"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 text-emerald fill-emerald" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs text-muted leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {/* Avatar from dicebear */}
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${avatarColors[i % avatarColors.length].slice(1)}&backgroundType=gradientLinear`}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-border-b"
                  />
                  <div>
                    <p className="text-xs font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-muted">{item.role} · {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {topRow.map((item, i) => (
              <div
                key={`top-dup-${i}`}
                className="glass-card rounded-2xl p-4 flex flex-col gap-3 min-w-[200px] flex-shrink-0"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 text-emerald fill-emerald" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs text-muted leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {/* Avatar from dicebear */}
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${avatarColors[i % avatarColors.length].slice(1)}&backgroundType=gradientLinear`}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-border-b"
                  />
                  <div>
                    <p className="text-xs font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-muted">{item.role} · {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom row - scrolls left */}
        <div className="relative">
          <motion.div
            className="flex gap-6 animate-scroll-left"
            style={{
              width: 'calc(212px * 16)', // 8 testimonials * 2 for duplication (200px + 12px gap)
            }}
          >
            {/* First set of testimonials */}
            {bottomRow.map((item, i) => (
              <div
                key={`bottom-${i}`}
                className="glass-card rounded-2xl p-4 flex flex-col gap-3 min-w-[200px] flex-shrink-0"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 text-emerald fill-emerald" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs text-muted leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {/* Avatar from dicebear */}
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${avatarColors[i % avatarColors.length].slice(1)}&backgroundType=gradientLinear`}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-border-b"
                  />
                  <div>
                    <p className="text-xs font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-muted">{item.role} · {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {bottomRow.map((item, i) => (
              <div
                key={`bottom-dup-${i}`}
                className="glass-card rounded-2xl p-4 flex flex-col gap-3 min-w-[200px] flex-shrink-0"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 text-emerald fill-emerald" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs text-muted leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {/* Avatar from dicebear */}
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${avatarColors[i % avatarColors.length].slice(1)}&backgroundType=gradientLinear`}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-border-b"
                  />
                  <div>
                    <p className="text-xs font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-muted">{item.role} · {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>


    </section>
  );
}
