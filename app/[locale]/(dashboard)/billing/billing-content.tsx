"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, Loader2, CreditCard } from "lucide-react";
import { cn, PLANS, type PlanKey } from "@/lib/utils";
import { toast } from "sonner";

export function BillingContent({ profile }: { profile: Record<string, unknown> | null }) {
  const t = useTranslations("dashboard.billing");
  const plan = (profile?.plan as PlanKey) || "free";
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (targetPlan: string) => {
    setLoading(targetPlan);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Failed to create checkout");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading("manage");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("Failed to open billing portal");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const planData = PLANS[plan];
  const planColors: Record<PlanKey, string> = {
    free: "border-border text-muted",
    pro: "border-emerald/40 text-emerald bg-emerald-dim",
    agency: "border-violet/30 text-violet bg-violet-dim",
  };

  const upgradePlans = Object.entries(PLANS).filter(([key]) => key !== plan && key !== "free");

  return (
    <div className="p-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-black text-text">{t("title")}</h1>
        <p className="text-sm text-muted mt-1">{t("subtitle")}</p>
      </motion.div>

      {/* Current plan */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-text">{t("currentPlan")}</h2>
          </div>
          <span className={cn(
            "px-3 py-1 text-xs font-bold rounded-full border uppercase",
            planColors[plan]
          )}>
            {planData.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Articles/month", value: planData.articles === -1 ? "∞" : planData.articles },
            { label: "SEO fixes", value: planData.seoFixes === -1 ? "∞" : planData.seoFixes },
            { label: "PageSpeed", value: planData.pagespeedChecks === -1 ? "∞" : planData.pagespeedChecks },
            { label: "Sites", value: planData.sites },
          ].map((item, i) => (
            <div key={i} className="bg-surface-2 rounded-lg p-3 text-center">
              <p className="text-lg font-black font-mono text-text">{item.value}</p>
              <p className="text-xs text-muted mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {plan !== "free" && (
          <button
            onClick={handleManage}
            disabled={loading === "manage"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border-b text-text hover:bg-surface-2 transition-all"
          >
            {loading === "manage" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            {t("manage")}
          </button>
        )}
      </motion.div>

      {/* Upgrade options */}
      {upgradePlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-bold text-text">{t("upgrade")}</h2>
          {upgradePlans.map(([key, data]) => (
            <div key={key} className={cn(
              "bg-surface rounded-xl border p-4 flex items-center justify-between",
              key === "pro" ? "border-emerald/20" : "border-violet/20"
            )}>
              <div>
                <h3 className="text-sm font-bold text-text">{data.name}</h3>
                <p className="text-xs text-muted mt-0.5">
                  €{data.price.monthly}/month · {data.articles === -1 ? "∞" : data.articles} articles · {data.sites} sites
                </p>
              </div>
              <button
                onClick={() => handleUpgrade(key)}
                disabled={!!loading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  key === "pro"
                    ? "bg-emerald text-background hover:bg-emerald-br glow-em-sm"
                    : "bg-violet/20 text-violet border border-violet/30 hover:bg-violet/30"
                )}
              >
                {loading === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                Upgrade
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Payment history placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-surface rounded-xl border border-border p-5"
      >
        <h2 className="text-sm font-bold text-text mb-3">{t("paymentHistory")}</h2>
        <p className="text-sm text-muted py-4 text-center">{t("noPayments")}</p>
      </motion.div>
    </div>
  );
}
