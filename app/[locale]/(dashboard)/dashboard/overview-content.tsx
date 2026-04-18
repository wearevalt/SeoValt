"use client";

import { useTranslations } from "next-intl";
import type { ElementType } from "react";
import { CheckCircle2, Clock, FileText, Gauge, TrendingUp, Zap } from "lucide-react";
import { cn, PLANS, type PlanKey } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface OverviewContentProps {
  user: User;
  profile: Record<string, unknown> | null;
  quotas: Record<string, unknown> | null;
  activity: Record<string, unknown>[];
  siteCount: number;
}

const ACTION_ICONS: Record<string, ElementType> = {
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
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return "just now";

  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function toPositiveNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  return 0;
}

function normalizePlan(rawPlan: unknown): PlanKey {
  if (rawPlan === "free" || rawPlan === "pro" || rawPlan === "agency") {
    return rawPlan;
  }
  return "free";
}

function getActivityLabel(action: string): string {
  if (!action) return "Unknown action";
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDaysUntilRenewal(subscriptionEndsAt: unknown): number | null {
  if (typeof subscriptionEndsAt !== "string" || !subscriptionEndsAt) return null;
  const endDate = new Date(subscriptionEndsAt).getTime();
  if (Number.isNaN(endDate)) return null;

  const diff = endDate - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function progressValue(value: number, max: number | null): number {
  if (max === null) return 100;
  if (max <= 0) return 0;
  return Math.min((value / max) * 100, 100);
}

export function OverviewContent({
  user,
  profile,
  quotas,
  activity,
  siteCount,
}: OverviewContentProps) {
  const t = useTranslations("dashboard.overview");
  const plan = normalizePlan(profile?.plan);
  const planData = PLANS[plan];
  const name = (profile?.full_name as string) || user.email?.split("@")[0] || "there";
  const renewalDays = getDaysUntilRenewal(profile?.subscription_ends_at);

  const usedArticles = toPositiveNumber(quotas?.articles_generated);
  const usedFixes = toPositiveNumber(quotas?.seo_fixes);
  const usedPagespeed = toPositiveNumber(quotas?.pagespeed_checks);
  const usedSites = Math.max(0, siteCount);

  const stats = [
    {
      label: t("articles"),
      value: usedArticles,
      max: planData.articles === -1 ? null : planData.articles,
      bar: "bg-cyan",
    },
    {
      label: t("seoFixes"),
      value: usedFixes,
      max: planData.seoFixes === -1 ? null : planData.seoFixes,
      bar: "bg-sky-400",
    },
    {
      label: t("pagespeed"),
      value: usedPagespeed,
      max: planData.pagespeedChecks === -1 ? null : planData.pagespeedChecks,
      bar: "bg-violet",
    },
    {
      label: "Sites",
      value: usedSites,
      max: planData.sites,
      bar: "bg-emerald",
    },
  ];

  const planBadgeColor: Record<PlanKey, string> = {
    free: "bg-surface-2 text-muted border border-border",
    pro: "bg-emerald-dim text-emerald border border-emerald/20",
    agency: "bg-violet-dim text-violet border border-violet/20",
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text sm:text-3xl">
            {t("welcome")}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {renewalDays !== null && renewalDays >= 0
              ? `${planData.name} ${t("plan")} - ${renewalDays} days until renewal`
              : `${planData.name} ${t("plan")}`}
          </p>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold uppercase",
            planBadgeColor[plan]
          )}
        >
          {plan} {t("plan")}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface-2/70 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm text-muted">{stat.label}</span>
              <span className="text-2xl font-black font-mono text-text">
                {stat.max === null ? "Unlimited" : stat.value}
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={cn("h-full rounded-full", stat.bar)}
                style={{ width: `${progressValue(stat.value, stat.max)}%` }}
              />
            </div>

            {stat.max !== null && (
              <p className="mt-1 text-xs text-muted">
                {stat.value} / {stat.max}
              </p>
            )}

            {stat.max === null && (
              <p className="mt-1 text-xs text-muted">No monthly limit</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">
          {t("recentActivity")}
        </h2>

        {activity.length === 0 ? (
          <div className="py-8 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-muted" />
            <p className="text-sm font-medium text-text">{t("noActivity")}</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted">
              {t("noActivityDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((item, i) => {
              const action = typeof item.action === "string" ? item.action : "";
              const Icon = ACTION_ICONS[action] ?? Zap;
              const color = ACTION_COLORS[action] ?? "text-muted";
              const createdAt =
                typeof item.created_at === "string" ? item.created_at : "";

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", color)} />
                  <span className="flex-1 text-sm text-text">
                    {getActivityLabel(action)}
                  </span>
                  <span className="text-xs text-muted">{timeAgo(createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
