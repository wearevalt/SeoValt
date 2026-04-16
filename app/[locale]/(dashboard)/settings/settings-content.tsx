"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Save, Loader2, User, Bell, Globe, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export function SettingsContent({
  user,
  profile,
}: {
  user: SupabaseUser;
  profile: Record<string, unknown> | null;
}) {
  const t = useTranslations("dashboard.settings");
  const [name, setName] = useState((profile?.full_name as string) || "");
  const [language, setLanguage] = useState((profile?.language as string) || "en");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [quotaAlerts, setQuotaAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({ full_name: name, language })
        .eq("id", user.id);
      if (error) throw error;
      setSaved(true);
      toast.success("Profile saved");
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 5000);
      return;
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || user.email || "U")}&backgroundColor=10b981&backgroundType=gradientLinear`;

  return (
    <div className="p-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-text">{t("title")}</h1>
      </motion.div>

      <div className="space-y-4">
        {/* Profile section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-muted" />
            <h2 className="text-sm font-bold text-text">{t("profile")}</h2>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full border border-border-b" />
            <div>
              <p className="text-sm font-medium text-text">{name || "Your name"}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-subtle mb-1.5">{t("name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl text-sm",
                  "bg-surface-2 border border-border focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/30",
                  "text-text placeholder:text-muted/50 transition-all"
                )}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-subtle mb-1.5">{t("email")}</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-surface border border-border text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </motion.section>

        {/* Language */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-muted" />
            <h2 className="text-sm font-bold text-text">{t("language")}</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => setLanguage(loc.code)}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg border transition-all",
                  language === loc.code
                    ? "border-emerald/40 bg-emerald-dim text-emerald font-semibold"
                    : "border-border text-muted hover:text-text hover:border-border-b"
                )}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-muted" />
            <h2 className="text-sm font-bold text-text">{t("notifications")}</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "weeklyReport", state: weeklyReport, setter: setWeeklyReport },
              { key: "quotaAlerts", state: quotaAlerts, setter: setQuotaAlerts },
            ].map(({ key, state, setter }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-text font-medium">{t(key as "weeklyReport" | "quotaAlerts")}</p>
                  <p className="text-xs text-muted">{t(`${key}Desc` as "weeklyReportDesc" | "quotaAlertsDesc")}</p>
                </div>
                <button
                  onClick={() => setter((s: boolean) => !s)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-all",
                    state ? "bg-emerald" : "bg-border-b"
                  )}
                  role="switch"
                  aria-checked={state}
                >
                  <span className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                    state ? "left-5" : "left-0.5"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all",
              "bg-emerald text-background hover:bg-emerald-br glow-em-sm",
              saving && "opacity-70 cursor-not-allowed"
            )}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? t("saved") : t("save")}
          </button>
        </motion.div>

        {/* Danger zone */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface rounded-xl border border-red-500/20 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-red-400">{t("danger")}</h2>
          </div>
          <p className="text-xs text-muted mb-4">{t("deleteAccountDesc")}</p>
          <button
            onClick={handleDelete}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
              deleteConfirm
                ? "bg-red-500 text-white hover:bg-red-600"
                : "border border-red-500/30 text-red-400 hover:bg-red-500/10"
            )}
          >
            {deleteConfirm ? "Click again to confirm" : t("deleteConfirm")}
          </button>
        </motion.section>
      </div>
    </div>
  );
}
