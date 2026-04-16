"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Key, BarChart3, CheckCircle2, TrendingUp,
  AlertCircle, Zap, FileText
} from "lucide-react";

export function DashboardMockup() {
  const t = useTranslations("dashboardPreview");
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: t("tabs.overview"), icon: LayoutDashboard },
    { label: t("tabs.licenses"), icon: Key },
    { label: t("tabs.usage"), icon: BarChart3 },
  ];

  return (
    <div className="bg-surface text-text font-sans text-sm select-none">
      {/* App shell top bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background/50">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-emerald/60" />
        <span className="ml-4 text-xs text-muted font-mono">app.seovalt.io/dashboard</span>
      </div>

      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 border-r border-border bg-background/30 flex flex-col py-3">
          <div className="px-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-emerald-dim flex items-center justify-center">
                <Zap className="w-3 h-3 text-emerald" />
              </div>
              <span className="text-xs font-black text-text">SEO<span className="text-emerald">VALT</span></span>
            </div>
          </div>

          {[
            { icon: LayoutDashboard, label: "Overview", active: activeTab === 0 },
            { icon: Key, label: "Licenses", active: activeTab === 1 },
            { icon: BarChart3, label: "Usage", active: activeTab === 2 },
            { icon: FileText, label: "Billing", active: false },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => i < 3 && setActiveTab(i)}
              className={cn(
                "flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-xs transition-all",
                item.active
                  ? "bg-emerald-dim text-emerald font-medium"
                  : "text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                  activeTab === i
                    ? "bg-emerald-dim text-emerald font-semibold"
                    : "text-muted hover:text-text"
                )}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="p-4 h-full overflow-auto">
            {activeTab === 0 && <OverviewPanel />}
            {activeTab === 1 && <LicensesPanel />}
            {activeTab === 2 && <UsagePanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewPanel() {
  const stats = [
    { label: "Articles", value: "23", max: 50, color: "bg-emerald" },
    { label: "SEO Fixes", value: "∞", max: 100, color: "bg-cyan" },
    { label: "PageSpeed", value: "47", max: 100, color: "bg-violet" },
    { label: "Sites", value: "2", max: 3, color: "bg-emerald" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-text">Welcome back, Alex</h2>
          <p className="text-xs text-muted">Pro plan — 7 days until renewal</p>
        </div>
        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-dim text-emerald font-semibold border border-emerald/20">
          PRO
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-2 rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">{s.label}</span>
              <span className="text-sm font-bold text-text font-mono">{s.value}</span>
            </div>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", s.color)}
                style={{ width: s.value === "∞" ? "100%" : `${(parseInt(s.value) / s.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold text-subtle uppercase tracking-wider">Recent Activity</h3>
        {[
          { icon: CheckCircle2, text: "Fixed 3 missing H1 tags", time: "2m ago", color: "text-emerald" },
          { icon: FileText, text: "Generated: 'Best SEO Tools 2026'", time: "18m ago", color: "text-cyan" },
          { icon: TrendingUp, text: "PageSpeed: 94 → 97 (+3)", time: "1h ago", color: "text-violet" },
          { icon: AlertCircle, text: "12 missing alt texts fixed", time: "2h ago", color: "text-emerald" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-surface-2 transition-colors">
            <item.icon className={cn("w-3 h-3 flex-shrink-0", item.color)} />
            <span className="text-xs text-text flex-1 truncate">{item.text}</span>
            <span className="text-xs text-muted">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LicensesPanel() {
  const licenses = [
    { key: "SVT-PRO1-••••-••••-X7K2", site: "myblog.com", status: "active", last: "2m ago" },
    { key: "SVT-PRO1-••••-••••-M3Q9", site: "shopify-store.com", status: "active", last: "1h ago" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text">Licenses</h2>
        <button className="px-2.5 py-1 text-xs rounded-lg bg-emerald text-background font-semibold">
          + New License
        </button>
      </div>

      {licenses.map((l, i) => (
        <div key={i} className="bg-surface-2 rounded-xl p-3 border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-text">{l.key}</span>
            <span className={cn(
              "px-2 py-0.5 text-xs rounded-full font-medium",
              l.status === "active" ? "bg-emerald-dim text-emerald" : "bg-surface text-muted"
            )}>
              {l.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{l.site}</span>
            <span className="text-xs text-muted">Last used {l.last}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsagePanel() {
  const bars = [32, 67, 45, 89, 56, 78, 34, 90, 62, 45, 71, 83];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-text">Usage Analytics</h2>
      <div className="bg-surface-2 rounded-xl p-3 border border-border">
        <p className="text-xs text-muted mb-3">API calls — last 12 days</p>
        <div className="flex items-end gap-1 h-20">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, var(--emerald), var(--cyan))`,
                  opacity: 0.8,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
