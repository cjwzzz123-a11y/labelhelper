import Link from "next/link";

const footerLinks = [
  { href: "/refunds", label: "Refund" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-sky-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 text-sm text-slate-600 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-3xl space-y-3 leading-6">
          <p>Shipping Label Helper helps sellers check size, scale and print setup before paid postage. It does not provide postage or carrier account services. Always verify final labels with your carrier or selling platform.</p>
          <p className="text-xs leading-5 text-slate-500">
            Shipping Label Helper is an independent tool. We are not affiliated with, endorsed by, or sponsored by USPS, UPS, FedEx, DHL, Royal Mail, Canada Post, Australia Post, Japan Post, eBay, Etsy, Shopify, Amazon, or any other carrier or platform mentioned on this site. All trademarks belong to their respective owners.
          </p>
        </div>
        <div className="space-y-3 md:text-right">
          <nav className="flex flex-wrap gap-3 font-semibold text-[#12324A] md:justify-end" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs font-semibold text-slate-500">Payments secured by Creem</p>
        </div>
      </div>
    </footer>
  );
}
