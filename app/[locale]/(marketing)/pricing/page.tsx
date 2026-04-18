import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Pricing } from "@/components/marketing/pricing";
import { FAQPricing } from "@/components/marketing/faq-pricing";
import { FinalCTA } from "@/components/marketing/final-cta";
import { GradientOrbs } from "@/components/shared/gradient-orbs";

export async function generateMetadata(
  props: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta.pricing" });
  return { title: t("title"), description: t("description") };
}

export default function PricingPage() {
  return (
    <div className="relative pt-24">
      <GradientOrbs />
      <Pricing />
      <FAQPricing />
      <FinalCTA />
    </div>
  );
}
