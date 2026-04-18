import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="relative pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <div className="inline-flex items-center gap-3 rounded-full bg-emerald/10 px-4 py-2 text-emerald font-semibold text-sm shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald/15 text-emerald">
              💬
            </span>
            Support SEOVALT
          </div>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Bienvenue chez l’assistant SEOVALT
          </h1>

          <p className="mt-5 text-lg text-muted leading-8">
            Le bouton de chat vous emmène maintenant sur cette page d’assistance. Pour l’instant, la messagerie en direct est encore en cours de déploiement, mais vous trouverez ici un point de contact clair pour nous joindre.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:support@seovalt.io"
              className="rounded-3xl border border-emerald/20 bg-emerald/5 px-6 py-5 text-left transition hover:bg-emerald/10"
            >
              <p className="text-sm font-semibold text-emerald">Envoyer un message</p>
              <p className="mt-2 text-sm text-muted">support@seovalt.io</p>
            </a>

            <div className="rounded-3xl border border-border bg-surface-2 px-6 py-5">
              <p className="text-sm font-semibold text-text">À propos du support</p>
              <p className="mt-2 text-sm text-muted leading-6">
                Nous vous répondrons sous 24h. Si vous cherchez une fonctionnalité particulière ou un guide, vous pouvez aussi explorer la documentation et les FAQ du site.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-3xl bg-emerald px-5 py-3 text-sm font-semibold text-background transition hover:bg-emerald-br"
            >
              Retour à l’accueil
            </Link>
            <p className="text-sm text-muted">
              Besoin d’une réponse immédiate ? Donnez-nous un peu de temps, nous sommes là pour vous aider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
