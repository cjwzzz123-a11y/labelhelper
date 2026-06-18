import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LicenseStatusPanel } from "@/components/LicenseStatusPanel";
import { UnlockLicenseForm } from "@/components/UnlockLicenseForm";

export const metadata: Metadata = {
  title: "Unlock Pro Tools",
  description: "Enter a Shipping Label Helper license key to unlock paid tools on this browser.",
  alternates: { canonical: "/unlock" },
  robots: { index: false, follow: false },
};

export default function UnlockPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Breadcrumb items={[{ name: "Unlock", href: "/unlock" }]} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
            <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">License access</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Unlock Pro Tools</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">Enter the key from your purchase email to unlock watermark-free reports and downloads on this browser.</p>
            <UnlockLicenseForm />
          </div>

          <aside className="space-y-6">
            <LicenseStatusPanel />
            <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Need a key?</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Tools unlock after payment</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Guides, SEO pages and reference material stay free. Interactive tools and generated downloads require Pro Toolkit.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/guides" className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">Read free guides</Link>
                <Link href="/pricing" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-white">Compare access</Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
