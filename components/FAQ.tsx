import { JsonLd } from "./JsonLd";

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ({ items, heading = "FAQ" }: { items: FAQItem[]; heading?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <JsonLd data={schema} />
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">{heading}</h2>
      <div className="mt-6 divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.question} className="py-5 first:pt-0 last:pb-0">
            <h3 className="font-semibold text-slate-950">{item.question}</h3>
            <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
