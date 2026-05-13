import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RefundsPage, { metadata } from "@/app/refunds/page";
import { isSupportedLocale, locales } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export { metadata };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleRefundsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <RefundsPage />;
}
