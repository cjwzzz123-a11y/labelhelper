"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { DownloadResponsibilityNotice } from "@/components/LegalNotice";
import { MemberFeatureShell, MemberLockedCallout } from "@/components/MembershipBadge";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";
import {
  buildPdfDiagnosticReport,
  expectedSizeFromPaper,
  formatInches,
  formatMm,
  localizedSizeLabel,
  type PdfDiagnosticReport,
  type PdfDiagnosticStatus,
} from "@/lib/pdf-diagnostics";

type ReportStatus = PdfDiagnosticStatus;
type PdfReport = PdfDiagnosticReport;

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_PAGES = 5;

const copy = {
  en: {
    privacyTitle: "Your file never leaves your browser",
    privacyText: "PDF only, 20 MB maximum, 5 pages maximum. This preview reads page boxes and scale — it does not detect rendered barcode pixels or ink margins yet.",
    steps: ["Try a sample or upload PDF", "Confirm page size and scale", "Choose the next safe action"],
    demoPrefix: "Run demo",
    uploadTitle: "Drop in a shipping label PDF",
    uploadText: "Reads page count and first-page size locally, compares expected label size, estimates scale, then points you to the right follow-up tool.",
    boundary: "Page-box check only. Barcode quiet zone and ink margins still need image/manual review.",
    sampleNote: "Samples are free to try. Uploaded reports are preview diagnostics before printing postage.",
    busy: "Analyzing locally...",
    tooLarge: "This PDF is over the 20 MB browser-only limit. Export a smaller label PDF and try again.",
    tooManyPages: "This analyzer supports up to 5 pages per PDF. Split the file and check the first label batch.",
    unreadable: "Could not read this PDF in the browser. Try an unencrypted label PDF.",
    uploadHeadline: "Upload a PDF or run a sample demo.",
    failHeadline: "Needs fixing before printing paid postage.",
    warnHeadline: "Page size is usable; review manual checks.",
    passHeadline: "Looks ready for 100% printing.",
    reportPreview: "Diagnostic summary",
    download: "Download preview summary PDF",
    unlockReport: "Unlock summary PDF",
    vipDownload: "Download VIP summary PDF",
    vipTitle: "VIP diagnostic summary",
    vipText: "The summary PDF packages the page-size check, scale estimate, manual-review warnings and next steps. The on-screen preview stays free.",
    lockedReport: "The on-screen preview stays free. Unlock VIP to download or save this diagnostic summary.",
    nextStep: "Next best step",
    file: "File",
    pagesSize: "Pages / file size",
    page: "page",
    pages: "pages",
    detectedSize: "Detected page size",
    expected: "Vs. expected",
    expectedSource: "Expected size source",
    expectedFromChecker: "From Size Checker",
    expectedAuto: "Auto-detected from PDF page size",
    expectedSample: "Fixed sample demo",
    scale: "Scale factor estimate",
    barcode: "Barcode check",
    barcodeManual: "Manual image check recommended",
    recommendations: "Recommendations",
    waitingPdf: "Waiting for PDF",
    margins: "Margins",
    quietZone: "Quiet zone",
    manualAfterUpload: "Manual review after upload",
    sampleGood: "Known-good 4×6 sample",
    sampleBad: "Known-broken Fit-to-page sample",
    expectedSize: "Expected size",
    expectedSizePass: "Matches 4 × 6 in within tolerance.",
    marginsSampleWarn: "Manual review required: this preview reads PDF page boxes, not rendered ink bounds.",
    quietZoneSampleWarn: "Manual review required: use the dedicated quiet-zone checker on a printed or exported label image.",
    expectedSizeFail: "About 7% smaller than 4 × 6 in.",
    marginsBadWarn: "Manual review: likely extra margins from Fit to Page or driver scaling.",
    quietZoneBadWarn: "Manual review: re-check barcode quiet zone after printing at 100%.",
    recPrint100: "Print at 100% / Actual Size.",
    recFitOff: "Keep Fit to Page disabled.",
    recMedia: "Use the printer's 4×6 media setting.",
    recFixScale: "Change scaling from Fit to Page to 100% / Actual Size.",
    recReexport: "Re-export the label as 4×6 if the marketplace offers a label-format setting.",
    recCalibration: "Run a calibration sheet before printing paid postage.",
    recBarcode: "If scans still fail, verify barcode quiet zone on the printed label.",
    recCutOff: "If the label is cut off, confirm orientation and paper guides before buying postage again.",
    vsExpected: "Vs. expected",
    scaleFactor: "Scale factor",
    pdfShrinking: "shrinking",
    pdfGrowing: "enlarging",
    pdfExpected: "printing at expected scale",
    manualMargins: "Manual review required: this preview can read PDF page boxes, but it cannot measure rendered ink bounds yet.",
    manualBarcode: "Manual review required: use the quiet-zone checker for the ≥ 2.5mm white-space check.",
    nextEmptyTitle: "Upload a PDF to choose the next step",
    nextEmptyText: "Start with page size and scale. After that, use the focused tool that matches the first problem found.",
    setupAction: "Check label setup",
    calibrationAction: "Print calibration sheet",
    barcodeAction: "Check barcode image",
    scaleTitle: "Fix {scale}% scale before printing",
    scaleText: "The PDF page size or scale does not match the expected label size. Correct this before checking margins or buying postage again.",
    scaleAction: "Calculate corrected scale",
    recheckAction: "Recheck setup",
    barcodeTitle: "Review barcode whitespace next",
    barcodeText: "Page size looks usable, but barcode quiet zone and rendered ink still need an image-based check.",
    quietZoneAction: "Check barcode quiet zone",
    testPackAction: "Open test print",
    safeTitle: "Print one safe test before postage",
    safeText: "The PDF page size looks ready. Run a watermarked test or calibration sheet before printing paid labels in bulk.",
    reportTitle: "Shipping Label Helper — PDF Diagnostic Summary",
    checks: "Checks",
    privacyReport: "Privacy: this report was generated in the browser; the source PDF was not uploaded.",
  },
  zh: {
    privacyTitle: "文件不会离开你的浏览器",
    privacyText: "仅支持 PDF，最大 20 MB，最多 5 页。此预览读取 PDF 页面框和缩放比例；暂不检测真实渲染后的条码像素或油墨边界。",
    steps: ["先试样例或上传 PDF", "确认页面尺寸和缩放", "选择下一步安全操作"],
    demoPrefix: "运行示例",
    uploadTitle: "拖入发货标签 PDF",
    uploadText: "在本地读取页数和首页尺寸，对比预期标签尺寸，估算缩放比例，然后指向最合适的后续工具。",
    boundary: "仅检查 PDF 页面框。条码空白区和油墨边界仍需要图片/人工复核。",
    sampleNote: "示例可免费试用。上传报告是打印运单前的预览诊断。",
    busy: "正在本地分析...",
    tooLarge: "此 PDF 超过 20 MB 浏览器本地限制。请导出更小的标签 PDF 后重试。",
    tooManyPages: "此分析器最多支持 5 页 PDF。请拆分文件，先检查第一批标签。",
    unreadable: "无法在浏览器中读取此 PDF。请尝试未加密的标签 PDF。",
    uploadHeadline: "上传 PDF 或运行示例。",
    failHeadline: "打印付费运单前需要修正。",
    warnHeadline: "页面尺寸可用；请复核人工检查项。",
    passHeadline: "看起来适合按 100% 打印。",
    reportPreview: "诊断摘要",
    download: "下载预览摘要 PDF",
    unlockReport: "解锁摘要 PDF",
    vipDownload: "下载 VIP 摘要 PDF",
    vipTitle: "VIP 诊断摘要",
    vipText: "摘要 PDF 会打包页面尺寸检查、比例估算、人工复核提醒和下一步建议。屏幕预览仍然免费。",
    lockedReport: "屏幕上的预览仍然免费。开通 VIP 后可下载或保存此诊断摘要。",
    nextStep: "最佳下一步",
    file: "文件",
    pagesSize: "页数 / 文件大小",
    page: "页",
    pages: "页",
    detectedSize: "检测到的页面尺寸",
    expected: "对比预期",
    expectedSource: "预期尺寸来源",
    expectedFromChecker: "来自尺寸检查器",
    expectedAuto: "根据 PDF 页面尺寸自动判断",
    expectedSample: "固定示例演示",
    scale: "缩放比例估算",
    barcode: "条码检查",
    barcodeManual: "建议进行图片人工检查",
    recommendations: "建议",
    waitingPdf: "等待 PDF",
    margins: "边距",
    quietZone: "空白区",
    manualAfterUpload: "上传后人工复核",
    sampleGood: "正常 4×6 示例",
    sampleBad: "Fit-to-page 缩小错误示例",
    expectedSize: "预期尺寸",
    expectedSizePass: "在容差范围内匹配 4 × 6 英寸。",
    marginsSampleWarn: "需要人工复核：此预览读取 PDF 页面框，不读取渲染后的油墨边界。",
    quietZoneSampleWarn: "需要人工复核：请用专门的空白区检查器检查打印或导出的标签图片。",
    expectedSizeFail: "比 4 × 6 英寸约小 7%。",
    marginsBadWarn: "人工复核：可能是 Fit to Page 或打印机驱动缩放产生了额外边距。",
    quietZoneBadWarn: "人工复核：按 100% 打印后重新检查条码空白区。",
    recPrint100: "按 100% / Actual Size 打印。",
    recFitOff: "关闭 Fit to Page。",
    recMedia: "使用打印机的 4×6 介质设置。",
    recFixScale: "把缩放从 Fit to Page 改为 100% / Actual Size。",
    recReexport: "如果平台提供标签格式设置，请重新导出 4×6 标签。",
    recCalibration: "打印付费运单前先运行校准页。",
    recBarcode: "如果仍无法扫描，请检查打印标签上的条码空白区。",
    recCutOff: "如果标签被裁切，请在再次购买运单前确认方向和纸张导轨。",
    vsExpected: "对比预期",
    scaleFactor: "缩放比例",
    pdfShrinking: "被缩小",
    pdfGrowing: "被放大",
    pdfExpected: "按预期比例打印",
    manualMargins: "需要人工复核：此预览可以读取 PDF 页面框，但暂不能测量渲染后的油墨边界。",
    manualBarcode: "需要人工复核：请使用空白区检查器确认 ≥ 2.5mm 白边。",
    nextEmptyTitle: "上传 PDF 后选择下一步",
    nextEmptyText: "先确认页面尺寸和缩放比例。之后再使用匹配第一个问题的专门工具。",
    setupAction: "检查标签设置",
    calibrationAction: "打印校准页",
    barcodeAction: "检查条码图片",
    scaleTitle: "打印前先修正 {scale}% 缩放",
    scaleText: "PDF 页面尺寸或缩放比例与预期标签尺寸不一致。请先修正，再检查边距或重新购买运单。",
    scaleAction: "计算修正缩放",
    recheckAction: "重新检查设置",
    barcodeTitle: "下一步复核条码空白区",
    barcodeText: "页面尺寸看起来可用，但条码空白区和渲染油墨仍需要基于图片检查。",
    quietZoneAction: "检查条码空白区",
    testPackAction: "打开测试打印",
    safeTitle: "打印付费运单前先做一次安全测试",
    safeText: "PDF 页面尺寸看起来可用。批量打印付费标签前，先运行带水印测试或校准页。",
    reportTitle: "Shipping Label Helper — PDF 诊断摘要",
    checks: "检查项",
    privacyReport: "隐私：此报告在浏览器中生成，源 PDF 未上传。",
  },
};

function getCopy(locale: Locale) {
  return locale === "zh" ? copy.zh : copy.en;
}

function sampleReports(c: typeof copy.en): PdfReport[] {
  return [
    {
      name: c.sampleGood,
      source: "sample",
      pages: 1,
      widthIn: 4,
      heightIn: 6,
      expectedLabel: localizedSizeLabel("4 × 6 in thermal label", c),
      expectedSource: "sample",
      expectedWidthIn: 4,
      expectedHeightIn: 6,
      scalePercent: 100,
      measurements: [
        { key: "expected_size", label: c.expectedSize, status: "pass", detail: c.expectedSizePass },
        { key: "margins", label: c.margins, status: "warn", detail: c.marginsSampleWarn },
        { key: "quiet_zone", label: c.quietZone, status: "warn", detail: c.quietZoneSampleWarn },
      ],
      recommendations: [c.recPrint100, c.recFitOff, c.recMedia],
    },
    {
      name: c.sampleBad,
      source: "sample",
      pages: 1,
      widthIn: 3.72,
      heightIn: 5.58,
      expectedLabel: localizedSizeLabel("4 × 6 in thermal label", c),
      expectedSource: "sample",
      expectedWidthIn: 4,
      expectedHeightIn: 6,
      scalePercent: 93,
      measurements: [
        { key: "expected_size", label: c.expectedSize, status: "fail", detail: c.expectedSizeFail },
        { key: "margins", label: c.margins, status: "warn", detail: c.marginsBadWarn },
        { key: "quiet_zone", label: c.quietZone, status: "warn", detail: c.quietZoneBadWarn },
      ],
      recommendations: [c.recFixScale, c.recReexport, c.recCalibration],
    },
  ];
}

function expectedSourceLabel(source: PdfReport["expectedSource"], c: typeof copy.en) {
  if (source === "query") return c.expectedFromChecker;
  if (source === "sample") return c.expectedSample;
  return c.expectedAuto;
}

function statusClass(status: ReportStatus) {
  if (status === "pass") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "warn") return "bg-amber-50 text-amber-800 ring-amber-200";
  return "bg-red-50 text-red-800 ring-red-200";
}

function getNextActions(report: PdfReport | null, locale: Locale, c: typeof copy.en) {
  if (!report) {
    return {
      title: c.nextEmptyTitle,
      text: c.nextEmptyText,
      actions: [
        { href: safeLocalizedPath("/#checker", locale), label: c.setupAction, primary: true },
        { href: safeLocalizedPath("/tools/calibration-sheet", locale), label: c.calibrationAction },
        { href: safeLocalizedPath("/tools/barcode-quiet-zone-checker", locale), label: c.barcodeAction },
      ],
    };
  }

  const scaleBad = Math.abs(report.scalePercent - 100) > 1;
  const sizeFailed = report.measurements.some((measurement) => [c.vsExpected, c.expectedSize].includes(measurement.label) && measurement.status !== "pass");
  const barcodeNeedsReview = report.measurements.some((measurement) => [c.quietZone, c.barcode].includes(measurement.label) && measurement.status !== "pass");

  if (scaleBad || sizeFailed) {
    return {
      title: c.scaleTitle.replace("{scale}", String(report.scalePercent)),
      text: c.scaleText,
      actions: [
        { href: safeLocalizedPath("/tools/scale-calculator", locale), label: c.scaleAction, primary: true },
        { href: safeLocalizedPath("/tools/calibration-sheet", locale), label: c.calibrationAction },
        { href: safeLocalizedPath("/#checker", locale), label: c.recheckAction },
      ],
    };
  }

  if (barcodeNeedsReview) {
    return {
      title: c.barcodeTitle,
      text: c.barcodeText,
      actions: [
        { href: safeLocalizedPath("/tools/barcode-quiet-zone-checker", locale), label: c.quietZoneAction, primary: true },
        { href: safeLocalizedPath("/test-print", locale), label: c.testPackAction },
        { href: safeLocalizedPath("/tools/calibration-sheet", locale), label: c.calibrationAction },
      ],
    };
  }

  return {
    title: c.safeTitle,
    text: c.safeText,
    actions: [
      { href: safeLocalizedPath("/test-print", locale), label: c.testPackAction, primary: true },
      { href: safeLocalizedPath("/tools/calibration-sheet", locale), label: c.calibrationAction },
      { href: safeLocalizedPath("/tools/barcode-quiet-zone-checker", locale), label: c.barcodeAction },
    ],
  };
}

async function downloadReportPdf(report: PdfReport, c: typeof copy.en) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = 740;

  const draw = (text: string, size = 11, isBold = false) => {
    page.drawText(text, { x: 54, y, size, font: isBold ? bold : font, color: rgb(0.08, 0.1, 0.16) });
    y -= size + 10;
  };

  draw(c.reportTitle, 18, true);
  draw(`${c.file}: ${report.name}`);
  draw(`${c.pagesSize}: ${report.pages}`);
  draw(`${c.detectedSize}: ${formatInches(report.widthIn)} × ${formatInches(report.heightIn)} in (${formatMm(report.widthIn)} × ${formatMm(report.heightIn)} mm)`);
  draw(`${c.expected}: ${report.expectedLabel}`);
  draw(`${c.expectedSource}: ${expectedSourceLabel(report.expectedSource, c)}`);
  draw(`${c.scale}: ${report.scalePercent}%`);
  y -= 8;
  draw(c.checks, 14, true);
  report.measurements.forEach((measurement) => draw(`${measurement.status.toUpperCase()} — ${measurement.label}: ${measurement.detail}`));
  y -= 8;
  draw(c.recommendations, 14, true);
  report.recommendations.forEach((recommendation) => draw(`• ${recommendation}`));
  y -= 8;
  draw(c.privacyReport);

  const bytes = await pdf.save();
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${report.name.replace(/\.pdf$/i, "")}-analysis-report.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PdfAnalyzer({ locale = defaultLocale }: { locale?: Locale }) {
  const searchParams = useSearchParams();
  const pageCopy = getCopy(locale);
  const license = useStoredLicense();
  const expectedFromQuery = expectedSizeFromPaper(searchParams.get("paper"));
  const samples = useMemo(() => sampleReports(pageCopy), [pageCopy]);
  const [report, setReport] = useState<PdfReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const headline = useMemo(() => {
    if (!report) return pageCopy.uploadHeadline;
    const failed = report.measurements.some((measurement) => measurement.status === "fail");
    const warned = report.measurements.some((measurement) => measurement.status === "warn");
    if (failed) return pageCopy.failHeadline;
    if (warned) return pageCopy.warnHeadline;
    return pageCopy.passHeadline;
  }, [pageCopy, report]);
  const nextActions = useMemo(() => getNextActions(report, locale, pageCopy), [locale, pageCopy, report]);

  async function analyzeFile(file: File) {
    setError("");
    setReport(null);

    if (file.size > MAX_FILE_SIZE) {
      setError(pageCopy.tooLarge);
      return;
    }

    setBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPageCount();
      if (pages > MAX_PAGES) {
        setError(pageCopy.tooManyPages);
        return;
      }

      const page = pdf.getPage(0);
      const { width, height } = page.getSize();
      setReport(buildPdfDiagnosticReport({
        name: file.name,
        pages,
        widthIn: width / 72,
        heightIn: height / 72,
        fileSizeMb: Math.round((file.size / 1024 / 1024) * 10) / 10,
        source: "upload",
      }, pageCopy, expectedFromQuery));
    } catch {
      setError(pageCopy.unreadable);
    } finally {
      setBusy(false);
    }
  }

  return (
    <MemberFeatureShell locale={locale} unlocked={license.verified} title={pageCopy.vipTitle} description={pageCopy.vipText}>
      <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
        <p className="font-bold">{pageCopy.privacyTitle}</p>
        <p className="mt-1 text-emerald-700">{pageCopy.privacyText}</p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {pageCopy.steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-[#12324A]">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {samples.map((sample) => (
          <button
            key={sample.name}
            type="button"
            onClick={() => {
              setError("");
              setReport(sample);
            }}
            className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-left text-sm font-bold text-[#12324A] transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            {pageCopy.demoPrefix}: {sample.name}
          </button>
        ))}
      </div>

      <label className="mt-6 block rounded-3xl border border-dashed border-sky-300 bg-sky-50/70 p-6 text-center transition hover:bg-sky-50">
        <span className="block text-sm font-bold text-[#12324A]">{pageCopy.uploadTitle}</span>
        <span className="mt-2 block text-sm leading-6 text-slate-600">{pageCopy.uploadText}</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="mt-4 text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void analyzeFile(file);
          }}
        />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-[#fffdf7] p-4 text-sm text-amber-900">
        <strong>{pageCopy.boundary}</strong> {pageCopy.sampleNote}
      </div>

      {busy ? <p className="mt-4 text-sm font-medium text-slate-600">{pageCopy.busy}</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-6 rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.reportPreview}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">{headline}</h2>
          </div>
          {report ? (
            license.verified ? (
              <button
                type="button"
                onClick={() => void downloadReportPdf(report, pageCopy)}
                className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]"
              >
                {pageCopy.vipDownload}
              </button>
            ) : (
              <Link href={safeLocalizedPath("/pricing", locale)} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70]">
                {pageCopy.unlockReport}
              </Link>
            )
          ) : null}
        </div>
        {report && !license.verified ? <div className="mt-4"><MemberLockedCallout locale={locale} text={pageCopy.lockedReport} /></div> : null}
        {report ? <div className="mt-4"><DownloadResponsibilityNotice locale={locale} compact /></div> : null}

        <section className="mt-5 rounded-3xl border border-amber-200 bg-[#fffdf7] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.nextStep}</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-[#12324A]">{nextActions.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{nextActions.text}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {nextActions.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={action.primary ? "rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]" : "rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white"}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        {report ? (
          <>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.file}</dt><dd className="font-semibold">{report.name}</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.pagesSize}</dt><dd className="font-semibold">{report.pages} {report.pages === 1 ? pageCopy.page : pageCopy.pages}{report.fileSizeMb ? ` / ${report.fileSizeMb} MB` : ""}</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.detectedSize}</dt><dd className="font-semibold">{formatInches(report.widthIn)} × {formatInches(report.heightIn)} in ({formatMm(report.widthIn)} × {formatMm(report.heightIn)} mm)</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.expected}</dt><dd className="font-semibold">{report.expectedLabel}</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.expectedSource}</dt><dd className="font-semibold">{expectedSourceLabel(report.expectedSource, pageCopy)}</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.scale}</dt><dd className="font-semibold">{report.scalePercent}%</dd></div>
              <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.barcode}</dt><dd className="font-semibold">{pageCopy.barcodeManual}</dd></div>
            </dl>

            <div className="mt-5 grid gap-3">
              {report.measurements.map((measurement) => (
                <div key={measurement.label} className={`rounded-2xl p-4 ring-1 ${statusClass(measurement.status)}`}>
                  <p className="font-semibold">{measurement.label}</p>
                  <p className="mt-1 text-sm leading-6">{measurement.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4">
              <h3 className="font-bold">{pageCopy.recommendations}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {report.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
              </ul>
            </div>
          </>
        ) : (
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.detectedSize}</dt><dd className="font-semibold">{pageCopy.waitingPdf}</dd></div>
            <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.scaleFactor}</dt><dd className="font-semibold">{pageCopy.waitingPdf}</dd></div>
            <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.margins}</dt><dd className="font-semibold">{pageCopy.manualAfterUpload}</dd></div>
            <div className="rounded-2xl bg-white p-4"><dt className="text-sm text-slate-500">{pageCopy.quietZone}</dt><dd className="font-semibold">{pageCopy.barcodeManual}</dd></div>
          </dl>
        )}
      </div>
    </MemberFeatureShell>
  );
}
