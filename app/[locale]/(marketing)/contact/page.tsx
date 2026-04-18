import type { Metadata } from "next";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

type SupportedLocale = "en" | "fr" | "es";

const META: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: "Contact SEOVALT",
    description:
      "Get in touch with SEOVALT by email or phone for support, partnerships, or business inquiries.",
  },
  fr: {
    title: "Contact SEOVALT",
    description:
      "Contactez SEOVALT par email ou telephone pour le support, les partenariats ou vos demandes commerciales.",
  },
  es: {
    title: "Contacto SEOVALT",
    description:
      "Contacta a SEOVALT por email o telefono para soporte, partnerships o consultas comerciales.",
  },
};

const CONTENT: Record<
  SupportedLocale,
  {
    badge: string;
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    replyTitle: string;
    replyBody: string;
    supportTitle: string;
    supportBody: string;
  }
> = {
  en: {
    badge: "Contact",
    title: "Let us know how we can help.",
    intro:
      "For support, partnerships, or any business request, contact the SEOVALT team directly.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    replyTitle: "Response time",
    replyBody: "We usually reply within 24 business hours.",
    supportTitle: "What we can help with",
    supportBody:
      "Product support, onboarding questions, SEO workflows, pricing guidance, and partnership opportunities.",
  },
  fr: {
    badge: "Contact",
    title: "Dites-nous comment nous pouvons vous aider.",
    intro:
      "Pour le support, les partenariats ou toute demande business, contactez directement l'equipe SEOVALT.",
    emailLabel: "Email",
    phoneLabel: "Telephone",
    replyTitle: "Delai de reponse",
    replyBody: "Nous repondons en general sous 24h ouvrables.",
    supportTitle: "Ce que nous couvrons",
    supportBody:
      "Support produit, onboarding, workflows SEO, conseils tarifaires et opportunites de partenariat.",
  },
  es: {
    badge: "Contacto",
    title: "Cuentanos como podemos ayudarte.",
    intro:
      "Para soporte, partnerships o cualquier consulta de negocio, contacta directamente al equipo SEOVALT.",
    emailLabel: "Email",
    phoneLabel: "Telefono",
    replyTitle: "Tiempo de respuesta",
    replyBody: "Normalmente respondemos dentro de 24 horas habiles.",
    supportTitle: "En que te ayudamos",
    supportBody:
      "Soporte de producto, onboarding, flujos SEO, orientacion de precios y oportunidades de partnership.",
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

export default async function ContactPage(
  props: { params: Promise<{ locale: string }> }
) {
  const { locale } = await props.params;
  const key = getLocaleKey(locale);
  const content = CONTENT[key];

  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <GradientOrbs />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <a
              href="mailto:wearevalt@gmail.com"
              className="rounded-[1.75rem] border border-emerald/20 bg-emerald/5 p-7 transition hover:bg-emerald/10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald">
                {content.emailLabel}
              </p>
              <p className="mt-3 text-lg font-semibold text-text">wearevalt@gmail.com</p>
            </a>

            <a
              href="tel:+212669335438"
              className="rounded-[1.75rem] border border-border bg-surface-2 p-7 transition hover:border-emerald/30"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">
                {content.phoneLabel}
              </p>
              <p className="mt-3 text-lg font-semibold text-text">00212669 33 54 38</p>
            </a>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-border bg-surface-2 p-6">
              <h2 className="text-lg font-semibold text-text">{content.replyTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{content.replyBody}</p>
            </article>
            <article className="rounded-[1.5rem] border border-border bg-surface-2 p-6">
              <h2 className="text-lg font-semibold text-text">{content.supportTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{content.supportBody}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
