import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { TemplateDownloadButton } from "@/components/TemplateDownloadButton";
import { alternateLanguages } from "@/lib/i18n";
import { templateSpecs } from "@/lib/template-pdfs";

const title = "Test Print Center | Shipping Label Helper";
const description = "Use free test-print guides, then unlock paid template, calibration and test-print PDF generation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/test-print", languages: alternateLanguages("/test-print") },
};

const sections = [
  {
    title: "Blank templates",
    text: "Download a 4×6, A4 or Letter blank PDF and print at 100% / Actual Size to confirm paper size and scale.",
    href: "/templates",
    cta: "Open template guides",
  },
  {
    title: "Calibration sheet",
    text: "Print a ruler and alignment sheet to check scale, margins and center position before paid postage.",
    href: "/tools/calibration-sheet",
    cta: "Paid · Generate sheet",
  },
  {
    title: "Test print pack",
    text: "Generate paid test PDFs for thermal and sheet printers when one blank template is not enough.",
    href: "/tools/test-print-pack",
    cta: "Paid · Build pack",
  },
];

export default function TestPrintPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description }} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: "Test Print", href: "/test-print" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Test before postage</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Print a safe test before the real carrier label.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">Guides explain the test flow for free. Template downloads, calibration generation and test print packs unlock with Pro Toolkit.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Use this order</p>
            <div className="mt-4 grid gap-3">
              <MiniStep title="1 · Match the paper" text="Pick the size loaded in the printer: 4×6, A4 or Letter." />
              <MiniStep title="2 · Print at 100%" text="Disable Fit to Page, browser headers and driver scaling." />
              <MiniStep title="3 · Measure the output" text="Fix scale or alignment before printing live postage." />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:ring-sky-200 hover:shadow-md">
              <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
              <p className="mt-5 text-sm font-bold text-sky-800">{section.cta}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight">Blank PDF downloads</h2>
          <p className="mt-3 leading-7 text-slate-600">These PDFs contain borders and measurement guides only. They do not include carrier barcodes or postage.</p>
          <div className="mt-4">
            <DownloadResponsibilityNotice compact />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {templateSpecs.map((template) => (
              <TemplateDownloadButton key={template.slug} slug={template.slug} className="rounded-2xl border border-sky-100 bg-[#f7fbff] p-4 text-left font-bold text-[#12324A] hover:bg-sky-50">
                {template.label} blank PDF · {template.widthMm} × {template.heightMm} mm
              </TemplateDownloadButton>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
      <p className="font-bold text-[#12324A]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
