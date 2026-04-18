import { GradientOrbs } from "@/components/shared/gradient-orbs";

export default function StatusPage() {
  return (
    <div className="relative pt-24 min-h-screen overflow-hidden">
      <GradientOrbs />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] rounded-full border border-border-b text-muted bg-surface-2">
            Statut
          </span>
          <h1 className="mt-8 text-4xl font-black tracking-tight text-text sm:text-5xl">
            État de la plateforme SEOVALT
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Suivez en temps réel la disponibilité, les incidents et les maintenances de nos services.
          </p>

          <div className="mt-12 rounded-[2rem] border border-border bg-surface-2 p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">Statut global</p>
                <h2 className="mt-2 text-3xl font-bold text-text">Opérationnel</h2>
              </div>
              <div className="rounded-3xl bg-emerald/10 px-4 py-3 text-sm font-semibold text-emerald">
                Aucun incident en cours
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { label: "Site marketing", status: "En ligne" },
                { label: "API", status: "Opérationnel" },
                { label: "Authentification", status: "OK" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border p-4 bg-surface/80">
                  <p className="text-sm text-muted">{item.label}</p>
                  <p className="mt-3 text-xl font-semibold text-text">{item.status}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-border p-6 bg-surface/80">
              <p className="text-sm text-muted">Dernière mise à jour</p>
              <p className="mt-2 text-base text-text">Il y a moins de 5 minutes</p>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-border bg-surface/80 p-8 text-center shadow-[0_20px_60px_rgba(2,12,37,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-subtle">Notifications</p>
            <h2 className="mt-4 text-3xl font-black text-text sm:text-4xl">
              Soyez le premier informé en cas d’incident.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted leading-7">
              Abonnez-vous pour recevoir les alertes en temps réel dès qu’un évènement impacte SEOVALT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
