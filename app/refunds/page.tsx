import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Refund Policy | Shipping Label Helper",
  description: "Refund policy for Shipping Label Helper Pro Toolkit and paid label troubleshooting tools.",
};

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Breadcrumb items={[{ name: "Refunds", href: "/refunds" }]} />
        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Refund policy</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#12324A]">14-day refund, clear responsibility boundary</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            If you bought Pro Toolkit or another paid Shipping Label Helper feature and it did not work for you, email refund@shippinglabelhelper.com within 14 days of purchase. We will refund the purchase price first and keep the process simple.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <PolicySection title="14-day no-questions refund">
            <p>Request a refund within 14 days from the same email used to purchase. Include the purchase receipt or license key. Refunds are returned to the original payment method through the payment processor.</p>
          </PolicySection>
          <PolicySection title="Tool failure goodwill review">
            <p>If a tool output was incorrect and you used it in good faith, contact refund@shippinglabelhelper.com with the license key, the failed label, carrier notice or fee receipt, and a short description. We review these cases within 5 business days.</p>
            <p>This goodwill review does not create coverage for shipping costs, returned packages, customs holds, penalties, marketplace sanctions, lost sales, or other consequential losses.</p>
          </PolicySection>
          <PolicySection title="Your responsibility before shipping">
            <p>Before applying any label to a package, test-scan the barcode, verify all addresses and customs declarations, and confirm the printed size. If the output looks wrong, do not ship with it.</p>
          </PolicySection>
          <PolicySection title="Statutory rights">
            <p>This policy does not limit non-waivable consumer rights that apply in your jurisdiction. If local law gives you stronger rights, those rights apply.</p>
          </PolicySection>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/terms" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Terms of Service</Link>
          <Link href="/privacy" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#12324A] hover:bg-white">Privacy Policy</Link>
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
