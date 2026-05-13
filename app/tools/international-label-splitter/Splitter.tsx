"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Download, FileUp, ShieldAlert } from "lucide-react";
import { DownloadResponsibilityNotice, RefundBoundaryNotice } from "@/components/LegalNotice";
import { MemberFeatureShell, MemberLockedCallout, VipBadge } from "@/components/MembershipBadge";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { LABEL_TEMPLATES, OUTPUT_SIZES, type LabelOutputSize } from "@/data/label-templates";
import { splitLabel, type SplitResult } from "@/lib/label-splitter";

const CONSENT_KEY = "slh_splitter_legal_ack_v1";

const copy = {
  en: {
    vipTitle: "VIP clean PDF export",
    vipText: "The verified sample can be tried for free with a watermark. Uploaded files and clean downloads are Pro Toolkit features.",
    dropTitle: "Upload a PDF",
    dropText: "PDF only, up to 20 MB and 4 pages. Current verified support is the eBay / USPS Letter PS Form 2976 sample below.",
    samples: "Verified sample",
    output: "Output format",
    processing: "Splitting locally...",
    success: (seconds: string) => `Done in ${seconds}s. Review the output before printing.`,
    empty: "Try the verified sample or upload a paid-file PDF after unlocking Pro.",
    matched: "Matched verified layout",
    confidence: "Confidence",
    region: "Detected combined region",
    warnings: "Important limits",
    downloadCombined: "Download combined 4x6 PDF",
    manual: "Manual crop and additional marketplace templates are not enabled yet. New templates require real PDFs and measured coordinates.",
    paywall: "Free users can run the verified sample with a watermark. Uploaded files and clean PDFs require Pro Toolkit.",
    errorType: "Please upload a PDF file.",
    legalTitle: "Before you use this tool",
    legalBody: "This tool reformats a shipping label PDF you already purchased. It does not generate postage and cannot confirm that your printer, paper, customs declaration, or carrier acceptance is correct.",
    legalChecks: ["Test-scan the barcode before applying the label to a package.", "Verify addresses, tracking numbers and customs text are complete and readable.", "If anything looks wrong, do not ship with this output."],
    cancel: "Cancel",
    continue: "I understand, continue",
    sampleLabel: "eBay USPS verified",
  },
  zh: {
    vipTitle: "VIP 干净 PDF 导出",
    vipText: "已验证样本可免费试用但会带水印。上传真实文件和无水印下载属于 Pro Toolkit 功能。",
    dropTitle: "上传 PDF",
    dropText: "仅支持 PDF，最大 20 MB、最多 4 页。当前真实验证支持仅限下方 eBay / USPS Letter PS Form 2976 样本。",
    samples: "已验证样本",
    output: "输出格式",
    processing: "正在本地拆分...",
    success: (seconds: string) => `已在 ${seconds}s 内完成。打印前请检查输出。`,
    empty: "先试用已验证样本；解锁 Pro 后可上传付费文件 PDF。",
    matched: "匹配已验证布局",
    confidence: "置信度",
    region: "识别到的合并区域",
    warnings: "重要限制",
    downloadCombined: "下载合并 4x6 PDF",
    manual: "手动裁剪和更多平台模板尚未启用。新增模板必须基于真实 PDF 和人工测量坐标。",
    paywall: "免费用户可运行带水印的已验证样本。上传文件和干净 PDF 需要 Pro Toolkit。",
    errorType: "请上传 PDF 文件。",
    legalTitle: "使用本工具前请知悉",
    legalBody: "本工具只重新排版你已经购买的运单 PDF，不生成邮资，也无法确认你的打印机、纸张、海关申报或承运商收件规则是否正确。",
    legalChecks: ["贴到包裹前，必须测试条码能否扫出。", "核对地址、追踪号和海关文本完整可读。", "发现任何异常，请不要使用该输出寄件。"],
    cancel: "取消",
    continue: "我已知悉，继续",
    sampleLabel: "eBay USPS 已验证",
  },
};

function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function regionText(region: { x: number; y: number; w: number; h: number }) {
  return `x ${Math.round(region.x)}, y ${Math.round(region.y)}, ${Math.round(region.w)} × ${Math.round(region.h)} pt`;
}

function hasConsent() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "accepted";
}

export function InternationalLabelSplitter({ locale = defaultLocale }: { locale?: Locale }) {
  const c = locale === "zh" ? copy.zh : copy.en;
  const license = useStoredLicense();
  const [result, setResult] = useState<SplitResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(c.empty);
  const [outputSize, setOutputSize] = useState<LabelOutputSize>("4x6");
  const [activeSample, setActiveSample] = useState("");
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canDownloadClean = license.verified;
  const verifiedTemplate = LABEL_TEMPLATES[0];

  function requireConsent(action: () => void) {
    if (hasConsent()) {
      action();
      return;
    }
    setPendingAction(() => action);
  }

  function acceptConsent() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    const action = pendingAction;
    setPendingAction(null);
    action?.();
  }

  async function runSplit(input: File | ArrayBuffer, filename: string, sample = false) {
    const started = performance.now();
    setBusy(true);
    setError("");
    setActiveSample(sample ? filename : "");
    try {
      const next = await splitLabel(input, { filename, outputSize, watermark: !canDownloadClean, templateId: sample ? verifiedTemplate.id : undefined });
      setResult(next);
      setStatus(c.success(((performance.now() - started) / 1000).toFixed(1)));
    } catch (splitError) {
      setResult(null);
      setError(splitError instanceof Error ? splitError.message : "Could not split this PDF.");
    } finally {
      setBusy(false);
    }
  }

  async function runSample() {
    const response = await fetch(`/samples/${verifiedTemplate.sampleFilename}`);
    const bytes = await response.arrayBuffer();
    await runSplit(bytes, verifiedTemplate.sampleFilename, true);
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError(c.errorType);
      return;
    }
    if (!canDownloadClean) {
      setResult(null);
      setError("");
      setStatus(c.paywall);
      return;
    }
    await runSplit(file, file.name);
  }

  return (
    <MemberFeatureShell locale={locale} unlocked={license.verified} title={c.vipTitle} description={c.vipText}>
      <div className="grid gap-5">
        <div className="block rounded-3xl border border-dashed border-sky-300 bg-white p-6 text-center ring-1 ring-sky-50 transition hover:bg-sky-50">
          <FileUp className="mx-auto h-8 w-8 text-sky-700" aria-hidden="true" />
          <span className="mt-3 block text-lg font-black text-[#12324A]">{c.dropTitle}</span>
          <span className="mt-2 block text-sm leading-6 text-slate-600">{c.dropText}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(event) => void handleFile(event)}
          />
          <button type="button" onClick={() => requireConsent(() => fileInputRef.current?.click())} className="mt-4 rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">
            {c.dropTitle}
          </button>
        </div>

        {!license.verified ? <MemberLockedCallout locale={locale} text={c.paywall} /> : null}

        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">{c.samples}</p>
          <button
            type="button"
            onClick={() => requireConsent(() => void runSample())}
            className={`mt-3 rounded-full px-4 py-2 text-sm font-bold ring-1 ${activeSample === verifiedTemplate.sampleFilename ? "bg-[#12324A] text-white ring-[#12324A]" : "bg-white text-[#12324A] ring-sky-100 hover:bg-sky-50"}`}
          >
            {c.sampleLabel}
          </button>
        </div>

        <fieldset className="rounded-3xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
          <legend className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">{c.output}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {(Object.keys(OUTPUT_SIZES) as LabelOutputSize[]).map((size) => (
              <label key={size} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-[#12324A] ring-1 ring-sky-100">
                <input type="radio" name="split-output-size" checked={outputSize === size} onChange={() => setOutputSize(size)} className="accent-slate-950" />
                {OUTPUT_SIZES[size].label}
              </label>
            ))}
          </div>
        </fieldset>

        <DownloadResponsibilityNotice locale={locale} />

        {busy ? <p className="rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-900">{c.processing}</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

        {result ? (
          <div className="grid gap-5">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">{c.matched}</p>
                  <h2 className="mt-2 text-2xl font-black">{result.platform}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{status}</p>
                </div>
                <VipBadge locale={locale} unlocked={license.verified} />
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-3"><dt className="text-xs text-slate-300">{c.confidence}</dt><dd className="font-bold">{result.confidence}</dd></div>
                <div className="rounded-2xl bg-white/10 p-3"><dt className="text-xs text-slate-300">Template</dt><dd className="font-bold">{result.template ?? "manual"}</dd></div>
                <div className="rounded-2xl bg-white/10 p-3"><dt className="text-xs text-slate-300">Pages</dt><dd className="font-bold">{result.pageCount}</dd></div>
              </dl>
            </div>

            <article className="rounded-3xl bg-white p-5 ring-1 ring-sky-100">
              <h3 className="text-xl font-black tracking-tight text-[#12324A]">{result.combined.description}</h3>
              <p className="mt-2 rounded-2xl bg-[#f7fbff] p-3 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">{c.region}: {regionText(result.combined.detectedRegion)}</p>
              <DownloadResponsibilityNotice locale={locale} compact />
              <button type="button" onClick={() => downloadBytes(result.combined.pdfBytes, result.combined.filename)} className="mt-4 rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {c.downloadCombined}
              </button>
            </article>

            <RefundBoundaryNotice locale={locale} />

            <div className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">{c.warnings}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-950">
                {[...result.warnings, c.manual].map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <p className="rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-950">{status}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href={safeLocalizedPath("/tools/size-checker", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white">Size checker</Link>
          <Link href={safeLocalizedPath("/tools/calibration-sheet", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white">Calibration sheet</Link>
          <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white">Pro Toolkit</Link>
        </div>
      </div>

      {pendingAction ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-8">
          <section role="dialog" aria-modal="true" aria-labelledby="splitter-legal-title" className="max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex gap-3">
              <ShieldAlert className="mt-1 h-6 w-6 flex-none text-amber-700" aria-hidden="true" />
              <div>
                <h2 id="splitter-legal-title" className="text-2xl font-black tracking-tight text-[#12324A]">{c.legalTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">{c.legalBody}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  {c.legalChecks.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setPendingAction(null)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50">{c.cancel}</button>
              <button type="button" onClick={acceptConsent} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">{c.continue}</button>
            </div>
          </section>
        </div>
      ) : null}
    </MemberFeatureShell>
  );
}
