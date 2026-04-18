import Link from "next/link";

export default function LegalIndexPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-6">
            Informations légales
          </span>
          <h1 className="text-4xl font-black text-text">Pages légales SEOVALT</h1>
          <p className="mt-3 text-muted leading-8">
            Retrouvez ici nos documents juridiques essentiels : confidentialité, conditions d’utilisation, cookies et conformité RGPD.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Politique de confidentialité",
                description: "Comment nous collectons, stockons et protégeons vos données.",
                href: "/legal/privacy",
              },
              {
                title: "Conditions d’utilisation",
                description: "Les règles d’usage du service SEOVALT.",
                href: "/legal/terms",
              },
              {
                title: "Cookies",
                description: "Gestion des cookies et technologies similaires.",
                href: "/legal/cookies",
              },
              {
                title: "RGPD",
                description: "Vos droits et notre conformité au règlement européen.",
                href: "/legal/gdpr",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[1.75rem] border border-border p-6 transition hover:-translate-y-1 hover:border-emerald/40 hover:bg-surface-2"
              >
                <h2 className="text-xl font-semibold text-text transition group-hover:text-emerald">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm text-muted leading-6">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
