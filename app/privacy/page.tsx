import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | Shipping Label Helper",
  description: "Shipping Label Helper privacy policy. PDF tools are designed to process shipping labels locally in your browser without uploading files.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Privacy", href: "/privacy" }]} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Privacy</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        </div>

        <article className="mt-6 space-y-6 rounded-3xl bg-white p-6 leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Label files</h2>
            <p className="mt-2">Shipping labels may contain names, addresses, tracking numbers and barcodes. PDF tools are designed to process label files locally in your browser, not upload them to our server for analysis.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Services</h2>
            <p className="mt-2">Free pages may include ads after AdSense is enabled. Paid checkout may use Creem, and license emails may use Resend after those services are configured.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Scope</h2>
            <p className="mt-2">Shipping Label Helper does not provide postage, carrier API access or account-based shipping services. Always verify final labels with your carrier or selling platform.</p>
          </section>
          <Link href="/terms" className="inline-block text-sm font-semibold text-slate-950 hover:underline">Read the terms of use</Link>
        </article>
      </section>
    </main>
  );
}
