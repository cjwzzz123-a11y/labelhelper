import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import TermsPage, { metadata } from "@/app/terms/page";
import { isSupportedLocale, locales } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export { metadata };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleTermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <TermsPage />;
}
