export default function TermsPage() {
  return (
    <div className="relative pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-surface/90 p-10 shadow-[0_30px_80px_rgba(2,12,37,0.24)] backdrop-blur-xl">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-6">
            Conditions d’utilisation
          </span>
          <h1 className="text-4xl font-black text-text">Conditions générales</h1>
          <p className="mt-4 text-muted leading-8">
            L’utilisation de SEOVALT est soumise à ces conditions. Merci de les lire avec attention.
          </p>

          <section className="mt-10 space-y-8 text-sm text-muted leading-7">
            <div>
              <h2 className="text-xl font-semibold text-text">Acceptation</h2>
              <p className="mt-3">
                En utilisant SEOVALT, vous acceptez ces conditions. Si vous n’êtes pas d’accord, n’utilisez pas le service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Accès au service</h2>
              <p className="mt-3">
                SEOVALT vous est fourni en tant que service SaaS. L’accès dépend du respect des conditions d’inscription et de paiement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Compte et sécurité</h2>
              <p className="mt-3">
                Vous êtes responsable des informations de votre compte et de la sécurité de vos identifiants.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Propriété intellectuelle</h2>
              <p className="mt-3">
                Tous les contenus de SEOVALT restent la propriété de SEOVALT ou de ses partenaires. Vous disposez d’une licence d’utilisation limitée.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Paiements</h2>
              <p className="mt-3">
                Les plans payants sont facturés selon les conditions présentées lors de l’achat. Les remboursements sont gérés conformément à notre politique commerciale.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">Limitations</h2>
              <p className="mt-3">
                SEOVALT est fourni "tel quel". Nous ne garantissons pas qu’il répondra à tous les besoins ou qu’il fonctionnera de manière ininterrompue.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
