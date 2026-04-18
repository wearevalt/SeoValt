import type { Metadata } from "next";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

type SupportedLocale = "en" | "fr" | "es";

type LinkItem = { label: string; href: string };
type BlockItem = { title: string; detail: string };
type FaqItem = { q: string; a: string };

const META: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "SEO 2026 Roadmap - SEOVALT",
    description:
      "Step-by-step roadmap to install RankPilot, connect APIs, run scans, and improve WordPress SEO.",
  },
  fr: {
    title: "Feuille de route SEO 2026 - SEOVALT",
    description:
      "Guide pas à pas pour installer RankPilot, connecter les APIs et optimiser votre SEO WordPress.",
  },
  es: {
    title: "Hoja de ruta SEO 2026 - SEOVALT",
    description:
      "Guía paso a paso para instalar RankPilot, conectar APIs y optimizar tu SEO en WordPress.",
  },
};

const DIRECT_LINKS: LinkItem[] = [
  { label: "Anthropic Console", href: "https://console.anthropic.com/" },
  { label: "Anthropic API Keys", href: "https://console.anthropic.com/settings/keys" },
  { label: "Google PageSpeed", href: "https://pagespeed.web.dev/" },
  {
    label: "Activer l'API PageSpeed",
    href: "https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com",
  },
  {
    label: "Google API Credentials",
    href: "https://console.cloud.google.com/apis/credentials",
  },
  { label: "Google Search Console", href: "https://search.google.com/search-console" },
];

const PRE_REQUIS: BlockItem[] = [
  { title: "WordPress actif", detail: "Version 5.8+ recommandée." },
  { title: "Accès administrateur", detail: "Droits admin complets requis." },
  { title: "Fichier ZIP du plugin", detail: "Fourni par VALT après achat." },
  {
    title: "Clés API (optionnel mais recommandé)",
    detail: "Anthropic IA + Google PageSpeed pour débloquer les optimisations avancées.",
  },
];

const INSTALLATION_STEPS = [
  "Connectez-vous à votre tableau de bord WordPress.",
  "Ouvrez Extensions -> Ajouter.",
  "Importez le fichier ZIP du plugin fourni par VALT.",
  "Cliquez sur Installer puis Activer.",
];

const SETTINGS_STEPS: BlockItem[] = [
  {
    title: "01. Clé API Anthropic",
    detail: "Collez votre clé sk-ant-... dans RankPilot -> Settings -> Clé API.",
  },
  {
    title: "02. Clé Google PageSpeed",
    detail: "Ajoutez votre clé pour analyser les freins techniques de performance.",
  },
  {
    title: "03. GEO / AI Search",
    detail: "Activez l'optimisation pour ChatGPT et Perplexity.",
  },
  {
    title: "04. Profil du site",
    detail: "Renseignez secteur, business et localisation pour guider l'IA.",
  },
];

const SCAN_STEPS = [
  "Ouvrez RankPilot -> Dashboard.",
  "Cliquez sur Scan SEO.",
  "Patientez 30 à 60 secondes sans fermer la page.",
  "Consultez les alertes et recommandations dans le dashboard.",
];

const SCAN_ANALYSIS = [
  "Titres, meta descriptions, H1/H2.",
  "Images sans attribut alt.",
  "robots.txt, sitemap, HTTPS.",
  "Catégories, mots-clés, performance PageSpeed.",
];

const SCORE_LEVELS = [
  "0-49 : Urgent",
  "50-79 : À optimiser",
  "80-100 : Optimisé",
];

const COUNTERS = [
  "Détectées : erreurs trouvées au scan.",
  "En attente : corrections en cours.",
  "Résolues : problèmes corrigés.",
  "Échouées : cas non automatisables.",
];

const AUTO_FIXES = [
  "Titres SEO alignés sur vos mots-clés prioritaires.",
  "Meta descriptions optimisées pour augmenter le taux de clic.",
  "Attributs alt images pour accessibilité et SEO.",
  "Structure H1/H2 claire pour les moteurs de recherche.",
];

const FAILED_REASONS = [
  "Pages Elementor : contenu piloté par le builder.",
  "Images externes : médias hébergés hors WordPress.",
  "Pages vides/démo : bruit inutile dans l'audit.",
];

const WEEKLY_WORKFLOW = [
  "Lundi (5 min) : lancer Scan SEO puis Corriger tout.",
  "Mercredi (2 min) : vérifier les articles autopilot générés.",
  "Vendredi (5 min) : lire le rapport hebdomadaire et suivre les progrès.",
];

const FAQ: FaqItem[] = [
  {
    q: "Le plugin agit-il sans validation ?",
    a: "Non. RankPilot ne lance aucune action sensible sans votre accord.",
  },
  {
    q: "Remplace-t-il Yoast ou RankMath ?",
    a: "Non. RankPilot complète ces plugins et fonctionne avec eux.",
  },
  {
    q: "Combien coûte l'API Anthropic ?",
    a: "En général 1 à 5 USD / mois pour un site standard.",
  },
];

const API_SECURITY = [
  "Ne partagez jamais votre clé API.",
  "Définissez un budget mensuel dans console.anthropic.com.",
  "Utilisez 1 clé API par site pour un meilleur suivi.",
];

const QUICK_START = [
  "Installer le ZIP (2 min) : Extensions -> Ajouter -> importer -> activer.",
  "Coller la clé API (1 min) : RankPilot -> Settings -> Anthropic.",
  "Lancer le scan (1 min) : cliquer sur Scan SEO.",
  "Corriger tout (1 min) : laisser l'IA optimiser le site.",
];

function getLocaleKey(locale: string): SupportedLocale {
  return locale === "fr" || locale === "es" ? locale : "en";
}

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await props.params;
  return META[getLocaleKey(locale)];
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-black tracking-tight text-text">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p> : null}
    </header>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted">
      {items.map((item) => (
        <li key={item} className="leading-6">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-24">
      <GradientOrbs />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <section className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex rounded-full border border-border-b bg-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            SEO 2026
          </span>
          <h1 className="mt-8 text-4xl font-black tracking-tight text-text sm:text-5xl">
            Feuille de route RankPilot - pas à pas
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-muted">
            Aucune compétence technique requise. Ce guide vous accompagne étape par
            étape pour optimiser votre site WordPress et gagner en visibilité sur
            Google.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {DIRECT_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-cyan transition hover:border-cyan/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
              <p className="text-2xl font-black text-emerald">Rapide</p>
              <p className="mt-2 text-sm text-muted">
                Actions claires, immédiates, mesurables.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
              <p className="text-2xl font-black text-cyan">Automatique</p>
              <p className="mt-2 text-sm text-muted">
                Moins de réglages. Plus de résultats.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
              <p className="text-2xl font-black text-amber-300">Visible</p>
              <p className="mt-2 text-sm text-muted">
                Contenu mieux structuré, trafic mieux qualifié.
              </p>
            </article>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Préparation - pré-requis avant installation"
              subtitle="Si votre site WordPress est déjà actif, vous avez probablement l'essentiel."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {PRE_REQUIS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.25rem] border border-border bg-surface-2 p-5"
                >
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.detail}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Sans clés API, les scans SEO de base fonctionnent déjà bien. Les clés
              débloquent surtout les optimisations automatiques par IA.
            </p>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Installation guidée en 4 étapes"
              subtitle="Une mise en route claire, pensée pour les équipes SEO modernes."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {INSTALLATION_STEPS.map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.25rem] border border-border bg-surface-2 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
                    Étape {index + 1}
                  </p>
                  <p className="mt-2 text-sm text-muted">{step}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Installation réussie : le menu RankPilot apparaît automatiquement dans la
              barre latérale WordPress.
            </p>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Configuration des paramètres"
              subtitle="Accédez à RankPilot -> Settings pour activer IA, performance et AI Search."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {SETTINGS_STEPS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.25rem] border border-border bg-surface-2 p-5"
                >
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.detail}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Règle simple : pensez à cliquer sur "Sauvegarder les paramètres" après
              chaque modification.
            </p>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Scan SEO RankPilot"
              subtitle="Un audit complet en 30 à 60 secondes pour passer vite à l'action."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Lancer le scan</h3>
                <div className="mt-3">
                  <BulletList items={SCAN_STEPS} />
                </div>
              </article>
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Ce que RankPilot analyse</h3>
                <div className="mt-3">
                  <BulletList items={SCAN_ANALYSIS} />
                </div>
              </article>
            </div>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Lecture instantanée du dashboard"
              subtitle="Score global, alertes prioritaires et statut des corrections en un coup d'œil."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Score SEO</h3>
                <div className="mt-3">
                  <BulletList items={SCORE_LEVELS} />
                </div>
              </article>
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Compteurs clés</h3>
                <div className="mt-3">
                  <BulletList items={COUNTERS} />
                </div>
              </article>
            </div>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="Corriger tout automatiquement"
              subtitle="Une IA SEO moderne, rapide et alignée sur votre marque."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {AUTO_FIXES.map((item) => (
                <article
                  key={item}
                  className="rounded-[1.25rem] border border-border bg-surface-2 p-5 text-sm text-muted"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <SectionTitle
              title='Erreurs "Failed" + workflow hebdomadaire'
              subtitle="Des actions courtes et des corrections ciblées pour un SEO plus régulier."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Pourquoi certaines erreurs échouent</h3>
                <div className="mt-3">
                  <BulletList items={FAILED_REASONS} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  À faire : corriger dans Yoast/RankMath ou supprimer les pages démo
                  inutiles.
                </p>
              </article>
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Rythme recommandé</h3>
                <div className="mt-3">
                  <BulletList items={WEEKLY_WORKFLOW} />
                </div>
                <p className="mt-3 text-sm text-muted">
                  12 minutes par semaine pour un SEO optimisé en continu.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-14">
            <SectionTitle
              title="FAQ & sécurité API"
              subtitle="Réponses rapides, bonnes pratiques et contrôle budgétaire."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Questions fréquentes</h3>
                <div className="mt-3 space-y-3">
                  {FAQ.map((item) => (
                    <div key={item.q}>
                      <p className="text-sm font-semibold text-text">{item.q}</p>
                      <p className="mt-1 text-sm text-muted">{item.a}</p>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-[1.25rem] border border-border bg-surface-2 p-5">
                <h3 className="font-semibold text-text">Sécurité API</h3>
                <div className="mt-3">
                  <BulletList items={API_SECURITY} />
                </div>
              </article>
            </div>
          </div>

          <div className="mt-14 rounded-[1.5rem] border border-emerald/20 bg-emerald/5 p-6">
            <SectionTitle
              title="Quick Start 5 minutes + support VALT"
              subtitle="Installation, configuration, audit, correction : tout est conçu pour aller vite."
            />
            <BulletList items={QUICK_START} />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <a
                href="mailto:support@wearevalt.co"
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text"
              >
                Email support : support@wearevalt.co
              </a>
              <a
                href="https://wearevalt.co"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text"
              >
                Site web : wearevalt.co
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
