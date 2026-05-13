import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { BarcodeQuietZoneChecker } from "@/components/tools/BarcodeQuietZoneChecker";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Barcode Quiet Zone Checker";
const description = "Check whether a shipping-label barcode has enough blank space on both sides for reliable scanning.";

export const metadata = pageMetadata({ title, description, path: "/tools/barcode-quiet-zone-checker" });

export default function BarcodeQuietZoneCheckerPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/barcode-quiet-zone-checker" })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "Barcode Quiet Zone Checker", href: "/tools/barcode-quiet-zone-checker" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Prevent barcode scan failures</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">Barcode Quiet Zone Checker</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">Measure the whitespace around a printed barcode image to catch labels that may scan poorly after cropping, shrinking or Fit to Page printing.</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <MiniStep number="1" title="Crop" text="Use a clear PNG/JPEG around the barcode." />
                <MiniStep number="2" title="Check" text="The browser estimates blank space locally." />
                <MiniStep number="3" title="Fix" text="Reprint at 100% with more quiet zone." />
              </div>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Best input</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">Use a cropped image, not a full-page PDF</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">This checker analyzes PNG/JPEG images with local canvas code. For full label PDFs, use the PDF Analyzer page first or export a screenshot of the barcode area.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <BarcodeQuietZoneChecker />
        <div className="mt-8"><Paywall feature="saved quiet-zone reports and advanced barcode checks" /></div>
      </section>
    </main>
  );
}

function MiniStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-800">{number}</div>
      <p className="mt-3 font-bold text-[#12324A]">{title}</p>
      <p className="mt-1 leading-5 text-slate-600">{text}</p>
    </div>
  );
}
