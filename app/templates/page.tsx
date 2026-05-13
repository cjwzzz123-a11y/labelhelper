import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { alternateLanguages } from "@/lib/i18n";
import { templateSpecs } from "@/lib/template-pdfs";

export const metadata: Metadata = {
  title: "Shipping Label Templates | 4×6, A4 and Letter",
  description: "Download blank 4×6, A4 and Letter shipping label scale/alignment PDFs and print at 100% scale to verify printer alignment.",
  alternates: { canonical: "/templates", languages: alternateLanguages("/templates") },
};

const helperLinks = [
  { href: "/#checker", title: "Check the right label size" },
  { href: "/tools/scale-calculator", title: "Calculate print scale" },
  { href: "/tools/calibration-sheet", title: "Generate a calibration sheet" },
  { href: "/shipping-label-not-centered", title: "Fix off-center labels" },
  { href: "/pricing", title: "Compare Pro PDF tools" },
];

const flow = [
  ["1 · Download blank PDF", "Start with the paper size you actually load in the printer."],
  ["2 · Print at 100%", "Use Actual Size and turn off Fit to Page, headers and driver scaling."],
  ["3 · Measure then fix", "If the border or ruler is wrong, use scale or calibration tools before postage."],
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: "Templates", href: "/templates" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Template hub</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Actual Size print templates</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Download a blank scale/alignment PDF, print it at 100%, then measure before printing paid postage. These templates do not include carrier barcodes.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Best flow</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {flow.map(([title, text]) => <MiniStep key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {templateSpecs.map((template) => (
            <article key={template.slug} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 transition hover:ring-sky-200 hover:shadow-md">
              <h2 className="text-2xl font-black tracking-tight">{template.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{template.widthIn} × {template.heightIn} in / {template.widthMm} × {template.heightMm} mm</p>
              <p className="mt-3 rounded-2xl bg-[#f7fbff] p-3 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">Border + 100% scale check. No carrier barcode.</p>
              <div className="mt-4">
                <DownloadResponsibilityNotice compact />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/api/templates/${template.slug}`} className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">Download blank PDF</Link>
                <Link href={`/${template.slug}-shipping-label-template`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-sky-50">Open setup guide</Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight">Print templates at Actual Size</h2>
          <p className="mt-3 leading-7 text-slate-600">Disable Fit to Page, browser headers and driver scaling. If the template measures wrong, fix the scale before printing carrier labels.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {helperLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                {link.title}
              </Link>
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
