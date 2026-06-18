import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PrivacyPage from "@/app/privacy/page";
import { isSupportedLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return pageMetadata({
    title: "Privacy Policy | Shipping Label Helper",
    description: "Privacy policy for Shipping Label Helper. PDF files are processed locally in the browser and are not uploaded to our server.",
    path: "/privacy",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <PrivacyPage />;
}
