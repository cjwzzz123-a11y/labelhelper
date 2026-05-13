import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { PdfAnalyzer } from "@/components/tools/PdfAnalyzer";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Label PDF Analyzer";
const description = "Browser-local shipping label PDF analyzer preview for page size and scale estimates, with margin and barcode checks marked for manual review.";

export const metadata = pageMetadata({ title, description, path: "/tools/pdf-analyzer" });

export default function PdfAnalyzerPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/pdf-analyzer" })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "PDF Analyzer", href: "/tools/pdf-analyzer" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Local PDF preview</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">Label PDF Analyzer</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">Preview a local-first PDF diagnostic summary for page size and print setup. It reads the file in your browser, estimates scale, and clearly marks checks that still need manual review.</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <TrustNote title="Read page size" text="Detect first-page dimensions locally." />
                <TrustNote title="Estimate scale" text="Compare against common label sizes." />
                <TrustNote title="Review next" text="Use image checker for barcode quiet zones." />
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Current boundary</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">This is a page-size preview, not full barcode detection</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">The analyzer reads PDF page boxes and creates a diagnostic summary. Rendered ink bounds, barcode detection and quiet-zone measurement still require manual review or the barcode image checker.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <PdfAnalyzer />
        <div className="mt-8"><Paywall feature="the full PDF analyzer" /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#checker" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">Back to size checker</Link>
          <Link href="/tools/barcode-quiet-zone-checker" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">Check barcode quiet zone</Link>
          <Link href="/privacy" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white">Privacy policy</Link>
        </div>
      </section>
    </main>
  );
}

function TrustNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
      <h2 className="text-sm font-bold text-[#12324A]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
