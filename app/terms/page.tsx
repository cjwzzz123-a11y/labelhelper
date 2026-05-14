import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

const contactEmail = "support@labelhelper.com";

export const metadata: Metadata = {
  title: "Terms of Service | Shipping Label Helper",
  description: "Terms of Service for Shipping Label Helper browser-based shipping label tools and Pro Toolkit digital license.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Terms", href: "/terms" }]} />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Terms</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 leading-7 text-slate-600">Effective date: 2026-05-13.</p>
        </div>

        <article className="mt-6 space-y-6 rounded-3xl bg-white p-6 leading-7 text-slate-600 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Product nature</h2>
            <p className="mt-2">Shipping Label Helper provides browser-based shipping label troubleshooting tools, templates, guides and a paid Pro Toolkit license. Pro Toolkit is a digital product delivered by license key or activation code and can take effect immediately after unlock.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">License scope</h2>
            <p className="mt-2">A Pro Toolkit license is for one user. You may not resell, rent, share, publish or transfer your license key. You may not use one license as a shared team credential unless a separate plan explicitly allows it.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">User responsibilities</h2>
            <p className="mt-2">You are responsible for using the tools lawfully, verifying every output before shipping, checking barcode scanability, confirming address and customs information, and using the correct printer, paper size, scale and carrier settings.</p>
            <p className="mt-2">Do not use Shipping Label Helper to forge postage, reuse labels, remove required carrier information, misrepresent customs declarations or perform any fraudulent or unlawful activity.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">No carrier affiliation</h2>
            <p className="mt-2">Shipping Label Helper is an independent tool. It does not generate postage, connect to carrier accounts or act as an official carrier or marketplace service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Disclaimer</h2>
            <p className="mt-2">The service is provided as is and as available. We do not warrant that outputs will work with every device, printer, carrier, platform, PDF layout, customs form or label format. Carrier and marketplace rules can change without notice.</p>
            <p className="mt-2">You should keep original labels and proof of postage, and you should not ship if a generated or reformatted output looks incomplete, incorrectly sized or unreadable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Intellectual property</h2>
            <p className="mt-2">The service code, design, text, templates, rule data and documentation are owned by the operator of Shipping Label Helper or its licensors. You keep rights to your own source PDF files and shipping documents.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Availability and changes</h2>
            <p className="mt-2">We try to keep the service available, but we do not promise uninterrupted access. We may update these terms or change the service when needed. Continued use after changes means you accept the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Law and contact</h2>
            <p className="mt-2">These terms are interpreted under the laws that apply where you use the service, except where mandatory consumer protection rules require otherwise.</p>
            <p className="mt-2">
              Questions can be sent to{" "}
              <a className="font-semibold text-slate-950 underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/privacy" className="text-sm font-semibold text-slate-950 hover:underline">Privacy</Link>
            <Link href="/refunds" className="text-sm font-semibold text-slate-950 hover:underline">Refunds</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-950 hover:underline">Contact</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
