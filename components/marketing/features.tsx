"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AIBrainIcon, SearchCodeIcon, SpeedGaugeIcon,
  AltTextIcon, KeywordTargetIcon, MetaTagIcon,
} from "@/components/icons/seo-icons";

const stagger = {
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

interface FeatureCard {
  key: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  glow: string;
  accent: string;
  span?: string;
}

const FEATURES: FeatureCard[] = [
  { key: "articles", Icon: AIBrainIcon, color: "text-emerald", glow: "hover:border-emerald/30 hover:shadow-[0_0_30px_#10b98115]", span: "md:col-span-2", accent: "from-emerald-500/10 to-emerald-300/5" },
  { key: "scanner", Icon: SearchCodeIcon, color: "text-cyan", glow: "hover:border-cyan/30 hover:shadow-[0_0_30px_#0ea5e915]", span: "md:col-span-2", accent: "from-cyan-500/10 to-cyan-300/5" },
  { key: "geo", Icon: SpeedGaugeIcon, color: "text-violet", glow: "hover:border-violet/30 hover:shadow-[0_0_30px_#8b5cf615]", accent: "from-violet-500/10 to-violet-300/5" },
  { key: "aeo", Icon: AltTextIcon, color: "text-cyan", glow: "hover:border-cyan/30 hover:shadow-[0_0_30px_#0ea5e915]", accent: "from-cyan-500/10 to-cyan-300/5" },
  { key: "voice", Icon: KeywordTargetIcon, color: "text-violet", glow: "hover:border-violet/30 hover:shadow-[0_0_30px_#8b5cf615]", accent: "from-violet-500/10 to-violet-300/5" },
  { key: "questions", Icon: MetaTagIcon, color: "text-emerald", glow: "hover:border-emerald/30 hover:shadow-[0_0_30px_#10b98115]", accent: "from-emerald-500/10 to-emerald-300/5" },
  { key: "entity", Icon: SearchCodeIcon, color: "text-emerald", glow: "hover:border-emerald/30 hover:shadow-[0_0_30px_#10b98115]", accent: "from-emerald-500/10 to-emerald-300/5" },
  { key: "pagespeed", Icon: SpeedGaugeIcon, color: "text-cyan", glow: "hover:border-cyan/30 hover:shadow-[0_0_30px_#0ea5e915]", accent: "from-cyan-500/10 to-cyan-300/5" },
];

export function Features() {
  const t = useTranslations("features");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            <span className="text-base">✨</span>
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {FEATURES.map(({ key, Icon, color, glow, span, accent }) => (
            <motion.div
              key={key}
              variants={item}
              whileHover={{ y: -6 }}
              className={cn(
                "group relative rounded-3xl p-7 cursor-default",
                "bg-surface border border-border transition-all duration-300",
                "overflow-hidden shadow-sm hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]",
                glow,
                span
              )}
            >
              <div className="absolute top-4 right-4 h-12 w-12 rounded-full opacity-40 blur-2xl bg-white/5" />
              <div className={cn(
                "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                "border border-border/80",
                `bg-gradient-to-br ${accent}`
              )}>
                <Icon size={22} className={cn(color, "drop-shadow-[0_0_12px_rgba(0,0,0,0.08)]")} />
              </div>

              <h3 className="relative z-10 text-base font-semibold text-text mb-2">
                {t(`items.${key}.title`)}
              </h3>
              <p className="relative z-10 text-sm text-muted leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
