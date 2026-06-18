import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/template-downloads/", "/thanks", "/unlock"],
      },
    ],
    sitemap: "https://labelhelper.com/sitemap.xml",
  };
}
