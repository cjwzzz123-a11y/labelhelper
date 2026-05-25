import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { absoluteUrl } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumb({ items, homeLabel = "Home", homeHref = "/" }: { items: BreadcrumbItem[]; homeLabel?: string; homeHref?: string }) {
  const allItems = [{ name: homeLabel, href: homeHref }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
      <JsonLd data={schema} />
      {allItems.map((item, index) => (
        <span key={item.href}>
          {index > 0 ? <span className="mx-2">/</span> : null}
          {index === allItems.length - 1 ? <span>{item.name}</span> : <Link href={item.href} className="hover:text-slate-950">{item.name}</Link>}
        </span>
      ))}
    </nav>
  );
}
