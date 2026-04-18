export default function CookiesPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-6">
            Cookies
          </span>
          <h1 className="text-4xl font-black text-text">Utilisation des cookies</h1>
          <p className="mt-4 text-muted leading-8">
            SEOVALT utilise des cookies pour améliorer votre expérience et garantir le bon fonctionnement du service.
          </p>

          <section className="mt-10 space-y-8 text-sm text-muted leading-7">
            <div>
              <h2 className="text-xl font-semibold text-text">Que sont les cookies ?</h2>
              <p className="mt-3">
                Ce sont de petits fichiers stockés sur votre navigateur qui permettent de retenir vos préférences, de mesurer l’utilisation du site et de sécuriser votre navigation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Cookies essentiels</h2>
              <p className="mt-3">
                Ces cookies sont nécessaires au fonctionnement du service, notamment pour la connexion, la gestion des sessions et la sécurité.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Cookies analytiques</h2>
              <p className="mt-3">
                Nous pouvons utiliser des cookies analytiques pour comprendre l’usage du site et améliorer l’interface, sans collecter de données personnelles identifiables.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Gestion</h2>
              <p className="mt-3">
                Vous pouvez gérer ou désactiver les cookies depuis les paramètres de votre navigateur. Notez que certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
