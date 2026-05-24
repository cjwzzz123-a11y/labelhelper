import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IssueLicenseLookup } from "@/components/IssueLicenseLookup";

export const metadata: Metadata = {
  title: "Thanks | Shipping Label Helper",
  description: "Shipping Label Helper payment return page for checking license delivery and unlocking paid tools.",
  alternates: { canonical: "/thanks" },
};

export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Breadcrumb items={[{ name: "Thanks", href: "/thanks" }]} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
            <p className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900 ring-1 ring-emerald-200">Payment return</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Thanks for trying Shipping Label Helper</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">When checkout is connected, this page will confirm your order and send the license key to your email. Guides and reference pages remain available while paid tool access waits for a license.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/unlock" className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">Enter license key</Link>
              <Link href="/tools" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold hover:bg-sky-50">Back to tools</Link>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">What happens next</p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li><strong>1.</strong> Checkout sends you back here.</li>
                <li><strong>2.</strong> The order is verified before a key is issued.</li>
                <li><strong>3.</strong> You paste the key on the unlock page to remove watermarks.</li>
              </ol>
            </section>
            <IssueLicenseLookup />
          </aside>
        </div>
      </section>
    </main>
  );
}
