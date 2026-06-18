import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";

const localeHeaderName = "X-NEXT-INTL-LOCALE";
const localePrefixPattern = new RegExp(`^/(${locales.join("|")})(?:/|$)`);

export function localeFromRequestPath(pathname: string) {
  return (pathname.match(localePrefixPattern)?.[1] ?? defaultLocale) as (typeof locales)[number];
}

function requestHeadersWithLocale(request: NextRequest, locale: (typeof locales)[number]) {
  const headers = new Headers(request.headers);
  headers.set(localeHeaderName, locale);
  return headers;
}

export function proxy(request: NextRequest) {
  const locale = localeFromRequestPath(request.nextUrl.pathname);
  const requestHeaders = requestHeadersWithLocale(request, locale);

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
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/((?!api|template-downloads|trpc|_next|_vercel|.*\\..*).*)",
};
