import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

const contactEmail = "support@labelhelper.com";

export const metadata: Metadata = {
  title: "Privacy Policy | Shipping Label Helper",
  description: "Privacy policy for Shipping Label Helper. PDF files are processed locally in the browser and are not uploaded to our server.",
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
          <p className="mt-4 leading-7 text-slate-600">Effective date: 2026-05-13.</p>
        </div>

        <article className="mt-6 space-y-6 rounded-3xl bg-white p-6 leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Browser-local PDF processing</h2>
            <p className="mt-2">
              Shipping labels can contain names, addresses, tracking numbers, barcodes and customs information. The PDF tools in Shipping Label Helper are designed to process files locally in your browser. Your PDF files are not uploaded to our server for analysis or conversion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Information we collect</h2>
            <p className="mt-2">If you purchase Pro Toolkit, we may receive your purchase email address so we can deliver or verify a license key and help with support or refund requests.</p>
            <p className="mt-2">Payment information is processed by Creem. We do not store your full card number or payment credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Cookies and analytics</h2>
            <p className="mt-2">The codebase supports optional privacy-focused analytics through Umami environment variables and optional ads configuration. These services are only active when configured. We do not sell personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Data retention</h2>
            <p className="mt-2">Purchase and license support records may be retained as long as needed for customer support, tax, accounting, fraud prevention and legal compliance. Browser-local files remain on your device unless you choose to share them with us for support.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Your rights</h2>
            <p className="mt-2">
              You may ask to access, correct or delete personal information we hold about you by emailing{" "}
              <a className="font-semibold text-slate-950 underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              . We may retain records when required by law or legitimate business needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Contact</h2>
            <p className="mt-2">
              Privacy questions can be sent to{" "}
              <a className="font-semibold text-slate-950 underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/terms" className="text-sm font-semibold text-slate-950 hover:underline">Terms</Link>
            <Link href="/refunds" className="text-sm font-semibold text-slate-950 hover:underline">Refunds</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-950 hover:underline">Contact</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
