"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Rocket, X } from "lucide-react";

export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 220);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-3 sm:right-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 text-emerald shadow-[0_25px_50px_rgba(16,185,129,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(16,185,129,0.22)]"
          aria-label="Retour en haut"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),transparent_55%)]" />
          <span className="absolute inset-0 rounded-full border border-cyan/20" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface/90 border border-border/70 glow-em animate-float">
            <Rocket className="h-5 w-5 text-emerald" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface/95 text-cyan shadow-[0_22px_44px_rgba(14,165,233,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_54px_rgba(14,165,233,0.24)]"
          aria-label="Ouvrir le chat"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),transparent_60%)]" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface/90 border border-border/70 backdrop-blur-sm glow-cy animate-float">
            <MessageCircle className="h-5 w-5 text-cyan" />
          </span>
        </button>
      </div>

      {chatOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setChatOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Fermer le chat"
          />

          <div className="relative w-full max-w-sm rounded-[2rem] border border-border bg-surface/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text">Assistant SEOVALT</p>
                <p className="mt-1 text-xs text-muted">
                  Bonjour ! Je suis là pour vous aider.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface border border-border text-muted transition hover:text-text hover:bg-surface-2"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-3xl bg-surface-2 p-4 text-sm text-muted">
                Salut ! Cliquez ci-dessous pour commencer votre conversation avec l’assistant SEOVALT.
              </div>
              <div className="rounded-3xl bg-emerald/10 p-4 text-sm text-text">
                Je peux vous aider à choisir un plan, à explorer les fonctionnalités ou à poser une question SEO.
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-3xl border border-border bg-surface-2 px-4 py-3">
              <input
                type="text"
                placeholder="Écrire un message..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
              />
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald px-4 text-sm font-semibold text-background transition hover:bg-emerald-br"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
