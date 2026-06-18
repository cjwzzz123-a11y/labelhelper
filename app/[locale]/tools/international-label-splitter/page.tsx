import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import InternationalLabelSplitterPage from "@/app/tools/international-label-splitter/page";
import { isSupportedLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  return pageMetadata({
    title: "Verified eBay USPS International Label Splitter",
    description: "Extract the verified eBay USPS PS Form 2976 label/customs block from a Letter PDF into a 4x6 PDF in your browser.",
    path: "/tools/international-label-splitter",
    locale,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleInternationalLabelSplitterPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  setRequestLocale(locale);
  return <InternationalLabelSplitterPage />;
}
