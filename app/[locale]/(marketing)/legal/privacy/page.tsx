export default function PrivacyPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-6">
            Politique de confidentialité
          </span>
          <h1 className="text-4xl font-black text-text">Protection de vos données</h1>
          <p className="mt-4 text-muted leading-8">
            SEOVALT s’engage à traiter vos données personnelles en toute transparence et sécurité.
          </p>

          <section className="mt-10 space-y-8 text-sm text-muted leading-7">
            <div>
              <h2 className="text-xl font-semibold text-text">Données collectées</h2>
              <p className="mt-3">
                Nous recueillons les informations que vous fournissez volontairement lors de votre inscription ou de votre demande de contact, ainsi que les données techniques nécessaires au bon fonctionnement du service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Utilisation des données</h2>
              <p className="mt-3">
                Vos données sont utilisées pour gérer votre compte, améliorer notre produit, envoyer des communications importantes et répondre à vos demandes d’assistance.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Sécurité</h2>
              <p className="mt-3">
                Nous protégeons vos données avec des mesures techniques et organisationnelles adaptées et ne partageons pas vos informations personnelles avec des partenaires non autorisés.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Durée de conservation</h2>
              <p className="mt-3">
                Nous conservons vos données aussi longtemps que nécessaire pour fournir le service, respecter nos obligations légales et gérer les relations avec nos clients.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Contact</h2>
              <p className="mt-3">
                Pour toute question relative à vos données, écrivez-nous à <span className="font-semibold text-emerald">support@seovalt.io</span>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
