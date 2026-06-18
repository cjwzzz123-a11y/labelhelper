import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";

const localePrefixPattern = new RegExp(`^/(${locales.join("|")})(?:/|$)`);

export function proxy(request: NextRequest) {
  if (localePrefixPattern.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/((?!api|template-downloads|trpc|_next|_vercel|.*\\..*).*)",
};
