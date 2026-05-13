import Link from "next/link";

export interface RelatedLink {
  href: string;
  title: string;
  description?: string;
}

export function RelatedLinks({ links, heading = "Related guides" }: { links: RelatedLink[]; heading?: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">{heading}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50">
            <h3 className="font-semibold text-slate-950">{link.title}</h3>
            {link.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
