import {getRequestConfig} from "next-intl/server";
import {defaultLocale, isSupportedLocale} from "@/lib/i18n";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = isSupportedLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
