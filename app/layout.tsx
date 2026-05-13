import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { htmlLangs, isSupportedLocale } from "@/lib/i18n";
import "./globals.css";

const analyticsHost = process.env.NEXT_PUBLIC_UMAMI_HOST;
const analyticsWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://labelhelper.com"),
  title: {
    default: "Shipping Label Helper",
    template: "%s | Shipping Label Helper",
  },
  description: "Free shipping-label size checker, templates and troubleshooting tools for small ecommerce sellers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const supportedLocale = isSupportedLocale(locale) ? locale : "en";

  return (
    <html lang={htmlLangs[supportedLocale]} className="h-full antialiased">
      <body className="min-h-full bg-slate-50 font-sans">
        {analyticsHost && analyticsWebsiteId ? (
          <Script src={`${analyticsHost}/script.js`} data-website-id={analyticsWebsiteId} strategy="afterInteractive" />
        ) : null}
        <NextIntlClientProvider locale={supportedLocale} messages={messages}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
