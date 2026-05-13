import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ShippingResponsibilityNotice } from "@/components/LegalNotice";
import { REFERENCE_DOWNLOADS } from "@/data/label-templates";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";
import { InternationalLabelSplitter } from "./Splitter";

const title = "Verified eBay USPS International Label Splitter";
const description = "Extract the verified eBay USPS PS Form 2976 label/customs block from a Letter PDF into a 4x6 PDF in your browser.";

export const metadata = pageMetadata({ title, description, path: "/tools/international-label-splitter" });

const faq = [
  ["Does my PDF upload to your server?", "No. The splitter runs in your browser with pdf-lib. License verification may make a separate paid-access request, but PDF contents are not uploaded by this tool."],
  ["What layout is verified right now?", "Only the real eBay / USPS Letter PS Form 2976 sample from the data bundle is verified. It outputs one combined label/customs block, not two separate PDFs."],
  ["Does it support Etsy, Royal Mail, Australia Post or Canada Post?", "Not as splitter templates yet. The project includes reference downloads, but those are not claimed as working splitter templates until real PDFs are measured."],
  ["Is the output always 4x6?", "Default output is 4x6 portrait. Other output-size toggles exist, but the verified measurement is for the bundled 4x6 workflow."],
  ["Will it preserve vector quality?", "The export uses pdf-lib page embedding rather than screenshots, so the tool does not intentionally rasterize the PDF."],
  ["Can free users use it?", "Free users can try the verified sample with a watermark. Uploaded-file clean exports are part of Pro Toolkit."],
  ["Does it verify barcode scan quality?", "No. Barcode scanning verification is not implemented yet. You must test-scan the printed output before shipping."],
  ["What if my marketplace layout is different?", "Do not assume it is supported. A new template needs a real sample PDF and measured coordinates before it is added."],
];

export default function InternationalLabelSplitterPage() {
  const localDownloads = REFERENCE_DOWNLOADS.filter((item) => item.localFilename);

  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools/international-label-splitter" })} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, answer]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: answer } })) }} />
      <section className="relative overflow-hidden px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumb items={[{ name: "Tools", href: "/tools" }, { name: "International Label Splitter", href: "/tools/international-label-splitter" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Pro Toolkit · verified template only</p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Extract a verified eBay USPS international label block to 4×6</h1>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Current production claim: one real eBay / USPS Letter PDF with a measured PS Form 2976 combined postage + CN22 block. Other carrier PDFs are reference downloads until real samples are measured.
              </p>
              <div className="mt-6 rounded-3xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                <strong>Browser-local PDF processing.</strong> The tool reformats a label PDF you already purchased. It does not create postage or guarantee carrier/customs acceptance.
              </div>
              <ShippingResponsibilityNotice className="mt-5" />
            </div>
            <InternationalLabelSplitter />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-14">
        <SeoSection title="What does this tool do?">
          <p>It extracts the measured PS Form 2976 combined postage and customs block from the verified eBay / USPS Letter sample and fits it onto a 4×6 PDF.</p>
          <p>It is intentionally narrower than the original spec until more real marketplace PDFs are measured. This avoids claiming support for layouts we have not verified.</p>
        </SeoSection>
        <SeoSection title="Why is this narrower than a full international label splitter?">
          <p>The data bundle contains one real measured splitter template. It also includes useful customs-form and carrier specification PDFs, but those references are not working templates by themselves.</p>
          <p>New splitter support should be added only after a real PDF is collected, coordinates are measured, and the output is visually checked.</p>
        </SeoSection>
        <SeoSection title="Reference downloads from the data bundle">
          <div className="grid gap-3 md:grid-cols-2">
            {localDownloads.map((item) => (
              <Link key={item.id} href={`/samples/${item.localFilename}`} className="rounded-2xl bg-[#f7fbff] p-4 text-sm ring-1 ring-sky-100 hover:bg-sky-50">
                <span className="block font-black text-[#12324A]">{item.title}</span>
                <span className="mt-1 block leading-6 text-slate-600">{item.description}</span>
                <span className="mt-2 block font-bold text-sky-800">Download PDF</span>
              </Link>
            ))}
          </div>
        </SeoSection>
        <SeoSection title="How is this different from screenshot + crop?">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead><tr className="border-b"><th className="py-2">Workflow</th><th>Quality</th><th>Repeat work</th><th>Responsibility</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="py-2 font-bold">Screenshot + crop</td><td>Can rasterize or blur</td><td>Manual every order</td><td>User must verify</td></tr>
                <tr><td className="py-2 font-bold">Verified template extraction</td><td>PDF page embedding</td><td>Repeatable for the measured layout</td><td>User must verify</td></tr>
              </tbody>
            </table>
          </div>
        </SeoSection>
        <SeoSection title="FAQ">
          <div className="grid gap-4 md:grid-cols-2">
            {faq.map(([question, answer]) => (
              <article key={question} className="rounded-3xl bg-white p-5 ring-1 ring-sky-100">
                <h3 className="font-black">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </SeoSection>
        <div className="flex flex-wrap gap-3">
          <Link href="/guides" className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">Open guides and downloads</Link>
          <Link href="/tools/size-checker" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-white">Check label size</Link>
          <Link href="/tools/calibration-sheet" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-white">Print calibration sheet</Link>
        </div>
      </section>
    </main>
  );
}

function SeoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-slate-600">{children}</div>
    </section>
  );
}
