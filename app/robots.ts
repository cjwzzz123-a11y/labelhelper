import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/template-downloads/"],
      },
    ],
    sitemap: "https://labelhelper.com/sitemap.xml",
  };
}
