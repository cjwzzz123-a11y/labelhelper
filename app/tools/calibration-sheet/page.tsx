import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Paywall } from "@/components/Paywall";
import { CalibrationSheetGenerator } from "@/components/tools/CalibrationSheetGenerator";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Calibration Sheet Generator";
const description = "Generate a printable shipping-label calibration sheet with rulers, center marks and quiet-zone references.";

export const metadata = pageMetadata({ title, description, path: "/tools/calibration-sheet" });

export default function CalibrationSheetPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/calibration-sheet" })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "Calibration Sheet", href: "/tools/calibration-sheet" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Print a blank test first</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">Calibration Sheet Generator</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">Generate a watermarked preview PDF with corner guides, a 100 mm reference line, center crosshair and quiet-zone reference. Use it before printing real postage.</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <MiniStep number="1" title="Choose setup" text="Pick paper and printer type." />
                <MiniStep number="2" title="Print at 100%" text="Disable Fit to Page in the dialog." />
                <MiniStep number="3" title="Measure" text="Check the 100 mm line and center marks." />
              </div>
            </div>
            <CalibrationSheetGenerator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">What to check</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">A good test print should match the ruler</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Measure the 100 mm reference line. If it is short or long, fix print scale before printing a carrier barcode. If the center crosshair is shifted, check paper size, margins and roll alignment.</p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Preview boundary</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">Free downloads are watermarked</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">The current generator creates browser-local watermarked previews. Watermark-free downloads and saved printer profiles are part of the paid flow once checkout and license delivery are connected.</p>
          </div>
        </div>
        <div className="mt-8"><Paywall feature="watermark-free calibration sheets and saved printer profiles" /></div>
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
