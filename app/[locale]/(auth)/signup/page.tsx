"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const FALLBACK_APP_URL = "https://seo-valt.vercel.app";

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const getAuthCallbackUrl = () => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const browserOrigin =
      typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";
    const origin = browserOrigin || configured || FALLBACK_APP_URL;
    const next = encodeURIComponent(`/${locale}/dashboard`);
    return `${origin}/${locale}/auth/callback?next=${next}`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
          data: { full_name: name },
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl() },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect with Google";
      toast.error(message);
      setGLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glass rounded-2xl border border-border-b p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-dim border border-emerald/30 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-emerald" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Check your inbox</h2>
        <p className="text-sm text-muted mb-6">
          We sent a magic link to <strong className="text-text">{email}</strong>.
          Click it to activate your account.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-muted hover:text-text transition-colors underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-border-b p-8">
      <h1 className="text-2xl font-black text-text mb-1">{t("title")}</h1>
      <p className="text-sm text-muted mb-6">{t("subtitle")}</p>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={gLoading}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold",
          "border border-border-b bg-surface-2 text-text",
          "hover:border-border-b hover:bg-surface transition-all duration-200",
          gLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {gLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {t("google")}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted">{t("divider")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-subtle mb-1.5">{t("name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl text-sm",
              "bg-surface border border-border focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/30",
              "text-text placeholder:text-muted/50 transition-all"
            )}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-subtle mb-1.5">{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl text-sm",
              "bg-surface border border-border focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/30",
              "text-text placeholder:text-muted/50 transition-all"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold",
            "bg-emerald text-background",
            "hover:bg-emerald-br transition-all duration-200 glow-em-sm",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-xs text-muted text-center">
        {t("terms")}{" "}
        <Link href="/legal/terms" className="underline hover:text-text transition-colors">{t("termsLink")}</Link>
        {" "}{t("and")}{" "}
        <Link href="/legal/privacy" className="underline hover:text-text transition-colors">{t("privacyLink")}</Link>.
      </p>

      <p className="mt-4 text-center text-xs text-muted">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-emerald hover:text-emerald-br transition-colors font-medium">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
