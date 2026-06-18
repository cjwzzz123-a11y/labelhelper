import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const utilityRoutes = ["/thanks", "/unlock"];
const localizedUtilityRoutes = locales.flatMap((locale) => utilityRoutes.map((route) => `/${locale}${route}`));

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/template-downloads/", ...utilityRoutes, ...localizedUtilityRoutes],
      },
    ],
    sitemap: "https://labelhelper.com/sitemap.xml",
  };
}
