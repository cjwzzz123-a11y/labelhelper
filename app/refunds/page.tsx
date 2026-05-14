import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

const contactEmail = "support@labelhelper.com";

export const metadata: Metadata = {
  title: "Refund Policy | Shipping Label Helper",
  description: "14-day refund policy for Shipping Label Helper Pro Toolkit purchases made through Creem.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Refunds", href: "/refunds" }]} />
        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Refund policy</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#12324A]">14-day refund policy</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Effective date: 2026-05-13. Shipping Label Helper Pro Toolkit is a digital product delivered by license key. Refund eligibility depends on whether the license key has already been used to unlock paid features.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <PolicySection title="Refund window">
            <p>You may request a refund within 14 days from the purchase date.</p>
            <p>A full refund is available before the activation code or license key has been used.</p>
          </PolicySection>

          <PolicySection title="When a purchase is not refundable">
            <p>Once a license key has been entered on the unlock page and paid Pro Toolkit features have been unlocked, the digital product is considered delivered and is not refundable.</p>
            <p>Refunds are also not available for purchases outside the 14-day window, purchases made with an email address you cannot verify, or issues caused by unsupported files, printer settings, paper, carrier rules, or marketplace changes outside our control.</p>
          </PolicySection>

          <PolicySection title="How to request a refund">
            <p>
              Email{" "}
              <a className="font-bold text-[#12324A] underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>{" "}
              with the subject line <span className="font-semibold">[Refund Request] Order No. XXX</span>.
            </p>
            <p>Include the purchase email address and Creem order number. We process eligible refund requests within 5-10 business days.</p>
          </PolicySection>

          <PolicySection title="Refund method">
            <p>Approved refunds are returned to the original Creem payment source. Your bank or card issuer may need additional time to post the refund after Creem processes it.</p>
          </PolicySection>

          <PolicySection title="Before shipping">
            <p>Always test-scan barcodes, verify addresses and customs information, and confirm print size before applying a label to a package. Do not ship with an output that looks wrong.</p>
          </PolicySection>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/terms" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Terms</Link>
          <Link href="/privacy" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Privacy</Link>
          <Link href="/contact" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Contact</Link>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <h2 className="text-2xl font-black tracking-tight text-[#12324A]">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-slate-600">{children}</div>
    </section>
  );
}
