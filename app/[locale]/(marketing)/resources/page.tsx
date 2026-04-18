import { GradientOrbs } from "@/components/shared/gradient-orbs";

const RESOURCES = [
  {
    title: "Guides pratiques",
    description: "Des tutoriels étape par étape pour optimiser votre site et accélérer votre référencement.",
    note: "Conseils SEO opérationnels et workflows marketing.",
  },
  {
    title: "API et intégrations",
    description: "Documentation complète pour connecter SEOVALT à vos outils et automatiser vos flux.",
    note: "API REST, Webhooks et intégrations tierces.",
  },
  {
    title: "Actualités produit",
    description: "Les dernières améliorations, nouveautés et correctifs de la plateforme.",
    note: "Restez informé de l’évolution de SEOVALT.",
  },
  {
    title: "Assistance et support",
    description: "Accédez aux ressources d’aide, FAQ et contacts pour une assistance rapide.",
    note: "Support par email, chat et FAQ dédiée.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <GradientOrbs />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] rounded-full border border-border-b text-muted bg-surface-2">
                Ressources SEOVALT
              </span>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-text sm:text-5xl">
                Le centre de ressources pour booster votre SEO.
              </h1>
              <p className="mt-4 text-lg leading-8 text-muted">
                Trouvez des guides, des modèles, des docs API et des astuces pratiques pour tirer le meilleur parti de SEOVALT.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-surface-2 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Accès rapide</p>
              <ul className="mt-4 space-y-4 text-sm text-muted">
                <li>Guides SEO</li>
                <li>Documentation API</li>
                <li>Mises à jour produit</li>
                <li>Support & FAQ</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {RESOURCES.map((item) => (
              <article
                key={item.title}
                className="group rounded-[2rem] border border-border bg-surface-2 p-8 transition hover:-translate-y-1 hover:border-emerald/40 hover:shadow-[0_30px_80px_rgba(16,185,129,0.08)]"
              >
                <div className="inline-flex items-center gap-3 rounded-full bg-emerald/10 px-4 py-2 text-sm font-semibold text-emerald">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
                  {item.title}
                </div>
                <p className="mt-6 text-lg font-semibold text-text">{item.description}</p>
                <p className="mt-4 text-sm text-muted">{item.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] border border-border bg-surface/80 p-10 text-center shadow-[0_20px_60px_rgba(2,12,37,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-subtle">Besoin d’un accompagnement ?</p>
            <h2 className="mt-4 text-3xl font-black text-text sm:text-4xl">
              Découvrez des ressources pensées pour les équipes SEO et marketing.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted leading-7">
              Guides pratiques, intégrations techniques et support dédié pour vous aider à configurer SEOVALT rapidement et mieux piloter vos campagnes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
