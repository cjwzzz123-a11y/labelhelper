"use client";

import { type ChangeEvent, type ClipboardEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MemberFeatureShell, MemberLockedCallout } from "@/components/MembershipBadge";
import { PaidToolGate } from "@/components/PaidToolGate";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

type Unit = "in" | "mm";

type QuietZoneMeasurements = {
  leftMm: number;
  rightMm: number;
  topMm: number;
  bottomMm: number;
};

type BarcodeRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  type: string;
  moduleWidthMm: number;
} & QuietZoneMeasurements;

type AnalysisReport = {
  name: string;
  dataUrl: string;
  region: BarcodeRegion | null;
  warning?: string;
};

const MIN_LINEAR_QUIET_ZONE_MM = 2.5;

const copy = {
  en: {
    privacyTitle: "Browser-only analysis",
    privacyText: "Uploaded or pasted images stay on this device and are processed with local canvas code.",
    steps: ["Upload image", "Confirm DPI", "Read scan risk"],
    uploadTitle: "Upload or paste a barcode image",
    uploadText: "PNG/JPEG only. Crop near the printed barcode and set the print or scan DPI for a better estimate.",
    goodDemo: "Run demo: good quiet zone",
    goodDemoText: "Shows a barcode with enough whitespace before you upload your own image.",
    tightDemo: "Run demo: too tight",
    tightDemoText: "Shows how cropped whitespace can create a scan risk.",
    dpi: "Print / scan DPI",
    dpiHelp: "Use 203 for many thermal printers, 300 for many laser/inkjet scans.",
    showManual: "Use manual measurements instead",
    hideManual: "Hide manual measurements",
    manualUnit: "Manual unit",
    inches: "Inches",
    millimeters: "Millimeters",
    sides: { left: "Left", right: "Right", top: "Top", bottom: "Bottom" },
    overlay: "Visual overlay",
    overlayHelp: "Red box marks the best-effort barcode region. Quiet zones are estimated from the blank area around that box.",
    emptyOverlay: "Upload or paste a PNG/JPEG to see the detected barcode region.",
    previewAlt: "Uploaded barcode preview",
    busy: "Analyzing locally...",
    invalidFile: "Upload a PNG or JPEG image. PDF barcode analysis belongs in the PDF Analyzer.",
    analyzeFailed: "Could not analyze this image locally. Try a clearer PNG or JPEG label preview.",
    warning: "Could not confidently isolate a barcode. Use the manual fields below.",
    sampleFailed: "Could not load the sample barcode.",
    goodSampleName: "Good quiet zone sample",
    tightSampleName: "Too-tight quiet zone sample",
    verdictLabel: "Scan-risk report",
    ok: "Low whitespace risk",
    risky: "Whitespace risk",
    summaryPrefix: "Shortest measured side",
    targetPrefix: "Target",
    summarySuffix: "on each side. This check uses at least 2.5 mm and, when an image is detected, at least 4× estimated module width.",
    fixTitleOk: "Next: confirm with a print test",
    fixTitleRisk: "Next: re-export or reprint before buying postage",
    fixTextOk: "The barcode whitespace looks usable. Still confirm print density and scale with a safe test print or PDF page-size check.",
    fixTextRisk: "More whitespace is needed around the barcode. Fix scale, cropping or label placement, then run the PDF or test-print workflow again.",
    primaryOk: "Open test print",
    primaryRisk: "Open PDF Analyzer",
    fixScale: "Fix scale",
    printPack: "Test print",
    measurementsTitle: "Side measurements",
    measured: "Measured",
    required: "Target",
    pass: "OK",
    fail: "Too tight",
    detectedType: "Detected type",
    manualType: "Manual measurement",
    file: "File",
    noImage: "No image loaded",
    waitingTitle: "Add your label image or measurements first",
    waitingText: "This checker will show a risk estimate only after you upload, paste, run a demo, or edit the manual quiet-zone measurements.",
    pending: "Waiting for input",
    vipTitle: "VIP advanced barcode workflow",
    vipText: "Quiet-zone analysis, saved reports and advanced barcode checks are member features.",
    lockedReport: "Unlock VIP to save this quiet-zone report and access the advanced barcode-check workflow as it is added.",
  },
  zh: {
    privacyTitle: "仅在浏览器内分析",
    privacyText: "上传或粘贴的图片会留在本设备，并用本地 canvas 代码处理。",
    steps: ["上传图片", "确认 DPI", "查看扫描风险"],
    uploadTitle: "上传或粘贴条码图片",
    uploadText: "仅支持 PNG/JPEG。尽量裁到接近已打印条码，并设置打印或扫描 DPI，以便估算更接近实际。",
    goodDemo: "运行演示：空白区充足",
    goodDemoText: "先看一个空白区足够的条码示例，再上传自己的图片。",
    tightDemo: "运行演示：空白区过窄",
    tightDemoText: "展示裁切空白区如何带来扫描风险。",
    dpi: "打印 / 扫描 DPI",
    dpiHelp: "许多热敏打印机可用 203，许多激光/喷墨扫描图可用 300。",
    showManual: "改用手动测量",
    hideManual: "隐藏手动测量",
    manualUnit: "手动单位",
    inches: "英寸",
    millimeters: "毫米",
    sides: { left: "左侧", right: "右侧", top: "上方", bottom: "下方" },
    overlay: "可视化定位",
    overlayHelp: "红框标出尽力识别到的条码区域。空白区根据红框周围留白估算。",
    emptyOverlay: "上传或粘贴 PNG/JPEG 后，可查看识别到的条码区域。",
    previewAlt: "上传的条码预览",
    busy: "正在本地分析...",
    invalidFile: "请上传 PNG 或 JPEG 图片。PDF 条码分析请先使用 PDF Analyzer。",
    analyzeFailed: "无法在本地分析这张图片。请尝试更清晰的 PNG 或 JPEG 标签预览图。",
    warning: "无法可靠识别条码区域。请使用下方手动测量字段。",
    sampleFailed: "无法加载条码示例。",
    goodSampleName: "空白区充足示例",
    tightSampleName: "空白区过窄示例",
    verdictLabel: "扫描风险报告",
    ok: "空白区风险较低",
    risky: "存在空白区风险",
    summaryPrefix: "最短测量边",
    targetPrefix: "目标",
    summarySuffix: "每一侧。此检查至少使用 2.5 mm；识别到图片时，还会参考至少 4× 估算模块宽度。",
    fixTitleOk: "下一步：用测试打印确认",
    fixTitleRisk: "下一步：购买运费前重新导出或重打",
    fixTextOk: "条码空白区看起来可用。仍建议用安全测试打印或 PDF 页面尺寸检查确认打印浓度和比例。",
    fixTextRisk: "条码周围需要更多空白。先修复比例、裁切或标签位置，再重新运行 PDF 或测试打印流程。",
    primaryOk: "打开测试打印",
    primaryRisk: "打开 PDF Analyzer",
    fixScale: "修复比例",
    printPack: "测试打印",
    measurementsTitle: "四边测量",
    measured: "测量值",
    required: "目标",
    pass: "可用",
    fail: "过窄",
    detectedType: "识别类型",
    manualType: "手动测量",
    file: "文件",
    noImage: "尚未加载图片",
    waitingTitle: "请先添加标签图片或测量值",
    waitingText: "上传、粘贴、运行演示或编辑手动空白区测量值后，此检查器才会显示风险估算。",
    pending: "等待输入",
    vipTitle: "VIP 高级条码流程",
    vipText: "空白区分析、保存报告和高级条码检查都属于会员功能。",
    lockedReport: "开通 VIP 后可保存此空白区报告，并在高级条码检查流程上线后使用。",
  },
};

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function valueToMm(value: string, unit: Unit) {
  const parsed = parseNumber(value);
  return unit === "in" ? parsed * 25.4 : parsed;
}

function mmToUnit(value: number, unit: Unit) {
  return unit === "in" ? value / 25.4 : value;
}

function formatMeasurement(value: number, unit: Unit) {
  const converted = mmToUnit(value, unit);
  return `${round(converted, unit === "in" ? 2 : 1)} ${unit}`;
}

function luma(data: Uint8ClampedArray, index: number) {
  return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
}

function findDarkRunDistance(
  dark: Uint8Array,
  imageWidth: number,
  from: number,
  to: number,
  startBand: number,
  endBand: number,
  vertical: boolean,
) {
  const step = from <= to ? 1 : -1;
  let distance = 0;

  for (let position = from; step > 0 ? position <= to : position >= to; position += step) {
    let darkPixels = 0;
    const bandLength = Math.max(1, endBand - startBand + 1);

    for (let band = startBand; band <= endBand; band += 1) {
      const x = vertical ? position : band;
      const y = vertical ? band : position;
      if (dark[y * imageWidth + x]) darkPixels += 1;
    }

    if (darkPixels / bandLength > 0.02) break;
    distance += 1;
  }

  return distance;
}

function estimateModuleWidthMm(dark: Uint8Array, imageWidth: number, region: { x: number; y: number; width: number; height: number }, pxToMm: number) {
  const centerY = Math.min(region.y + Math.floor(region.height / 2), region.y + region.height - 1);
  const runs: number[] = [];
  let current = 0;

  for (let x = region.x; x < region.x + region.width; x += 1) {
    if (dark[centerY * imageWidth + x]) {
      current += 1;
    } else if (current > 0) {
      runs.push(current);
      current = 0;
    }
  }
  if (current > 0) runs.push(current);

  const likelyModules = runs.filter((run) => run >= 1).sort((a, b) => a - b);
  return Math.max(0.15, (likelyModules[0] ?? 2) * pxToMm);
}

function analyzeCanvas(canvas: HTMLCanvasElement, dpi: number): BarcodeRegion | null {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  const { width, height } = canvas;
  const { data } = context.getImageData(0, 0, width, height);
  const dark = new Uint8Array(width * height);
  const rowCount = new Array<number>(height).fill(0);
  const rowMinX = new Array<number>(height).fill(width);
  const rowMaxX = new Array<number>(height).fill(0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (data[index + 3] > 20 && luma(data, index) < 115) {
        dark[y * width + x] = 1;
        rowCount[y] += 1;
        rowMinX[y] = Math.min(rowMinX[y], x);
        rowMaxX[y] = Math.max(rowMaxX[y], x);
      }
    }
  }

  const rowThreshold = Math.max(4, width * 0.015);
  const segments: Array<{ start: number; end: number }> = [];
  let start = -1;
  let gap = 0;

  for (let y = 0; y < height; y += 1) {
    if (rowCount[y] >= rowThreshold) {
      if (start === -1) start = y;
      gap = 0;
    } else if (start !== -1) {
      gap += 1;
      if (gap > 6) {
        segments.push({ start, end: y - gap });
        start = -1;
        gap = 0;
      }
    }
  }
  if (start !== -1) segments.push({ start, end: height - 1 });

  let best: { x: number; y: number; width: number; height: number; score: number } | null = null;

  for (const segment of segments) {
    const segmentHeight = segment.end - segment.start + 1;
    if (segmentHeight < 10) continue;

    let minX = width;
    let maxX = 0;
    let darkPixels = 0;
    for (let y = segment.start; y <= segment.end; y += 1) {
      if (rowCount[y] === 0) continue;
      minX = Math.min(minX, rowMinX[y]);
      maxX = Math.max(maxX, rowMaxX[y]);
      darkPixels += rowCount[y];
    }

    const segmentWidth = maxX - minX + 1;
    if (segmentWidth < 25) continue;

    const density = darkPixels / (segmentWidth * segmentHeight);
    const aspect = segmentWidth / segmentHeight;
    const barcodeShapeBoost = aspect > 1.8 ? 1.6 : aspect > 0.65 && aspect < 1.45 ? 1.25 : 0.75;
    const score = segmentWidth * segmentHeight * density * barcodeShapeBoost;

    if (!best || score > best.score) {
      best = { x: minX, y: segment.start, width: segmentWidth, height: segmentHeight, score };
    }
  }

  if (!best) return null;

  const pxToMm = 25.4 / Math.max(72, dpi);
  const xEnd = best.x + best.width - 1;
  const yEnd = best.y + best.height - 1;
  const leftPx = findDarkRunDistance(dark, width, best.x - 1, 0, best.y, yEnd, true);
  const rightPx = findDarkRunDistance(dark, width, xEnd + 1, width - 1, best.y, yEnd, true);
  const topPx = findDarkRunDistance(dark, width, best.y - 1, 0, best.x, xEnd, false);
  const bottomPx = findDarkRunDistance(dark, width, yEnd + 1, height - 1, best.x, xEnd, false);
  const aspect = best.width / best.height;
  const type = aspect > 1.8 ? "1D barcode, likely Code128 / GS1-128" : "2D barcode, likely QR / Data Matrix";
  const moduleWidthMm = aspect > 1.8 ? estimateModuleWidthMm(dark, width, best, pxToMm) : Math.max(0.15, (Math.min(best.width, best.height) / 33) * pxToMm);

  return {
    ...best,
    imageWidth: width,
    imageHeight: height,
    leftMm: leftPx * pxToMm,
    rightMm: rightPx * pxToMm,
    topMm: topPx * pxToMm,
    bottomMm: bottomPx * pxToMm,
    type,
    moduleWidthMm,
  };
}

async function loadImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = dataUrl;
  });

  return { image, dataUrl };
}

async function loadDataUrl(dataUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load sample."));
    img.src = dataUrl;
  });

  return { image, dataUrl };
}

function createBarcodeSample(tight: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 260;
  const context = canvas.getContext("2d");
  if (!context) return "";

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const startX = tight ? 18 : 96;
  const startY = 70;
  const barHeights = [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120];
  const widths = [4, 8, 3, 6, 10, 4, 7, 3, 9, 5, 4, 8, 3, 10, 5, 7, 4, 9];
  let x = startX;
  context.fillStyle = "#111827";
  widths.forEach((width, index) => {
    if (index % 2 === 0) context.fillRect(x, startY, width, barHeights[index]);
    x += width + 8;
  });

  if (tight) {
    context.fillStyle = "#111827";
    context.fillRect(0, startY, 10, 120);
    context.fillRect(x + 8, startY, 10, 120);
  }

  context.fillStyle = "#475569";
  context.font = "18px sans-serif";
  context.fillText(tight ? "Too-tight quiet zone sample" : "Good quiet zone sample", 24, 225);
  return canvas.toDataURL("image/png");
}

export function BarcodeQuietZoneChecker({ locale = defaultLocale }: { locale?: Locale }) {
  const c = locale === "zh" ? copy.zh : copy.en;
  const license = useStoredLicense();
  const [manualLeft, setManualLeft] = useState("0.16");
  const [manualRight, setManualRight] = useState("0.16");
  const [manualTop, setManualTop] = useState("0.12");
  const [manualBottom, setManualBottom] = useState("0.12");
  const [unit, setUnit] = useState<Unit>("in");
  const [dpi, setDpi] = useState("203");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualTouched, setManualTouched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasAnalysisInput = Boolean(report) || manualTouched;

  const measurements = useMemo<QuietZoneMeasurements>(() => {
    if (report?.region) {
      return {
        leftMm: report.region.leftMm,
        rightMm: report.region.rightMm,
        topMm: report.region.topMm,
        bottomMm: report.region.bottomMm,
      };
    }

    return {
      leftMm: valueToMm(manualLeft, unit),
      rightMm: valueToMm(manualRight, unit),
      topMm: valueToMm(manualTop, unit),
      bottomMm: valueToMm(manualBottom, unit),
    };
  }, [manualBottom, manualLeft, manualRight, manualTop, report, unit]);

  const result = useMemo(() => {
    const moduleRequirement = report?.region ? report.region.moduleWidthMm * 4 : 0;
    const minimumMm = Math.max(MIN_LINEAR_QUIET_ZONE_MM, moduleRequirement);
    const values = [measurements.leftMm, measurements.rightMm, measurements.topMm, measurements.bottomMm];
    const shortestMm = Math.min(...values);
    const pass = values.every((value) => value >= minimumMm);
    return { minimumMm, pass, shortestMm };
  }, [measurements, report]);

  const sideRows = [
    [c.sides.left, measurements.leftMm],
    [c.sides.right, measurements.rightMm],
    [c.sides.top, measurements.topMm],
    [c.sides.bottom, measurements.bottomMm],
  ] as const;

  async function analyzeImage(input: { name: string; image: HTMLImageElement; dataUrl: string }) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = Math.min(1, 1400 / Math.max(input.image.naturalWidth, input.image.naturalHeight));
    canvas.width = Math.max(1, Math.round(input.image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(input.image.naturalHeight * scale));

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas is unavailable.");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(input.image, 0, 0, canvas.width, canvas.height);

    const region = analyzeCanvas(canvas, parseNumber(dpi));
    setManualTouched(false);
    setReport({
      name: input.name,
      dataUrl: input.dataUrl,
      region,
      warning: region ? undefined : c.warning,
    });
  }

  async function analyzeFile(file: File) {
    if (!file.type.startsWith("image/") || !/(png|jpe?g)$/i.test(file.type)) {
      setError(c.invalidFile);
      return;
    }

    setBusy(true);
    setError("");
    setReport(null);

    try {
      const loaded = await loadImage(file);
      await analyzeImage({ name: file.name, ...loaded });
    } catch {
      setError(c.analyzeFailed);
    } finally {
      setBusy(false);
    }
  }

  async function runSample(tight: boolean) {
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const loaded = await loadDataUrl(createBarcodeSample(tight));
      await analyzeImage({ name: tight ? c.tightSampleName : c.goodSampleName, ...loaded });
    } catch {
      setError(c.sampleFailed);
    } finally {
      setBusy(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void analyzeFile(file);
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
    if (file) {
      event.preventDefault();
      void analyzeFile(file);
    }
  }

  const overlayStyle = report?.region
    ? {
        left: `${(report.region.x / report.region.imageWidth) * 100}%`,
        top: `${(report.region.y / report.region.imageHeight) * 100}%`,
        width: `${(report.region.width / report.region.imageWidth) * 100}%`,
        height: `${(report.region.height / report.region.imageHeight) * 100}%`,
      }
    : undefined;

  return (
    <PaidToolGate feature={locale === "zh" ? "条码空白区检查器" : "Barcode quiet-zone checker"} locale={locale}>
      <MemberFeatureShell locale={locale} unlocked={license.verified} title={c.vipTitle} description={c.vipText} onPaste={handlePaste}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
            <p className="font-bold">{c.privacyTitle}</p>
            <p className="mt-1 text-emerald-700">{c.privacyText}</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {c.steps.map((step, index) => (
              <div key={step} className="rounded-2xl bg-[#f7fbff] p-3 text-sm font-bold text-[#12324A] ring-1 ring-sky-100">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-800">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {hasAnalysisInput ? (
          <div className={`rounded-3xl p-5 ring-1 ${result.pass ? "bg-emerald-50 text-emerald-900 ring-emerald-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
            <p className="text-sm font-black uppercase tracking-[0.18em]">{c.verdictLabel}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-3xl font-black">{result.pass ? c.ok : c.risky}</p>
              <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold ring-1 ring-current/10">{formatMeasurement(result.shortestMm, unit)}</span>
            </div>
            <p className="mt-3 text-sm leading-6">
              {c.summaryPrefix}: {formatMeasurement(result.shortestMm, unit)}. {c.targetPrefix}: {formatMeasurement(result.minimumMm, unit)} {c.summarySuffix}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl bg-sky-50 p-5 text-sky-950 ring-1 ring-sky-100">
            <p className="text-sm font-black uppercase tracking-[0.18em]">{c.verdictLabel}</p>
            <p className="mt-3 text-3xl font-black">{c.pending}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{c.waitingText}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <label className="block rounded-3xl border border-dashed border-sky-300 bg-sky-50/70 p-6 text-center transition hover:bg-sky-50">
            <span className="block text-sm font-bold text-[#12324A]">{c.uploadTitle}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">{c.uploadText}</span>
            <input type="file" accept="image/png,image/jpeg" className="mt-4 text-sm" onChange={handleFileChange} />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => void runSample(false)} className="rounded-2xl bg-emerald-50 p-4 text-left text-sm font-bold text-emerald-900 ring-1 ring-emerald-100 transition hover:-translate-y-0.5">
              {c.goodDemo}
              <span className="mt-1 block font-normal leading-5 text-emerald-800">{c.goodDemoText}</span>
            </button>
            <button type="button" onClick={() => void runSample(true)} className="rounded-2xl bg-amber-50 p-4 text-left text-sm font-bold text-amber-900 ring-1 ring-amber-100 transition hover:-translate-y-0.5">
              {c.tightDemo}
              <span className="mt-1 block font-normal leading-5 text-amber-800">{c.tightDemoText}</span>
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-sky-100">
            <label>
              <span className="text-sm font-bold text-[#12324A]">{c.dpi}</span>
              <input value={dpi} onChange={(event) => setDpi(event.target.value)} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-[#12324A] shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none" inputMode="decimal" />
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-500">{c.dpiHelp}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-[#fffdf7] p-4">
            <button type="button" onClick={() => setShowManual((value) => !value)} className="text-sm font-bold text-[#12324A] hover:underline">
              {showManual ? c.hideManual : c.showManual}
            </button>
            {showManual ? (
              <div className="mt-4">
                <label>
                  <span className="text-sm font-bold text-[#12324A]">{c.manualUnit}</span>
                  <select value={unit} onChange={(event) => {
                    setUnit(event.target.value as Unit);
                    setManualTouched(true);
                    setReport(null);
                  }} className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-[#12324A] shadow-sm focus:border-amber-300 focus:outline-none">
                    <option value="in">{c.inches}</option>
                    <option value="mm">{c.millimeters}</option>
                  </select>
                </label>
                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                  <ManualInput label={c.sides.left} value={manualLeft} onChange={(value) => {
                    setManualLeft(value);
                    setManualTouched(true);
                    setReport(null);
                  }} />
                  <ManualInput label={c.sides.right} value={manualRight} onChange={(value) => {
                    setManualRight(value);
                    setManualTouched(true);
                    setReport(null);
                  }} />
                  <ManualInput label={c.sides.top} value={manualTop} onChange={(value) => {
                    setManualTop(value);
                    setManualTouched(true);
                    setReport(null);
                  }} />
                  <ManualInput label={c.sides.bottom} value={manualBottom} onChange={(value) => {
                    setManualBottom(value);
                    setManualTouched(true);
                    setReport(null);
                  }} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
          <h2 className="text-sm font-bold text-[#12324A]">{c.overlay}</h2>
          {report ? (
            <div className="mt-3">
              <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-sky-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- user-selected local data URLs cannot be optimized by next/image. */}
                <img src={report.dataUrl} alt={c.previewAlt} className="h-auto w-full" />
                {overlayStyle ? <div className="absolute border-2 border-rose-500 bg-rose-500/10" style={overlayStyle} /> : null}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-600">{c.overlayHelp}</p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-white p-6 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">{c.emptyOverlay}</div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {busy ? <p className="mt-4 text-sm font-medium text-slate-600">{c.busy}</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}
      {report?.warning ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-800">{report.warning}</p> : null}
      {hasAnalysisInput && !license.verified ? <div className="mt-4"><MemberLockedCallout locale={locale} text={c.lockedReport} /></div> : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-sky-100">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">{c.measurementsTitle}</p>
          <div className="mt-4 grid gap-3">
            {hasAnalysisInput ? sideRows.map(([label, value]) => {
              const passed = value >= result.minimumMm;
              return (
                <div key={label} className="rounded-2xl bg-[#f7fbff] p-4 ring-1 ring-sky-100">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-[#12324A]">{label}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{passed ? c.pass : c.fail}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{c.measured}: <span className="font-bold text-[#12324A]">{formatMeasurement(value, unit)}</span> · {c.required}: {formatMeasurement(result.minimumMm, unit)}</p>
                </div>
              );
            }) : (
              <div className="rounded-2xl bg-[#f7fbff] p-4 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">
                <p className="font-bold text-[#12324A]">{c.waitingTitle}</p>
                <p className="mt-1">{c.waitingText}</p>
              </div>
            )}
          </div>
        </div>

        {hasAnalysisInput ? (
          <div className={`rounded-3xl p-5 ring-1 ${result.pass ? "bg-emerald-50 text-emerald-900 ring-emerald-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
            <p className="text-sm font-bold">{result.pass ? c.fixTitleOk : c.fixTitleRisk}</p>
            <p className="mt-2 text-sm leading-6">{result.pass ? c.fixTextOk : c.fixTextRisk}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={safeLocalizedPath(result.pass ? "/test-print" : "/tools/pdf-analyzer", locale)} className="rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">
                {result.pass ? c.primaryOk : c.primaryRisk}
              </Link>
              <Link href={safeLocalizedPath("/tools/scale-calculator", locale)} className="rounded-full border border-slate-300 bg-white/40 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white">{c.fixScale}</Link>
              <Link href={safeLocalizedPath("/test-print", locale)} className="rounded-full border border-slate-300 bg-white/40 px-4 py-2 text-sm font-bold text-[#12324A] hover:bg-white">{c.printPack}</Link>
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/70 p-4"><dt className="text-sm text-slate-600">{c.detectedType}</dt><dd className="mt-1 font-semibold text-[#12324A]">{report?.region?.type ?? c.manualType}</dd></div>
              <div className="rounded-2xl bg-white/70 p-4"><dt className="text-sm text-slate-600">{c.file}</dt><dd className="mt-1 font-semibold text-[#12324A]">{report?.name ?? c.noImage}</dd></div>
            </dl>
          </div>
        ) : (
          <div className="rounded-3xl bg-sky-50 p-5 text-sky-950 ring-1 ring-sky-100">
            <p className="text-sm font-bold">{c.waitingTitle}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{c.waitingText}</p>
          </div>
        )}
      </div>
      </MemberFeatureShell>
    </PaidToolGate>
  );
}

function ManualInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2" inputMode="decimal" />
    </label>
  );
}
