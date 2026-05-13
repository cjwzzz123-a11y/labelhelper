import { redirect } from "next/navigation";
import { isSupportedLocale, localizedPath } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleSizeCheckerPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(`${localizedPath("/", isSupportedLocale(locale) ? locale : "en")}#checker`);
}
