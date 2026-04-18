"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { Star } from "lucide-react";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

function trimQuote(value: string, max = 110) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}...`;
}

function ensureLength(items: TestimonialItem[], target: number) {
  if (items.length === 0) return [];
  const out: TestimonialItem[] = [];
  let index = 0;
  while (out.length < target) {
    out.push(items[index % items.length]);
    index += 1;
  }
  return out;
}

function ReviewCard({
  item,
  color,
}: {
  item: TestimonialItem;
  color: string;
}) {
  return (
    <article className="glass-card rounded-2xl p-4 h-[190px] w-[300px] sm:w-[320px] max-w-[320px] flex-shrink-0 flex flex-col gap-2.5 overflow-hidden">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, si) => (
          <Star key={si} className="w-3.5 h-3.5 text-emerald fill-emerald" />
        ))}
      </div>

      <p
        className="text-sm text-muted leading-relaxed flex-1 overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        &ldquo;{trimQuote(item.quote)}&rdquo;
      </p>

      <div className="flex items-center gap-2.5">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=${color.slice(1)}&backgroundType=gradientLinear`}
          alt={item.name}
          width={34}
          height={34}
          className="rounded-full border border-border-b"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text truncate">{item.name}</p>
          <p className="text-xs text-muted truncate">
            {item.role} - {item.company}
          </p>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as TestimonialItem[];

  const avatarColors = ["#10b981", "#0ea5e9", "#8b5cf6"];

  // Exactly 16 testimonials total, all displayed in animated rows
  const sixteen = useMemo(() => ensureLength(items, 16), [items]);
  const topRow = sixteen.slice(0, 8);
  const bottomRow = sixteen.slice(8, 16);

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
        </motion.div>

        <div className="space-y-5">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div className="flex gap-4 w-max animate-scroll-right">
              {[...topRow, ...topRow].map((item, i) => (
                <ReviewCard
                  key={`top-${item.name}-${i}`}
                  item={item}
                  color={avatarColors[i % avatarColors.length]}
                />
              ))}
            </motion.div>
          </div>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div className="flex gap-4 w-max animate-scroll-left">
              {[...bottomRow, ...bottomRow].map((item, i) => (
                <ReviewCard
                  key={`bottom-${item.name}-${i}`}
                  item={item}
                  color={avatarColors[i % avatarColors.length]}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
