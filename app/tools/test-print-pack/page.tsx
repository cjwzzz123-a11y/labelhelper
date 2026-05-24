import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { TestPrintPack } from "@/components/tools/TestPrintPack";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Shipping Label Test Print Pack";
const description = "VIP tool: unlock a local ZIP with 30+ shipping-label test PDFs for printer alignment, barcode quiet zones and 100% scale checks.";

export const metadata = pageMetadata({ title, description, path: "/tools/test-print-pack" });

const steps = [
  ["Pick baseline", "Start with a blank template or preview PDF."],
  ["Print at 100%", "Keep Fit to Page disabled."],
  ["Fix before postage", "Use scale and quiet-zone tools if the test fails."],
];

export default function TestPrintPackPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/test-print-pack" })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "Test Print Pack", href: "/tools/test-print-pack" }]} />
          <p className="mt-8 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Paid preview</p>
          <div className="relative mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">Shipping Label Test Print Pack</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Unlock Pro Toolkit to generate single test PDFs or the bundled ZIP for the full printer test set.</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-sky-100 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Safe test flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Preview first, print at actual size, then fix settings before buying or reprinting postage.</p>
            </div>
          </div>
          <div className="relative mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {steps.map(([stepTitle, text], index) => <MiniStep key={stepTitle} number={`${index + 1}`} title={stepTitle} text={text} />)}
          </div>
          <div className="relative mt-8"><TestPrintPack /></div>
          <div className="relative mt-8"><Paywall feature="test print PDFs and bundled pack downloads" /></div>
        </div>
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
