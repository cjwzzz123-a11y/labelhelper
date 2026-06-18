import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RefundsPage from "@/app/refunds/page";
import { isSupportedLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return pageMetadata({
    title: "Refund Policy | Shipping Label Helper",
    description: "14-day refund policy for Shipping Label Helper Pro Toolkit purchases made through Creem.",
    path: "/refunds",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleRefundsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <RefundsPage />;
}
