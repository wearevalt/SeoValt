import type { Metadata } from "next";
import Link from "next/link";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

type SupportedLocale = "en" | "fr" | "es";

const META: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "SEOVALT Blog",
    description:
      "News, product updates, and practical SEO playbooks from the SEOVALT team.",
  },
  fr: {
    title: "Blog SEOVALT",
    description:
      "Actus, mises a jour produit et playbooks SEO pratiques de l'equipe SEOVALT.",
  },
  es: {
    title: "Blog de SEOVALT",
    description:
      "Novedades, actualizaciones de producto y playbooks SEO practicos del equipo SEOVALT.",
  },
};

const CONTENT: Record<
  SupportedLocale,
  {
    badge: string;
    title: string;
    intro: string;
    items: Array<{ title: string; category: string; summary: string }>;
    cta: string;
  }
> = {
  en: {
    badge: "Blog",
    title: "Insights for SEO, AEO, and GEO teams.",
    intro:
      "We publish practical guides and product updates to help you move faster with SEOVALT.",
    items: [
      {
        title: "How to set up SEO autopilot for a WordPress site",
        category: "Guide",
        summary:
          "A practical checklist to start fixing technical SEO issues and publishing optimized content.",
      },
      {
        title: "What changed in our latest scanner release",
        category: "Product update",
        summary:
          "A summary of scoring updates, faster audits, and improved recommendations.",
      },
      {
        title: "AEO basics: getting cited by answer engines",
        category: "Playbook",
        summary:
          "How to structure pages so LLMs and AI assistants understand and quote your content.",
      },
    ],
    cta: "Need a specific article topic? Contact us.",
  },
  fr: {
    badge: "Blog",
    title: "Des contenus utiles pour vos equipes SEO, AEO et GEO.",
    intro:
      "Nous publions des guides concrets et des updates produit pour vous aider a avancer plus vite avec SEOVALT.",
    items: [
      {
        title: "Comment lancer un SEO autopilote sur WordPress",
        category: "Guide",
        summary:
          "Une checklist simple pour corriger le SEO technique et publier du contenu optimise.",
      },
      {
        title: "Ce qui change dans notre dernier scanner",
        category: "Mise a jour produit",
        summary:
          "Resume des nouveaux scores, des audits plus rapides et des recommandations ameliorees.",
      },
      {
        title: "AEO: les bases pour etre cite par les moteurs de reponse",
        category: "Playbook",
        summary:
          "Comment structurer vos pages pour que les IA comprennent et citent votre contenu.",
      },
    ],
    cta: "Besoin d'un sujet d'article specifique ? Contactez-nous.",
  },
  es: {
    badge: "Blog",
    title: "Contenido util para equipos SEO, AEO y GEO.",
    intro:
      "Publicamos guias practicas y novedades de producto para ayudarte a avanzar mas rapido con SEOVALT.",
    items: [
      {
        title: "Como activar SEO en piloto automatico en WordPress",
        category: "Guia",
        summary:
          "Checklist practica para corregir SEO tecnico y publicar contenido optimizado.",
      },
      {
        title: "Que cambio en nuestra ultima version del scanner",
        category: "Actualizacion de producto",
        summary:
          "Resumen de nuevos scores, auditorias mas rapidas y recomendaciones mejoradas.",
      },
      {
        title: "AEO basico: como lograr citas en answer engines",
        category: "Playbook",
        summary:
          "Como estructurar paginas para que los asistentes IA entiendan y citen tu contenido.",
      },
    ],
    cta: "Necesitas un tema de articulo especifico? Contactanos.",
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

export default async function BlogPage(
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

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {content.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-border bg-surface-2 p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                  {item.category}
                </p>
                <h2 className="mt-4 text-lg font-semibold text-text">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.summary}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-emerald/20 bg-emerald/5 px-6 py-5 text-sm text-muted">
            {content.cta}{" "}
            <Link href="/contact" className="font-semibold text-emerald hover:text-emerald-br">
              Contact
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
