import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { REFERENCE_DOWNLOADS } from "@/data/label-templates";
import { seoPages } from "@/data/seo-pages";
import { alternateLanguages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Shipping Label Guides | Platforms, Carriers and Fixes",
  description: "Guides for Etsy, Shopify, eBay, Amazon FBA, USPS, UPS, FedEx and DHL label sizes, plus common shipping label print fixes.",
  alternates: { canonical: "/guides", languages: alternateLanguages("/guides") },
};

const symptoms = [
  { title: "Label prints too small", text: "Fix Fit to Page, browser margins and PDF viewer scaling.", href: "/shipping-label-printing-too-small" },
  { title: "Label is cut off", text: "Check paper size, orientation, margins and roll alignment.", href: "/shipping-label-cut-off-when-printing" },
  { title: "Barcode won’t scan", text: "Review scale, blur, tape glare and barcode quiet-zone whitespace.", href: "/shipping-label-barcode-not-scanning" },
  { title: "Label is not centered", text: "Fix off-center thermal rolls, sheet margins and printer alignment.", href: "/shipping-label-not-centered" },
];

const groups = [
  { title: "Platform guides", text: "Choose the safest label setup for marketplaces like Etsy, Shopify, eBay and FBA.", kinds: ["platform"] },
  { title: "Carrier guides", text: "Match USPS, UPS, FedEx and DHL label formats before printing postage.", kinds: ["carrier"] },
  { title: "Troubleshooting guides", text: "Start from the print symptom and fix the most common setting mistakes first.", kinds: ["troubleshooter"] },
  { title: "Templates", text: "Download blank scale/alignment PDFs and print them at 100% before paid labels.", kinds: ["template"] },
] as const;

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: "Guides", href: "/guides" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Guides hub</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Start with the print problem</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Find the right label size for your selling platform or carrier, then fix common print problems like shrinking, cut-off edges and barcode scan failures.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Start with your symptom</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {symptoms.map((symptom) => (
              <Link key={symptom.href} href={symptom.href} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                <h2 className="font-black tracking-tight">{symptom.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{symptom.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">International label and customs downloads</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Reference PDFs from the splitter data bundle</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These downloads are for reference, testing and template measurement. Only the eBay USPS sample is currently a verified splitter template; the others are not claimed as supported splitter layouts.
            </p>
          </div>
          <div className="mt-5">
            <DownloadResponsibilityNotice compact />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REFERENCE_DOWNLOADS.map((item) => {
              const href = item.localFilename ? `/samples/${item.localFilename}` : item.sourceUrl;
              return (
                <Link key={item.id} href={href} className="rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{item.status.replace("-", " ")}</p>
                  <h3 className="mt-2 font-black text-[#12324A]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-3 text-sm font-bold text-sky-800">{item.localFilename ? "Download local PDF" : "Open source link"}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-10 space-y-10">
          {groups.map((group) => {
            const guides = seoPages.filter((page) => group.kinds.includes(page.kind as never));

            return (
              <section key={group.title}>
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-black tracking-tight">{group.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{group.text}</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => (
                    <Link key={guide.slug} href={`/${guide.slug}`} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:ring-sky-200 hover:shadow-md">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{guide.kind}</p>
                      <h3 className="mt-2 font-black text-[#12324A]">{guide.h1}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
