"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageLog {
  id: string;
  action: string;
  credits_used: number;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

const ACTION_LABELS: Record<string, string> = {
  generate_article: "Article Generation",
  fix_seo: "SEO Fix",
  check_pagespeed: "PageSpeed Check",
  optimize_images: "Image Optimization",
  scan_site: "Site Scan",
  competitor_analysis: "Competitor Analysis",
};

const ACTION_COLORS: Record<string, string> = {
  generate_article: "#0ea5e9",
  fix_seo: "#10b981",
  check_pagespeed: "#8b5cf6",
  optimize_images: "#34d399",
  scan_site: "#0ea5e9",
  competitor_analysis: "#8b5cf6",
};

export function UsageContent({ logs }: { logs: UsageLog[] }) {
  const t = useTranslations("dashboard.usage");
  const [filter, setFilter] = useState("all");

  // Build last 14 days chart data
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLogs = logs.filter((l) => l.created_at.slice(0, 10) === dateStr);
    return {
      date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      actions: dayLogs.length,
      articles: dayLogs.filter((l) => l.action === "generate_article").length,
      fixes: dayLogs.filter((l) => l.action === "fix_seo").length,
    };
  });

  const filtered = filter === "all" ? logs : logs.filter((l) => l.action === filter);

  const exportCSV = () => {
    const csv = ["Date,Action,Credits"].concat(
      logs.map((l) => `${l.created_at},${l.action},${l.credits_used}`)
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seovalt-usage-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterOptions = [
    { value: "all", label: t("allActions") },
    { value: "generate_article", label: t("articles") },
    { value: "fix_seo", label: t("seoFixes") },
    { value: "check_pagespeed", label: t("pagespeed") },
    { value: "optimize_images", label: t("images") },
    { value: "scan_site", label: t("scans") },
    { value: "competitor_analysis", label: t("competitors") },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-black text-text">{t("title")}</h1>
          <p className="text-sm text-muted mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border-b text-muted hover:text-text hover:bg-surface-2 transition-all"
        >
          <Download className="w-4 h-4" />
          {t("export")}
        </button>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-5 mb-6"
      >
        <h2 className="text-sm font-bold text-text mb-4">Last 14 days</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last14} barSize={12}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border-b)", borderRadius: "8px", color: "var(--text)", fontSize: "12px" }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="articles" fill="#0ea5e9" radius={[3, 3, 0, 0]} name="Articles" />
              <Bar dataKey="fixes" fill="#10b981" radius={[3, 3, 0, 0]} name="Fixes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Filters + table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                filter === opt.value
                  ? "bg-emerald-dim text-emerald border border-emerald/20"
                  : "text-muted border border-border hover:text-text hover:border-border-b"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <BarChart3 className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">{t("noData")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.slice(0, 50).map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: ACTION_COLORS[log.action] ?? "#475569" }}
                />
                <span className="text-sm text-text flex-1">
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>
                <span className="text-xs text-muted">{log.credits_used} credit{log.credits_used !== 1 ? "s" : ""}</span>
                <span className="text-xs text-muted">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
