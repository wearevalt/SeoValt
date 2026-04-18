"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientOrbs } from "@/components/shared/gradient-orbs";
import { AnimatedBeams, ParticleField } from "@/components/shared/beams";
import { DashboardMockup } from "./dashboard-mockup";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export function Hero() {
  const t = useTranslations("hero");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-36 pb-16 overflow-hidden">
      {/* Backgrounds */}
      <GradientOrbs />
      <ParticleField />
      <AnimatedBeams count={5} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-b) 1px, transparent 1px), linear-gradient(90deg, var(--border-b) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex"
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold",
              "border border-emerald/30 bg-emerald-dim text-emerald",
              "glow-pulse-anim"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            ⚡ {t("badge")}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-text leading-[1.05]"
        >
          {t("title")}{" "}
          <span className="gradient-text">{t("titleHighlight")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-5 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            className={cn(
              "group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
              "bg-emerald text-background",
              "hover:bg-emerald-br transition-all duration-200",
              "glow-em hover:shadow-[0_0_30px_#10b98170,0_0_80px_#10b98130]"
            )}
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
              "border border-border-b text-text",
              "hover:border-emerald/40 hover:bg-surface-2 transition-all duration-200"
            )}
          >
            <span className="w-6 h-6 rounded-full bg-emerald-dim flex items-center justify-center">
              <Play className="w-3 h-3 text-emerald fill-emerald" />
            </span>
            {t("ctaSecondary")}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-2xl font-black text-text font-mono">
                {stat.value}
              </span>
              <span className="text-sm text-muted">{stat.label}</span>
              {i < stats.length - 1 && (
                <span className="ml-10 w-px h-8 bg-border-b hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 px-4 sm:px-6 float-anim"
        style={{ perspective: "1200px" }}
      >
        <div
          className={cn(
            "w-full rounded-2xl overflow-hidden border border-border-b",
            "shadow-[0_40px_120px_#10b98120,0_20px_60px_rgba(0,0,0,0.6)]"
          )}
        >
          <DashboardMockup />
        </div>
        {/* Glow under mockup */}
        <div
          className="absolute -bottom-8 left-1/4 right-1/4 h-16 blur-2xl rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #10b98130 0%, transparent 70%)" }}
          aria-hidden
        />
      </motion.div>
    </section>
  );
}
