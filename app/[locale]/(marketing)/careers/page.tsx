import type { Metadata } from "next";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

type SupportedLocale = "en" | "fr" | "es";

const META: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "Careers at SEOVALT",
    description:
      "Explore open roles at SEOVALT and help us build the future of SEO automation.",
  },
  fr: {
    title: "Carrieres chez SEOVALT",
    description:
      "Decouvrez les postes ouverts chez SEOVALT et construisez avec nous le futur du SEO autopilote.",
  },
  es: {
    title: "Empleo en SEOVALT",
    description:
      "Descubre vacantes en SEOVALT y ayudanos a construir el futuro de la automatizacion SEO.",
  },
};

const CONTENT: Record<
  SupportedLocale,
  {
    badge: string;
    title: string;
    intro: string;
    openingsTitle: string;
    openings: Array<{ role: string; type: string; note: string }>;
    apply: string;
    cultureTitle: string;
    cultureBody: string;
  }
> = {
  en: {
    badge: "Careers",
    title: "Join SEOVALT and build products that make teams faster.",
    intro:
      "We are building practical automation for SEO teams. We value ownership, clarity, and shipping useful features quickly.",
    openingsTitle: "Current openings",
    openings: [
      {
        role: "SEO Content Strategist",
        type: "Full-time",
        note: "Own topic research, editorial strategy, and performance loops.",
      },
      {
        role: "Growth Marketing Manager",
        type: "Full-time",
        note: "Scale acquisition through SEO, content, partnerships, and lifecycle.",
      },
      {
        role: "Frontend Engineer (Next.js)",
        type: "Full-time",
        note: "Build polished UX for dashboard and marketing experiences.",
      },
    ],
    apply: "Send your application to",
    cultureTitle: "How we work",
    cultureBody:
      "Remote-friendly, async-first, and focused on outcomes. We ship in small iterations and stay close to user feedback.",
  },
  fr: {
    badge: "Carrieres",
    title: "Rejoignez SEOVALT et construisez des produits qui accelerent les equipes.",
    intro:
      "Nous construisons une automatisation SEO pratique. Nous valorisons l'autonomie, la clarte et la livraison rapide de fonctionnalites utiles.",
    openingsTitle: "Postes ouverts",
    openings: [
      {
        role: "SEO Content Strategist",
        type: "Temps plein",
        note: "Piloter la recherche de sujets, la strategie editoriale et la boucle performance.",
      },
      {
        role: "Growth Marketing Manager",
        type: "Temps plein",
        note: "Accelerer l'acquisition via SEO, contenu, partenariats et lifecycle.",
      },
      {
        role: "Frontend Engineer (Next.js)",
        type: "Temps plein",
        note: "Construire une UX soignee pour le dashboard et le marketing.",
      },
    ],
    apply: "Envoyez votre candidature a",
    cultureTitle: "Notre facon de travailler",
    cultureBody:
      "Remote-friendly, async-first et orientes resultats. Nous livrons par petites iterations, proches des retours clients.",
  },
  es: {
    badge: "Carreras",
    title: "Unete a SEOVALT y crea productos que aceleren a los equipos.",
    intro:
      "Construimos automatizacion SEO practica. Valoramos autonomia, claridad y lanzamiento rapido de funciones utiles.",
    openingsTitle: "Vacantes actuales",
    openings: [
      {
        role: "SEO Content Strategist",
        type: "Tiempo completo",
        note: "Liderar investigacion de temas, estrategia editorial y bucle de rendimiento.",
      },
      {
        role: "Growth Marketing Manager",
        type: "Tiempo completo",
        note: "Escalar adquisicion con SEO, contenido, partnerships y lifecycle.",
      },
      {
        role: "Frontend Engineer (Next.js)",
        type: "Tiempo completo",
        note: "Construir una UX cuidada para dashboard y marketing.",
      },
    ],
    apply: "Envia tu candidatura a",
    cultureTitle: "Como trabajamos",
    cultureBody:
      "Remote-friendly, async-first y enfocados en resultados. Entregamos en iteraciones pequenas con feedback real de usuarios.",
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

export default async function CareersPage(
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

          <h2 className="mt-12 text-2xl font-bold text-text">{content.openingsTitle}</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {content.openings.map((opening) => (
              <article
                key={opening.role}
                className="rounded-[1.5rem] border border-border bg-surface-2 p-6"
              >
                <h3 className="text-lg font-semibold text-text">{opening.role}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
                  {opening.type}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">{opening.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-emerald/20 bg-emerald/5 px-6 py-5 text-sm text-muted">
            {content.apply}{" "}
            <a
              href="mailto:wearevalt@gmail.com"
              className="font-semibold text-emerald hover:text-emerald-br"
            >
              wearevalt@gmail.com
            </a>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-border bg-surface-2 p-6">
            <h2 className="text-xl font-bold text-text">{content.cultureTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{content.cultureBody}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
