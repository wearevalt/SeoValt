import type { Metadata } from "next";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

type SupportedLocale = "en" | "fr" | "es";

const META: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "About SEOVALT",
    description:
      "Learn more about SEOVALT, our mission, and the team building SEO automation for WordPress teams.",
  },
  fr: {
    title: "A propos de SEOVALT",
    description:
      "Decouvrez SEOVALT, notre mission et notre equipe qui construit l'automatisation SEO pour WordPress.",
  },
  es: {
    title: "Acerca de SEOVALT",
    description:
      "Conoce SEOVALT, nuestra mision y el equipo que construye automatizacion SEO para WordPress.",
  },
};

const CONTENT: Record<
  SupportedLocale,
  {
    badge: string;
    title: string;
    intro: string;
    missionTitle: string;
    missionBody: string;
    values: Array<{ title: string; body: string }>;
  }
> = {
  en: {
    badge: "Company",
    title: "We build practical SEO automation for real teams.",
    intro:
      "SEOVALT helps WordPress teams improve visibility on search engines and AI assistants without adding complexity to daily workflows.",
    missionTitle: "Our mission",
    missionBody:
      "Give every business a reliable SEO co-pilot that turns technical tasks into clear actions and measurable growth.",
    values: [
      {
        title: "Clarity first",
        body: "Every recommendation should be simple to understand and easy to execute.",
      },
      {
        title: "Action over noise",
        body: "We prioritize fixes and insights that produce measurable impact.",
      },
      {
        title: "Built for teams",
        body: "SEOVALT is designed for founders, marketers, and agencies working together.",
      },
    ],
  },
  fr: {
    badge: "Entreprise",
    title: "Nous construisons un SEO autopilote utile et concret.",
    intro:
      "SEOVALT aide les equipes WordPress a gagner en visibilite sur les moteurs de recherche et les IA sans complexifier leur travail quotidien.",
    missionTitle: "Notre mission",
    missionBody:
      "Donner a chaque entreprise un copilote SEO fiable qui transforme les taches techniques en actions claires et en croissance mesurable.",
    values: [
      {
        title: "Clarite avant tout",
        body: "Chaque recommandation doit etre simple a comprendre et facile a executer.",
      },
      {
        title: "Action, pas du bruit",
        body: "Nous priorisons les corrections et insights qui ont un impact reel.",
      },
      {
        title: "Pense pour les equipes",
        body: "SEOVALT est concu pour les fondateurs, marketers et agences.",
      },
    ],
  },
  es: {
    badge: "Empresa",
    title: "Construimos automatizacion SEO practica para equipos reales.",
    intro:
      "SEOVALT ayuda a los equipos WordPress a ganar visibilidad en buscadores y asistentes IA sin complicar su flujo diario.",
    missionTitle: "Nuestra mision",
    missionBody:
      "Dar a cada empresa un copiloto SEO confiable que convierta tareas tecnicas en acciones claras y crecimiento medible.",
    values: [
      {
        title: "Claridad primero",
        body: "Cada recomendacion debe ser simple de entender y facil de ejecutar.",
      },
      {
        title: "Accion sobre ruido",
        body: "Priorizamos correcciones e insights que generan impacto real.",
      },
      {
        title: "Creado para equipos",
        body: "SEOVALT esta pensado para fundadores, marketers y agencias.",
      },
    ],
  },
};

function getLocaleKey(locale: string): SupportedLocale {
  return locale === "fr" || locale === "es" ? locale : "en";
}

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await props.params;
  const key = getLocaleKey(locale);
  return META[key];
}

export default async function AboutPage(
  props: { params: Promise<{ locale: string }> }
) {
  const { locale } = await props.params;
  const key = getLocaleKey(locale);
  const content = CONTENT[key];

  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <GradientOrbs />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <section className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex rounded-full border border-border-b bg-surface-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            {content.badge}
          </span>

          <h1 className="mt-8 text-4xl font-black tracking-tight text-text sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {content.intro}
          </p>

          <div className="mt-12 rounded-[1.75rem] border border-border bg-surface-2 p-8">
            <h2 className="text-2xl font-bold text-text">{content.missionTitle}</h2>
            <p className="mt-4 text-base leading-7 text-muted">{content.missionBody}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {content.values.map((value) => (
              <article
                key={value.title}
                className="rounded-[1.5rem] border border-border bg-surface-2 p-6"
              >
                <h3 className="text-lg font-semibold text-text">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{value.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
