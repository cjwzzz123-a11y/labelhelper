import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";
import { hasLocalizedPath, unlocalizedPath } from "./lib/i18n";

const localeHeaderName = "X-NEXT-INTL-LOCALE";
const internalRewriteHeaderName = "X-LABELHELPER-INTERNAL-LOCALE-REWRITE";
const localePrefixPattern = new RegExp(`^/(${locales.join("|")})(?:/|$)`);

export function localeFromRequestPath(pathname: string) {
  return (pathname.match(localePrefixPattern)?.[1] ?? defaultLocale) as (typeof locales)[number];
}

export function localeRedirectPath(pathname: string) {
  const match = pathname.match(localePrefixPattern);
  if (!match) return null;

  const locale = match[1] as (typeof locales)[number];
  const unprefixed = unlocalizedPath(pathname);
  if (locale === defaultLocale || !hasLocalizedPath(unprefixed, locale)) return unprefixed;

  return null;
}

function requestHeadersWithLocale(request: NextRequest, locale: (typeof locales)[number], internalRewrite = false) {
  const headers = new Headers(request.headers);
  headers.set(localeHeaderName, locale);
  if (internalRewrite) headers.set(internalRewriteHeaderName, "1");
  return headers;
}

export function proxy(request: NextRequest) {
  const locale = localeFromRequestPath(request.nextUrl.pathname);
  const isInternalLocaleRewrite = request.headers.get(internalRewriteHeaderName) === "1";
  const requestHeaders = requestHeadersWithLocale(request, locale, isInternalLocaleRewrite);
  const redirectPath = isInternalLocaleRewrite ? null : localeRedirectPath(request.nextUrl.pathname);

  if (redirectPath) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url, 308);
  }

  if (locale !== defaultLocale || localePrefixPattern.test(request.nextUrl.pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeadersWithLocale(request, locale, true),
    },
  });
}

export const config = {
  matcher: "/((?!api|template-downloads|opengraph-image|trpc|_next|_vercel|.*\\..*).*)",
};
