import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

const contactEmail = "cjwzzz123@gmail.com";

export const metadata: Metadata = {
  title: "Contact | Shipping Label Helper",
  description: "Contact Shipping Label Helper for refunds, license key help, technical issues and business inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Contact", href: "/contact" }]} />
        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Contact</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#12324A]">Contact Shipping Label Helper</h1>
          <p className="mt-4 leading-8 text-slate-700">
            Shipping Label Helper is operated as an independent software product for ecommerce sellers who need browser-based label sizing, template and troubleshooting tools.
          </p>
          <a className="mt-6 inline-block break-all text-2xl font-black text-[#12324A] underline sm:text-3xl" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <InfoCard title="Response time" text="We aim to respond within 48 hours on business days." />
          <InfoCard title="Operating timezone" text="GMT+8, China." />
          <InfoCard title="Refund requests" text="Include your Creem order number, purchase email and the subject line [Refund Request] Order No. XXX." />
          <InfoCard title="License key help" text="Contact us if your license key was not received, was lost, or does not unlock the expected Pro Toolkit features." />
          <InfoCard title="Technical issues" text="Describe the browser, device, printer, tool page and what you expected to happen." />
          <InfoCard title="Business inquiries" text="Use the same email for partnership, support or product questions." />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/refunds" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Refunds</Link>
          <Link href="/privacy" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Privacy</Link>
          <Link href="/terms" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Terms</Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
      <h2 className="text-xl font-black tracking-tight text-[#12324A]">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </section>
  );
}
