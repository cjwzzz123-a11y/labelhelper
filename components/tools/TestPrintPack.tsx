"use client";

import { useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { MemberFeatureShell } from "@/components/MembershipBadge";
import { saveVerifiedLicense, useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { testPrintPackItems, type TestPrintPackItem } from "@/lib/template-pdfs";

const previewItems = testPrintPackItems.slice(0, 3);

const copy = {
  en: {
    initialMessage: "The bundled ZIP is for VIP members. Free users can still download single watermarked preview PDFs below.",
    localTitle: "Browser-local PDF generator",
    localText: "PDFs are generated on this device only when you click download. No label upload or account is required for the preview pack.",
    primaryEyebrow: "Best first action",
    primaryTitle: "Preview first, unlock the bundled ZIP when needed",
    primaryVipTitle: "Generate the VIP ZIP",
    primaryText: (count: number) => `Download ${count} test PDFs grouped by 4×6, A4 and Letter. Use them to check scale, alignment and barcode whitespace before real postage.`,
    primaryVipText: (count: number) => `Your license is active. Download ${count} test PDFs without evaluation watermarks.`,
    zipBusy: "Generating ZIP...",
    zipUnlocked: "Download unwatermarked ZIP",
    zipPreview: "Unlock ZIP download",
    whatYouGet: "What you’ll get",
    getItems: ["Border and center crosshair", "100 mm reference line", "Barcode sample and quiet-zone reference"],
    licenseTitle: "Have a license key?",
    licenseText: "A valid key unlocks the bundled ZIP and removes the evaluation watermark. If licensing is not connected yet, single previews still work for free.",
    unlockedText: "VIP is active on this browser. ZIP downloads and member outputs are generated without the evaluation watermark.",
    lockedZipText: "The bundled ZIP is a member feature. Free users can still download the single watermarked preview PDFs below.",
    license: "License key",
    placeholder: "Enter license key for unwatermarked pack",
    checking: "Checking...",
    check: "Check license",
    accepted: "License accepted. Downloads will be generated without evaluation watermark.",
    inactiveSuffix: "You can still generate watermarked preview PDFs without payment.",
    failed: "License check failed. You can still generate watermarked preview PDFs without payment.",
    quickTitle: "Quick sample previews",
    freePreview: "Free preview",
    previewText: "Watermarked single PDF for a fast 100% scale and alignment check.",
    generating: "Generating...",
    downloadPreview: "Download preview PDF",
    sheet: "Sheet",
    printer: "Printer",
    barcode: "Barcode",
    blanksTitle: "Blank sheet templates",
    blanksText: "Use these first if you only need a border and scale baseline. They do not include carrier barcodes.",
    contentsTitle: "ZIP contents",
    contentsText: (count: number) => `Includes ${count} generated PDFs across paper sizes, printer types and barcode reference variants.`,
    pdfCount: (count: number, printers: string) => `${count} PDFs: ${printers}`,
    ifFails: "If the test fails",
    nextSteps: [
      ["Scale issue", "/tools/scale-calculator", "Calculate corrected print scale"],
      ["Alignment issue", "/tools/calibration-sheet", "Print a calibration sheet"],
      ["Barcode whitespace", "/tools/barcode-quiet-zone-checker", "Check quiet-zone risk"],
      ["Wrong PDF size", "/tools/pdf-analyzer", "Analyze page size"],
    ],
  },
  zh: {
    initialMessage: "打包 ZIP 属于 VIP 会员功能。免费用户仍可下载下方单个带水印预览 PDF。",
    localTitle: "浏览器本地 PDF 生成器",
    localText: "只有点击下载时才会在本设备生成 PDF。预览测试包不需要上传标签，也不需要账户。",
    primaryEyebrow: "建议先做",
    primaryTitle: "先预览，必要时解锁打包 ZIP",
    primaryVipTitle: "生成 VIP 测试 ZIP",
    primaryText: (count: number) => `下载 ${count} 个测试 PDF，按 4×6、A4 和 Letter 分组。先检查比例、对齐和条码空白区，再打印真实运费。`,
    primaryVipText: (count: number) => `你的许可证已生效。可下载 ${count} 个不带评估水印的测试 PDF。`,
    zipBusy: "正在生成 ZIP...",
    zipUnlocked: "下载无水印 ZIP",
    zipPreview: "解锁 ZIP 下载",
    whatYouGet: "包含内容",
    getItems: ["边框和中心十字线", "100 mm 参考线", "条码样例和空白区参考"],
    licenseTitle: "已有许可证密钥？",
    licenseText: "有效密钥会解锁打包 ZIP 并移除评估水印。如果许可证系统尚未接入，单个免费预览仍可使用。",
    unlockedText: "此浏览器已启用 VIP。ZIP 下载和会员输出将不带评估水印。",
    lockedZipText: "打包 ZIP 是会员功能。免费用户仍可下载下方单个带水印预览 PDF。",
    license: "许可证密钥",
    placeholder: "输入许可证密钥以生成无水印测试包",
    checking: "正在检查...",
    check: "检查许可证",
    accepted: "许可证已接受。下载内容将不带评估水印。",
    inactiveSuffix: "你仍可免费生成带水印预览 PDF。",
    failed: "许可证检查失败。你仍可免费生成带水印预览 PDF。",
    quickTitle: "快速单页预览",
    freePreview: "免费预览",
    previewText: "带水印单个 PDF，用于快速检查 100% 比例和对齐。",
    generating: "正在生成...",
    downloadPreview: "下载预览 PDF",
    sheet: "纸张",
    printer: "打印机",
    barcode: "条码",
    blanksTitle: "空白纸张模板",
    blanksText: "如果只需要边框和比例基准，先用这些模板。它们不包含承运商条码。",
    contentsTitle: "ZIP 内容",
    contentsText: (count: number) => `包含 ${count} 个生成的 PDF，覆盖纸张尺寸、打印机类型和条码参考变体。`,
    pdfCount: (count: number, printers: string) => `${count} 个 PDF：${printers}`,
    ifFails: "如果测试失败",
    nextSteps: [
      ["比例问题", "/tools/scale-calculator", "计算修正打印比例"],
      ["对齐问题", "/tools/calibration-sheet", "打印校准页"],
      ["条码空白区", "/tools/barcode-quiet-zone-checker", "检查空白区风险"],
      ["PDF 尺寸错误", "/tools/pdf-analyzer", "分析页面尺寸"],
    ],
  },
};

export function TestPrintPack({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = locale === "zh" ? copy.zh : copy.en;
  const storedLicense = useStoredLicense();
  const [busyAction, setBusyAction] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseMessage, setLicenseMessage] = useState(pageCopy.initialMessage);
  const [licenseActive, setLicenseActive] = useState(false);
  const isVip = storedLicense.verified || licenseActive;
  const groupedItems = testPrintPackItems.reduce<Record<string, TestPrintPackItem[]>>((groups, item) => {
    groups[item.sheet.label] = [...(groups[item.sheet.label] ?? []), item];
    return groups;
  }, {});

  function downloadBytes(bytes: Uint8Array, filename: string, type = "application/pdf") {
    const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function authHeaders() {
    return storedLicense.token ? { Authorization: `Bearer ${storedLicense.token}` } : undefined;
  }

  async function fetchPdfBytes(url: string) {
    const response = await fetch(url, { headers: authHeaders() });
    if (!response.ok) throw new Error("Download failed.");
    return {
      bytes: new Uint8Array(await response.arrayBuffer()),
      disposition: response.headers.get("content-disposition") ?? "",
    };
  }

  async function downloadResponse(url: string, fallbackFilename: string, type = "application/pdf") {
    const { bytes, disposition } = await fetchPdfBytes(url);
    const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? fallbackFilename;
    downloadBytes(bytes, filename, type);
    return bytes;
  }

  async function downloadPreview(item: TestPrintPackItem) {
    setBusyAction(item.id);
    try {
      await downloadResponse(`/api/test-print-pack/${encodeURIComponent(item.id)}?preview=true`, item.filename.replace(".pdf", "-preview.pdf"));
    } finally {
      setBusyAction("");
    }
  }

  async function downloadBlankTemplate(slug: string) {
    setBusyAction(slug);
    try {
      await downloadResponse(`/api/test-print-pack/blank-${encodeURIComponent(slug)}`, `slh-test-print-${slug}-blank.pdf`);
    } finally {
      setBusyAction("");
    }
  }

  async function verifyLicense() {
    setBusyAction("license");
    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: licenseKey, instanceId: storedLicense.instanceId }),
      });
      const result = (await response.json()) as { valid?: boolean; configured?: boolean; reason?: string; verifiedUntil?: string; instanceId?: string; token?: string };
      setLicenseActive(Boolean(result.valid));
      if (result.valid) saveVerifiedLicense(licenseKey.trim(), result.verifiedUntil, result.instanceId, result.token);
      setLicenseMessage(result.valid ? pageCopy.accepted : `${result.reason ?? "License is not active."} ${pageCopy.inactiveSuffix}`);
    } catch {
      setLicenseActive(false);
      setLicenseMessage(pageCopy.failed);
    } finally {
      setBusyAction("");
    }
  }

  async function downloadFullPack() {
    setBusyAction("pack");
    try {
      const zip = new JSZip();
      for (const item of testPrintPackItems) {
        const { bytes } = await fetchPdfBytes(`/api/test-print-pack/${encodeURIComponent(item.id)}?preview=false`);
        const folder = zip.folder(item.sheet.slug);
        folder?.file(isVip ? item.filename : item.filename.replace(".pdf", "-evaluation.pdf"), bytes);
      }
      const blob = await zip.generateAsync({ type: "uint8array" });
      downloadBytes(blob, isVip ? "slh-test-print-pack.zip" : "slh-test-print-pack-evaluation.zip", "application/zip");
    } finally {
      setBusyAction("");
    }
  }

  return (
    <MemberFeatureShell locale={locale} unlocked={isVip} title={isVip ? pageCopy.zipUnlocked : pageCopy.zipPreview} description={isVip ? pageCopy.unlockedText : pageCopy.initialMessage}>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl bg-slate-950 p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-200">{pageCopy.primaryEyebrow}</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">{isVip ? pageCopy.primaryVipTitle : pageCopy.primaryTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{isVip ? pageCopy.primaryVipText(testPrintPackItems.length) : pageCopy.primaryText(testPrintPackItems.length)}</p>
          <div className="mt-4">
            <DownloadResponsibilityNotice locale={locale} compact />
          </div>
          {isVip ? (
            <button type="button" onClick={() => void downloadFullPack()} disabled={busyAction === "pack"} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100 disabled:opacity-60">
              {busyAction === "pack" ? pageCopy.zipBusy : pageCopy.zipUnlocked}
            </button>
          ) : (
            <>
              <p className="mt-4 rounded-2xl bg-amber-100/10 p-3 text-sm leading-6 text-amber-100 ring-1 ring-amber-200/20">{pageCopy.lockedZipText}</p>
              <Link href={safeLocalizedPath("/pricing", locale)} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
                {pageCopy.zipPreview}
              </Link>
            </>
          )}
        </div>

        <div className="rounded-3xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
          <p className="text-sm font-bold text-emerald-900">{pageCopy.localTitle}</p>
          <p className="mt-2 text-sm leading-6 text-emerald-800">{pageCopy.localText}</p>
          <div className="mt-4 rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-black text-[#12324A]">{pageCopy.whatYouGet}</p>
            <ul className="mt-2 grid gap-2 text-sm text-slate-700">
              {pageCopy.getItems.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className={`mt-6 rounded-3xl border p-5 ${isVip ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-[#fffdf7]"}`}>
        <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <h2 className="font-black text-[#12324A]">{pageCopy.licenseTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{isVip ? pageCopy.unlockedText : pageCopy.licenseText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="test-print-license" className="text-sm font-semibold text-slate-950">{pageCopy.license}</label>
              <input
                id="test-print-license"
                value={licenseKey}
                onChange={(event) => setLicenseKey(event.target.value)}
                placeholder={pageCopy.placeholder}
                className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-amber-500"
              />
            </div>
            <button type="button" onClick={() => void verifyLicense()} disabled={busyAction === "license" || !licenseKey.trim()} className="rounded-full border border-amber-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-60">
              {busyAction === "license" ? pageCopy.checking : pageCopy.check}
            </button>
          </div>
        </div>
        <p aria-live="polite" className={`mt-3 text-sm leading-6 ${isVip ? "text-emerald-900" : "text-amber-900"}`}>{isVip ? pageCopy.accepted : licenseMessage}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-black tracking-tight text-[#12324A]">{pageCopy.quickTitle}</h2>
        <div className="mt-4 grid gap-4">
          {previewItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-[#f7fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-950">{item.sheet.label}</h3>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-sky-100">{pageCopy.freePreview}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-sky-100">{pageCopy.sheet}: {item.sheet.label}</span>
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-sky-100">{pageCopy.printer}: {item.printer}</span>
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-sky-100">{pageCopy.barcode}: {item.barcode}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.previewText}</p>
                <div className="mt-3">
                  <DownloadResponsibilityNotice locale={locale} compact />
                </div>
              </div>
              <button type="button" onClick={() => void downloadPreview(item)} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4d70] disabled:opacity-60" disabled={busyAction === item.id}>
                {busyAction === item.id ? pageCopy.generating : pageCopy.downloadPreview}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-black text-[#12324A]">{pageCopy.blanksTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.blanksText}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["4x6", "letter", "a4"] as const).map((slug) => (
              <button key={slug} type="button" onClick={() => void downloadBlankTemplate(slug)} disabled={busyAction === slug} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60">
                {busyAction === slug ? pageCopy.generating : slug.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">{pageCopy.contentsTitle}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.contentsText(testPrintPackItems.length)}</p>
          <div className="mt-4 grid gap-3">
            {Object.entries(groupedItems).map(([sheet, items]) => (
              <div key={sheet} className="rounded-2xl bg-white p-4">
                <p className="font-semibold text-slate-950">{sheet}</p>
                <p className="mt-1 text-sm text-slate-600">{pageCopy.pdfCount(items?.length ?? 0, Array.from(new Set(items?.map((item) => item.printer))).join(", "))}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 ring-1 ring-sky-100">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">{pageCopy.ifFails}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {pageCopy.nextSteps.map(([title, href, text]) => (
              <Link key={href} href={safeLocalizedPath(href, locale)} className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-50">
                <p className="font-bold text-[#12324A]">{title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MemberFeatureShell>
  );
}
