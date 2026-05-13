import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Use | Shipping Label Helper",
  description: "Terms of use for Shipping Label Helper templates, guides and browser-based shipping label troubleshooting tools.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Terms", href: "/terms" }]} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Terms</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Terms of Use</h1>
        </div>

        <article className="mt-6 space-y-6 rounded-3xl bg-white p-6 leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Educational tools</h2>
            <p className="mt-2">Shipping Label Helper provides educational guides, templates and troubleshooting tools. It does not buy postage, create carrier labels or guarantee carrier acceptance.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Your responsibility</h2>
            <p className="mt-2">Always verify final label output with your selling platform, carrier documentation and printer settings before shipping customer orders.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Paid tools</h2>
            <p className="mt-2">Paid-tool licensing is scaffolded and becomes active only after checkout, database and email services are configured.</p>
          </section>
          <Link href="/privacy" className="inline-block text-sm font-semibold text-slate-950 hover:underline">Read the privacy policy</Link>
        </article>
      </section>
    </main>
  );
}
