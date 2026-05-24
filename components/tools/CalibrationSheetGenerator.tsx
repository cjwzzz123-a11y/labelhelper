"use client";

import { useState } from "react";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { MemberFeatureShell } from "@/components/MembershipBadge";
import { PaidToolGate } from "@/components/PaidToolGate";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    privacyTitle: "Processed locally in your browser",
    privacyText: "No label files are uploaded. This only generates a blank calibration PDF.",
    paper: "Paper size",
    printer: "Printer type",
    options: { letter: "Letter preview", fourBySix: "4×6 preview", a4: "A4 preview", thermal: "Thermal", inkjet: "Inkjet", laser: "Laser" },
    includes: "Preview PDF includes",
    bullets: ["100 mm reference line for scale checks", "Center crosshair for alignment checks", "Barcode quiet-zone reference box"],
    generating: "Generating...",
    download: "Unlock Pro to download PDF",
    downloadVip: "Download VIP watermark-free PDF",
    vipTitle: "VIP output",
    vipText: "Members get the same browser-local calibration sheet without the FREE PREVIEW watermark.",
  },
  zh: {
    privacyTitle: "在浏览器本地生成",
    privacyText: "不会上传标签文件。这里仅生成空白校准 PDF。",
    paper: "纸张尺寸",
    printer: "打印机类型",
    options: { letter: "Letter 预览", fourBySix: "4×6 预览", a4: "A4 预览", thermal: "热敏", inkjet: "喷墨", laser: "激光" },
    includes: "预览 PDF 包含",
    bullets: ["用于检查比例的 100 mm 参考线", "用于检查对齐的中心十字线", "条码空白区参考框"],
    generating: "正在生成...",
    download: "下载带水印预览 PDF",
    downloadVip: "下载 VIP 无水印 PDF",
    vipTitle: "VIP 输出",
    vipText: "会员可在浏览器本地生成相同校准页，但不带 FREE PREVIEW 水印。",
  },
};

export function CalibrationSheetGenerator({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = locale === "zh" ? copy.zh : copy.en;
  const license = useStoredLicense();
  const [paper, setPaper] = useState("letter");
  const [printer, setPrinter] = useState("thermal");
  const [busy, setBusy] = useState(false);

  async function downloadPreview() {
    setBusy(true);
    try {
      const response = await fetch(`/api/calibration-sheet?paper=${encodeURIComponent(paper)}&printer=${encodeURIComponent(printer)}`, {
        headers: license.token ? { Authorization: `Bearer ${license.token}` } : undefined,
      });
      if (!response.ok) throw new Error("Calibration sheet download failed.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `slh-calibration-${paper}-${printer}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PaidToolGate feature={locale === "zh" ? "校准页生成器" : "Calibration sheet generator"} locale={locale}>
      <MemberFeatureShell locale={locale} unlocked={license.verified} title={pageCopy.vipTitle} description={pageCopy.vipText}>
      <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
        <p className="font-bold">{pageCopy.privacyTitle}</p>
        <p className="mt-1 text-emerald-700">{pageCopy.privacyText}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.paper}</span>
          <select value={paper} onChange={(event) => setPaper(event.target.value)} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none">
            <option value="letter">{pageCopy.options.letter}</option>
            <option value="4x6">{pageCopy.options.fourBySix}</option>
            <option value="a4">{pageCopy.options.a4}</option>
          </select>
        </label>
        <label>
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.printer}</span>
          <select value={printer} onChange={(event) => setPrinter(event.target.value)} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none">
            <option value="thermal">{pageCopy.options.thermal}</option>
            <option value="inkjet">{pageCopy.options.inkjet}</option>
            <option value="laser">{pageCopy.options.laser}</option>
          </select>
        </label>
      </div>
      <div className="mt-6 rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.includes}</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {pageCopy.bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}
        </ul>
      </div>
      <div className="mt-5">
        <DownloadResponsibilityNotice locale={locale} compact />
      </div>
      <button onClick={downloadPreview} disabled={busy} className="mt-6 rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70] disabled:opacity-60">
        {busy ? pageCopy.generating : license.verified ? pageCopy.downloadVip : pageCopy.download}
      </button>
      </MemberFeatureShell>
    </PaidToolGate>
  );
}
