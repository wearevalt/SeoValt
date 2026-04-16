import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FinalCTA } from "@/components/marketing/final-cta";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta.features" });
  return { title: t("title"), description: t("description") };
}

export default function FeaturesPage() {
  return (
    <div className="relative pt-24">
      <GradientOrbs />
      <Features />
      <HowItWorks />
      <FinalCTA />
    </div>
  );
}
