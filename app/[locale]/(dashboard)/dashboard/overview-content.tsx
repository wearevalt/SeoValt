"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FileText, Wrench, Gauge, CreditCard, Clock, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { cn, PLANS, type PlanKey } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface OverviewContentProps {
  user: User;
  profile: Record<string, unknown> | null;
  quotas: Record<string, unknown> | null;
  activity: Record<string, unknown>[];
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  generate_article: FileText,
  fix_seo: CheckCircle2,
  check_pagespeed: Gauge,
  optimize_images: Zap,
  scan_site: TrendingUp,
  competitor_analysis: TrendingUp,
};

const ACTION_COLORS: Record<string, string> = {
  generate_article: "text-cyan",
  fix_seo: "text-emerald",
  check_pagespeed: "text-violet",
  optimize_images: "text-emerald",
  scan_site: "text-cyan",
  competitor_analysis: "text-violet",
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function OverviewContent({ user, profile, quotas, activity }: OverviewContentProps) {
  const t = useTranslations("dashboard.overview");
  const plan = (profile?.plan as PlanKey) || "free";
  const planData = PLANS[plan];
  const name = (profile?.full_name as string) || user.email?.split("@")[0] || "there";

  const usedArticles = (quotas?.articles_generated as number) || 0;
  const usedFixes = (quotas?.seo_fixes as number) || 0;
  const usedPagespeed = (quotas?.pagespeed_checks as number) || 0;

  const stats = [
    {
      label: t("articles"),
      value: usedArticles,
      max: planData.articles === -1 ? null : planData.articles,
      icon: FileText,
      color: "text-cyan",
      bg: "bg-cyan-dim",
      bar: "bg-cyan",
    },
    {
      label: t("seoFixes"),
      value: usedFixes,
      max: planData.seoFixes === -1 ? null : planData.seoFixes,
      icon: Wrench,
      color: "text-emerald",
      bg: "bg-emerald-dim",
      bar: "bg-emerald",
    },
    {
      label: t("pagespeed"),
      value: usedPagespeed,
      max: planData.pagespeedChecks === -1 ? null : planData.pagespeedChecks,
      icon: Gauge,
      color: "text-violet",
      bg: "bg-violet-dim",
      bar: "bg-violet",
    },
    {
      label: t("credits"),
      value: "∞",
      max: null,
      icon: CreditCard,
      color: "text-emerald",
      bg: "bg-emerald-dim",
      bar: "bg-emerald",
    },
  ];

  const planBadgeColor: Record<PlanKey, string> = {
    free: "bg-surface-2 text-muted border border-border",
    pro: "bg-emerald-dim text-emerald border border-emerald/20",
    agency: "bg-violet-dim text-violet border border-violet/20",
  };

  return (
    <div className="p-6 max-w-5xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-black text-text">
            {t("welcome")}, {name} 👋
          </h1>
          <p className="text-sm text-muted mt-1">
            Here&apos;s your SEO autopilot overview
          </p>
        </div>
        <span className={cn("px-3 py-1 text-xs font-bold rounded-full uppercase", planBadgeColor[plan])}>
          {plan} {t("plan")}
        </span>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
            className="bg-surface rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className="text-xl font-black font-mono text-text">
                {stat.value === "∞" ? "∞" : stat.value}
              </span>
            </div>
            <p className="text-xs text-muted mb-2">{stat.label}</p>
            {stat.max !== null && typeof stat.value === "number" && (
              <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", stat.bar)}
                  style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
                />
              </div>
            )}
            {stat.max !== null && typeof stat.value === "number" && (
              <p className="text-xs text-muted mt-1">{stat.value} / {stat.max}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Activity feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-surface rounded-xl border border-border p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-text">{t("recentActivity")}</h2>
          <a href="./usage" className="text-xs text-emerald hover:text-emerald-br transition-colors">{t("viewAll")}</a>
        </div>

        {activity.length === 0 ? (
          <div className="py-10 text-center">
            <Clock className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-text">{t("noActivity")}</p>
            <p className="text-xs text-muted mt-1 max-w-xs mx-auto">{t("noActivityDesc")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((item, i) => {
              const action = item.action as string;
              const Icon = ACTION_ICONS[action] ?? Zap;
              const color = ACTION_COLORS[action] ?? "text-muted";
              return (
                <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <Icon className={cn("w-4 h-4 flex-shrink-0", color)} />
                  <span className="text-sm text-text flex-1 capitalize">
                    {(action ?? "").replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-muted">
                    {timeAgo(item.created_at as string)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
