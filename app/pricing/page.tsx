import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RefundBoundaryNotice } from "@/components/LegalNotice";
import { getCheckoutPlan, getCheckoutStatusMessage } from "@/lib/creem-client";
import { alternateLanguages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pricing | Shipping Label Helper",
  description: "Shipping Label Helper pricing for free label checks and local PDF tools.",
  alternates: { canonical: "/pricing", languages: alternateLanguages("/pricing") },
};

const proCheckout = getCheckoutPlan("pro_lifetime", "Pro Toolkit", "$9");
const plans = [
  { name: "Free", price: "$0", note: "For quick no-signup label-size checks.", cta: "Start free size check", href: "/#checker", status: "Always available", features: ["Size checker", "Scale calculator", "Blank template pages", "Troubleshooting guides"] },
  { name: proCheckout.name, price: proCheckout.price, note: getCheckoutStatusMessage(proCheckout.configured), cta: proCheckout.configured ? "Go to secure checkout" : "Review paid previews", href: proCheckout.configured ? proCheckout.checkoutUrl : "/tools", status: proCheckout.configured ? "Checkout ready" : "Preview only", features: ["PDF page-size preview", "Watermark-free calibration sheets", "Watermark-free test print PDFs", "Barcode quiet-zone image checker"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: "Pricing", href: "/pricing" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Simple pricing for label troubleshooting</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The core promise stays free: check the right shipping label size before printing, without signup. Paid features are the preview tools: PDF page-size preview, calibration sheets, barcode image review and test-print packs.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => (
            <section key={plan.name} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold tracking-tight">{plan.name}</h2>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-100">{plan.status}</span>
              </div>
              <p className="mt-3 text-4xl font-bold">{plan.price}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{plan.note}</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              {plan.name !== "Free" ? <div className="mt-5"><RefundBoundaryNotice compact /></div> : null}
              <Link href={plan.href} className="mt-6 inline-block rounded-full bg-[#12324A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4d70]">{plan.cta}</Link>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 id="pro-interest" className="text-2xl font-bold tracking-tight">Need paid preview tools?</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Start with the free label-size tools. Paid tools are for previewing PDF page size, calibration output, barcode image quiet zones and bundled test-print packs before you print real postage.
          </p>
          <Link href="/#checker" className="mt-5 inline-block text-sm font-semibold text-slate-950 hover:underline">Start with the free size checker</Link>
          <Link href="/tools/pdf-analyzer" className="ml-5 mt-5 inline-block text-sm font-semibold text-slate-950 hover:underline">Compare PDF label checks</Link>
          <Link href="/unlock" className="ml-5 mt-5 inline-block text-sm font-semibold text-slate-950 hover:underline">Already have a license key?</Link>
          <Link href="/privacy" className="ml-5 mt-5 inline-block text-sm font-semibold text-slate-950 hover:underline">Read the privacy policy</Link>
        </section>
      </section>
    </main>
  );
}
