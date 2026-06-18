import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import TermsPage from "@/app/terms/page";
import { isSupportedLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return pageMetadata({
    title: "Terms of Service | Shipping Label Helper",
    description: "Terms of Service for Shipping Label Helper browser-based shipping label tools and Pro Toolkit digital license.",
    path: "/terms",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleTermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <TermsPage />;
}
