export default function GDPRPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-6">
            RGPD
          </span>
          <h1 className="text-4xl font-black text-text">Conformité RGPD</h1>
          <p className="mt-4 text-muted leading-8">
            SEOVALT respecte le Règlement Général sur la Protection des Données pour les utilisateurs européens.
          </p>

          <section className="mt-10 space-y-8 text-sm text-muted leading-7">
            <div>
              <h2 className="text-xl font-semibold text-text">Responsable du traitement</h2>
              <p className="mt-3">
                SEOVALT est responsable du traitement des données collectées dans le cadre de l’utilisation du service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Base légale</h2>
              <p className="mt-3">
                Nous traitons les données personnelles lorsque cela est nécessaire pour fournir nos services, respecter des obligations légales ou répondre à vos demandes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Vos droits</h2>
              <p className="mt-3">
                Vous pouvez demander l’accès, la rectification, la suppression, la limitation ou la portabilité de vos données, ainsi que vous opposer au traitement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Durée de conservation</h2>
              <p className="mt-3">
                Les données sont conservées uniquement aussi longtemps que nécessaire pour la prestation du service, la sécurité et nos obligations légales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Contact RGPD</h2>
              <p className="mt-3">
                Pour exercer vos droits ou poser une question RGPD, contactez-nous à <span className="font-semibold text-emerald">support@seovalt.io</span>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
