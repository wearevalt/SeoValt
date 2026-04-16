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
  span?: string;
}

const FEATURES: FeatureCard[] = [
  { key: "articles",    Icon: AIBrainIcon,       color: "text-emerald",  glow: "hover:border-emerald/30 hover:shadow-[0_0_30px_#10b98115]", span: "md:col-span-2" },
  { key: "scanner",     Icon: SearchCodeIcon,    color: "text-cyan",     glow: "hover:border-cyan/30 hover:shadow-[0_0_30px_#0ea5e915]" },
  { key: "vitals",      Icon: SpeedGaugeIcon,    color: "text-violet",   glow: "hover:border-violet/30 hover:shadow-[0_0_30px_#8b5cf615]" },
  { key: "images",      Icon: AltTextIcon,       color: "text-cyan",     glow: "hover:border-cyan/30 hover:shadow-[0_0_30px_#0ea5e915]" },
  { key: "competitors", Icon: KeywordTargetIcon, color: "text-violet",   glow: "hover:border-violet/30 hover:shadow-[0_0_30px_#8b5cf615]" },
  { key: "meta",        Icon: MetaTagIcon,       color: "text-emerald",  glow: "hover:border-emerald/30 hover:shadow-[0_0_30px_#10b98115]" },
];

export function Features() {
  const t = useTranslations("features");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {FEATURES.map(({ key, Icon, color, glow, span }) => (
            <motion.div
              key={key}
              variants={item}
              className={cn(
                "group relative rounded-2xl p-6 cursor-default",
                "bg-surface border border-border transition-all duration-300",
                "overflow-hidden",
                glow,
                span
              )}
            >
              {/* Beam on hover */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute inset-0 h-px w-3/4 top-1/4"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                    animation: "beam-slide 3s linear infinite",
                  }}
                />
              </div>

              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                "bg-surface-2 border border-border",
                "group-hover:scale-110 transition-transform duration-300"
              )}>
                <Icon size={20} className={color} />
              </div>

              <h3 className="text-base font-bold text-text mb-2">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
