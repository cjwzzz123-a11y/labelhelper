import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { FixPrintIssueTool } from "@/components/tools/FixPrintIssueTool";
import { pageMetadata, softwareApplicationSchema } from "@/lib/seo";

const title = "Problem Finder | Fix Shipping Label Printing Issues";
const description = "Choose the visible shipping label print problem and use the matching scale, PDF, calibration or barcode check in one page.";

export const metadata = pageMetadata({ title, description, path: "/tools" });

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#12324A]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Problem Finder", description }} />
      <JsonLd data={softwareApplicationSchema({ title, description, path: "/tools" })} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumb items={[{ name: "Problem finder", href: "/tools" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Problem finder</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Fix the print problem you can see.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            This page is only for problems after a bad print: wrong scale, wrong PDF page size, cut-off output or barcode scan risk.
          </p>
        </div>

        <div className="mt-8">
          <FixPrintIssueTool />
        </div>
      </section>
    </main>
  );
}
