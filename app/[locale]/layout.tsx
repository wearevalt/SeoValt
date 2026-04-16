import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://seovalt.io"),
    title: { default: t("home.title"), template: `%s — SEOVALT` },
    description: t("home.description"),
    openGraph: {
      type: "website",
      locale,
      siteName: "SEOVALT",
      title: t("home.title"),
      description: t("home.description"),
      url: `https://seovalt.io/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description: t("home.description"),
    },
    alternates: {
      canonical: `https://seovalt.io/${locale}`,
      languages: {
        "en": "https://seovalt.io/en",
        "fr": "https://seovalt.io/fr",
        "es": "https://seovalt.io/es",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "en" | "fr" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="noise-texture">
      <body className="min-h-screen bg-background text-text antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--surface)",
                border: "1px solid var(--border-b)",
                color: "var(--text)",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
