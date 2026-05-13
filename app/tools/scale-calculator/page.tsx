import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ScaleCalculator } from "@/components/tools/ScaleCalculator";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Print Shipping Label Scale Calculator";
const description = "Calculate the print scale percentage needed when a shipping label prints too small or too large.";

export const metadata = pageMetadata({ title, description, path: "/tools/scale-calculator" });

export default function ScaleCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/scale-calculator" })} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="mx-auto max-w-5xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "Scale Calculator", href: "/tools/scale-calculator" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Fix tiny or oversized labels</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-5xl">Print Shipping Label Scale Calculator</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">Measure the same edge on the printed label and compare it with the target size. The calculator gives the print scale to try in your printer dialog.</p>
              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                <MiniStep number="1" title="Measure" text="Use the same edge, usually the 4-inch width." />
                <MiniStep number="2" title="Calculate" text="Enter printed size and target size." />
                <MiniStep number="3" title="Reprint" text="Set scale, then run a blank test." />
              </div>
            </div>
            <ScaleCalculator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Example</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">A 4-inch label printed as 3.8 inches</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Enter 3.8 as the printed size and 4 as the target. Try about 105.3% scale, then confirm with a blank template before using paid postage.</p>
            <Link href="/templates" className="mt-5 inline-block rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">Open blank templates</Link>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Avoid this</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">Do not measure different sides</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">If you measure the 4-inch width but target the 6-inch height, the percentage will be wrong. Use width-to-width or height-to-height.</p>
          </div>
        </div>
        <div className="mt-8"><RelatedLinks links={[{ href: "/shipping-label-printing-too-small", title: "Label printing too small" }, { href: "/fit-to-page-vs-actual-size-shipping-label", title: "Fit to Page vs Actual Size" }, { href: "/#checker", title: "Size Checker" }]} /></div>
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
