import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const seoSlugPattern = /^\/(?:[a-z]{2}\/)?[a-z0-9][a-z0-9-]*$/;

export function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  if (seoSlugPattern.test(request.nextUrl.pathname)) {
    response.headers.delete("link");
  }

  return response;
}

export const config = {
  matcher: "/((?!api|template-downloads|trpc|_next|_vercel|.*\\..*).*)",
};
