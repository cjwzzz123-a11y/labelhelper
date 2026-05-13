import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "About | Shipping Label Helper",
  description: "About Shipping Label Helper, a static-first tool site for ecommerce sellers fixing shipping label size, scale and print alignment problems.",
  alternates: { canonical: "/about" },
};

const links = [
  { href: "/tools", title: "Open the tools hub" },
  { href: "/guides", title: "Read label guides" },
  { href: "/templates", title: "Use blank templates" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "About", href: "/about" }]} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">About</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">About Shipping Label Helper</h1>
        </div>

        <article className="mt-6 space-y-5 rounded-3xl bg-white p-6 leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p>Shipping Label Helper helps small ecommerce sellers print labels at the correct size before they waste labels, tape, postage or time.</p>
          <p>The product is static-first: guides are indexable, basic tools run in the browser, and paid PDF tools are designed so seller files stay local.</p>
          <p>It focuses on practical label setup: paper size, 100% scale, orientation, quiet zones, calibration and common platform or carrier defaults.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50">
                {link.title}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
