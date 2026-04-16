"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Copy, Check, Eye, EyeOff, Download, Plus, Key } from "lucide-react";
import { cn, PLANS, type PlanKey } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface License {
  id: string;
  license_key: string;
  site_url: string | null;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export function LicensesContent({
  licenses: initialLicenses,
  plan,
}: {
  licenses: License[];
  plan: string;
}) {
  const t = useTranslations("dashboard.licenses");
  const [licenses, setLicenses] = useState(initialLicenses);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const planData = PLANS[plan as PlanKey];
  const canAdd = licenses.length < planData.sites;

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyKey = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(id);
    toast.success("License key copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const addLicense = async () => {
    if (!canAdd) {
      toast.error("Upgrade your plan to add more sites");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("licenses")
        .insert({ plan })
        .select()
        .single();
      if (error) throw error;
      setLicenses((prev) => [data, ...prev]);
      toast.success("New license key created!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create license");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return t("neverUsed");
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-black text-text">{t("title")}</h1>
          <p className="text-sm text-muted mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border-b text-muted hover:text-text hover:bg-surface-2 transition-all"
          >
            <Download className="w-4 h-4" />
            {t("downloadPlugin")}
          </a>
          <button
            onClick={addLicense}
            disabled={loading || !canAdd}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-semibold transition-all",
              canAdd
                ? "bg-emerald text-background hover:bg-emerald-br glow-em-sm"
                : "bg-surface-2 text-muted cursor-not-allowed border border-border"
            )}
          >
            <Plus className="w-4 h-4" />
            {t("addLicense")}
          </button>
        </div>
      </motion.div>

      {/* Licenses list */}
      {licenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl border border-border p-12 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
            <Key className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-base font-bold text-text mb-1">{t("empty")}</h3>
          <p className="text-sm text-muted max-w-xs mx-auto mb-5">{t("emptyDesc")}</p>
          <button
            onClick={addLicense}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald text-background hover:bg-emerald-br glow-em-sm transition-all"
          >
            <Plus className="w-4 h-4 inline mr-1.5" />
            {t("addLicense")}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {licenses.map((license, i) => (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="bg-surface rounded-xl border border-border p-4 hover:border-border-b transition-all"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Key */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-dim flex items-center justify-center flex-shrink-0">
                    <Key className="w-4 h-4 text-emerald" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-text truncate">
                      {revealed.has(license.id)
                        ? license.license_key
                        : license.license_key.slice(0, 8) + "-••••-••••-••••"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {license.site_url || "No site linked"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    license.is_active
                      ? "bg-emerald-dim text-emerald border border-emerald/20"
                      : "bg-surface-2 text-muted border border-border"
                  )}>
                    {license.is_active ? t("active") : t("inactive")}
                  </span>
                  <span className="text-xs text-muted hidden sm:block">
                    {formatDate(license.last_used_at)}
                  </span>
                  <button
                    onClick={() => toggleReveal(license.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-all"
                    title={t("reveal")}
                  >
                    {revealed.has(license.id)
                      ? <EyeOff className="w-3.5 h-3.5" />
                      : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyKey(license.license_key, license.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-emerald hover:bg-emerald-dim transition-all"
                    title={t("copy")}
                  >
                    {copied === license.id
                      ? <Check className="w-3.5 h-3.5 text-emerald" />
                      : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Usage info */}
      <div className="mt-4 p-3 rounded-xl bg-surface-2 border border-border">
        <p className="text-xs text-muted">
          {licenses.length} / {planData.sites} sites used ·{" "}
          {!canAdd && (
            <a href="/dashboard/billing" className="text-emerald hover:text-emerald-br transition-colors">
              Upgrade to add more →
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
