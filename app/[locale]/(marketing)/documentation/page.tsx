import { GradientOrbs } from "@/components/shared/gradient-orbs";

export default function DocumentationPage() {
  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <GradientOrbs />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] rounded-full border border-border-b text-muted bg-surface-2">
            Documentation
          </span>
          <h1 className="mt-8 text-4xl font-black tracking-tight text-text sm:text-5xl">
            Tout ce dont vous avez besoin pour démarrer avec SEOVALT
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Guides, cas d’usage et références techniques pour comprendre rapidement comment utiliser SEOVALT et intégrer ses fonctionnalités.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-border bg-surface-2 p-8 transition hover:-translate-y-1 hover:border-emerald/40 hover:shadow-[0_30px_80px_rgba(16,185,129,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">Guides</p>
              <h2 className="mt-4 text-2xl font-semibold text-text">Prise en main rapide</h2>
              <p className="mt-4 text-sm text-muted leading-7">
                Découvrez comment configurer vos projets, activer l’analyse SEO et lancer votre première campagne d’optimisation.
              </p>
            </article>

            <article className="rounded-[2rem] border border-border bg-surface-2 p-8 transition hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_30px_80px_rgba(14,165,233,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">FAQ</p>
              <h2 className="mt-4 text-2xl font-semibold text-text">Réponses rapides</h2>
              <p className="mt-4 text-sm text-muted leading-7">
                Retrouvez les questions les plus fréquentes sur l’utilisation de SEOVALT, les plans, la facturation et la sécurité.
              </p>
            </article>
          </div>

          <div className="mt-12 rounded-[2rem] border border-border bg-surface/80 p-8 text-center shadow-[0_20px_60px_rgba(2,12,37,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-subtle">Besoin d’un guide</p>
            <h2 className="mt-4 text-3xl font-black text-text sm:text-4xl">
              La documentation SEOVALT est conçue pour les équipes SEO et dev.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted leading-7">
              Accédez à des explications claires, des exemples concrets et des ressources techniques pour accélérer votre intégration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
