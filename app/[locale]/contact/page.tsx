import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ContactPage from "@/app/contact/page";
import { isSupportedLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return pageMetadata({
    title: "Contact | Shipping Label Helper",
    description: "Contact Shipping Label Helper for refunds, license key help, technical issues and business inquiries.",
    path: "/contact",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <ContactPage />;
}
