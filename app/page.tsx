import Link from "next/link";
import { HomeFaq } from "@/components/HomeFaq";
import { JsonLd } from "@/components/JsonLd";
import { ShippingResponsibilityNotice } from "@/components/LegalNotice";
import { SizeChecker } from "@/components/tools/SizeChecker";
import { lookup } from "@/lib/rules-engine";
import { organizationSchema, pageMetadata, softwareApplicationSchema, websiteSchema } from "@/lib/seo";

const title = "Shipping Label Size Checker | Print 4×6 Labels Correctly";
const description = "Check shipping label size, print scale, paper, carrier and printer settings for Etsy, Shopify, eBay, USPS, UPS, FedEx and DHL labels.";

export const metadata = pageMetadata({ title, description, path: "/" });

const decisionPaths = [
  { title: "I’m setting up a label", text: "Unlock the Pro checker for marketplace, carrier, paper and printer setup.", href: "/pricing", cta: "Unlock setup check" },
  { title: "My print already failed", text: "Read the troubleshooting guide first, then unlock the matching tool.", href: "/shipping-label-printing-too-small", cta: "Read the guide" },
  { title: "I want a safe test", text: "Learn the test flow, then unlock template, calibration or test-pack downloads.", href: "/test-print", cta: "Open Test Print" },
];

export default function Home() {
  const defaultRule = lookup("etsy", "usps", "4x6", "thermal");

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/" })} />
      <section id="checker" className="relative scroll-mt-28 overflow-hidden px-6 py-12 sm:py-16">
        <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Pro shipping label tools</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#12324A] sm:text-6xl">Print the right shipping label size before you buy postage.</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Pick your marketplace, carrier, paper and printer. Get a clear recommended label size, scale, orientation and print-dialog checklist before printing paid labels.
              </p>
              <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Choose your path</p>
                <div className="mt-4 grid gap-3">
                  {decisionPaths.map((path) => (
                    <Link key={path.href} href={path.href} className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                      <p className="font-black text-[#12324A]">{path.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{path.text}</p>
                      <p className="mt-2 text-sm font-bold text-sky-800">{path.cta}</p>
                    </Link>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Guides stay free. Interactive checks and generated PDFs unlock with Pro Toolkit.</p>
            </div>
            <div className="rounded-[2rem] bg-white/80 p-3 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 backdrop-blur">
              <SizeChecker initialRule={defaultRule} variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Tool workflow</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#12324A]">Unlock only the workflow you need.</h2>
            <p className="mt-3 leading-7 text-slate-600">Most print problems come from the same setup chain: paper size, print scale, orientation, margins, then barcode whitespace. Read the free guide first, then use the paid tool that matches the problem.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <NextStep href="/test-print" title="Setup looks right" text="Print a blank template before paid postage." />
            <NextStep href="/tools/scale-calculator" title="Printed size is wrong" text="Calculate the corrected print percentage." />
            <NextStep href="/tools/pdf-analyzer" title="PDF size looks odd" text="Read page boxes before changing printer settings." />
            <NextStep href="/shipping-label-barcode-not-scanning" title="Barcode still fails" text="Review quiet zone, density, glare and damage." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <ShippingResponsibilityNotice />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <HomeFaq />
      </section>
    </main>
  );
}

function NextStep({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-[#f7fbff] p-5 shadow-sm ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
      <span className="block font-black text-[#12324A]">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-slate-600">{text}</span>
    </Link>
  );
}
