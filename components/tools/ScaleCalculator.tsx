"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

type Symptom = "too_small" | "too_large" | "cut_off" | "not_centered" | "barcode";

const copy = {
  en: {
    title: "Use matching measurements",
    eyebrow: "Calculator",
    intro: "Measure width-to-width or height-to-height. For a 4×6 label, the 4-inch width is usually easiest to measure.",
    current: "Printed size now (inches)",
    currentHelp: "Example: the 4-inch edge printed as 3.8.",
    target: "Target size (inches)",
    targetHelp: "Example: the same edge should be 4.",
    resultLabel: "Use this print scale",
    empty: "Enter two positive sizes",
    resultHelp: "If your driver only supports whole numbers, round to the nearest percent and run a blank calibration print before printing paid postage.",
    symptomTitle: "What went wrong?",
    symptoms: { too_small: "Too small", too_large: "Too large", cut_off: "Cut off", not_centered: "Not centered", barcode: "Barcode won’t scan" },
    guidance: {
      too_small: { title: "Disable Fit to Page first", text: "If the label is smaller than expected, use Actual Size / 100%, then try the calculated scale only after one measured test.", href: "/fit-to-page-vs-actual-size-shipping-label", cta: "Read scale guide" },
      too_large: { title: "Check paper size before shrinking", text: "Oversized labels often come from printing a 4×6 file on the wrong media. Confirm setup before lowering scale.", href: "/#checker", cta: "Check setup" },
      cut_off: { title: "Fix paper, orientation or margins", text: "Cut-off output is usually not a scale problem. Run calibration and confirm the printer can image the full label area.", href: "/tools/calibration-sheet", cta: "Print calibration sheet" },
      not_centered: { title: "Separate alignment from scale", text: "If the size is right but the label is shifted, test roll alignment, guides and driver offsets.", href: "/4x6-shipping-label-template", cta: "Download 4×6 template" },
      barcode: { title: "Fix scale, then quiet zone", text: "A barcode can fail from shrink, blur, glare or missing whitespace. Confirm scale first, then check the barcode image.", href: "/tools/barcode-quiet-zone-checker", cta: "Check quiet zone" },
    },
  },
  zh: {
    title: "使用同一边测量",
    eyebrow: "计算器",
    intro: "请用宽度对宽度，或高度对高度。对于 4×6 标签，通常测量 4 英寸宽边最容易。",
    current: "当前打印尺寸（英寸）",
    currentHelp: "例如：4 英寸边打印成了 3.8。",
    target: "目标尺寸（英寸）",
    targetHelp: "例如：同一条边应该是 4。",
    resultLabel: "使用这个打印比例",
    empty: "请输入两个正数尺寸",
    resultHelp: "如果驱动只支持整数，四舍五入到最近百分比，并先打印空白校准页，再打印已付运费。",
    symptomTitle: "打印出了什么问题？",
    symptoms: { too_small: "太小", too_large: "太大", cut_off: "被裁切", not_centered: "未居中", barcode: "条码无法扫描" },
    guidance: {
      too_small: { title: "先关闭适合页面", text: "如果标签比预期小，请先使用实际大小 / 100%，测量一次测试后再尝试计算出的比例。", href: "/fit-to-page-vs-actual-size-shipping-label", cta: "阅读比例指南" },
      too_large: { title: "缩小前先检查纸张尺寸", text: "标签过大常来自用错误介质打印 4×6 文件。降低比例前先确认设置。", href: "/#checker", cta: "检查设置" },
      cut_off: { title: "修复纸张、方向或边距", text: "被裁切通常不是比例问题。先运行校准页，确认打印机能覆盖完整标签区域。", href: "/tools/calibration-sheet", cta: "打印校准页" },
      not_centered: { title: "区分对齐和比例问题", text: "如果尺寸正确但标签偏移，请测试卷纸对齐、导纸器和驱动偏移。", href: "/4x6-shipping-label-template", cta: "下载 4×6 模板" },
      barcode: { title: "先修比例，再查空白区", text: "条码失败可能来自缩小、模糊、反光或空白区不足。先确认比例，再检查条码图片。", href: "/tools/barcode-quiet-zone-checker", cta: "检查空白区" },
    },
  },
} satisfies Record<"en" | "zh", {
  title: string;
  eyebrow: string;
  intro: string;
  current: string;
  currentHelp: string;
  target: string;
  targetHelp: string;
  resultLabel: string;
  empty: string;
  resultHelp: string;
  symptomTitle: string;
  symptoms: Record<Symptom, string>;
  guidance: Record<Symptom, { title: string; text: string; href: string; cta: string }>;
}>;

export function ScaleCalculator({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = locale === "zh" ? copy.zh : copy.en;
  const [current, setCurrent] = useState("3.8");
  const [target, setTarget] = useState("4");
  const [symptom, setSymptom] = useState<Symptom>("too_small");

  const scale = useMemo(() => {
    const currentValue = Number.parseFloat(current);
    const targetValue = Number.parseFloat(target);
    if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue) || currentValue <= 0 || targetValue <= 0) return null;
    return Math.round((targetValue / currentValue) * 1000) / 10;
  }, [current, target]);
  const guidance = pageCopy.guidance[symptom];

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.intro}</p>
      </div>
      <fieldset className="mt-5 rounded-2xl bg-[#fffdf7] p-4 ring-1 ring-amber-100">
        <legend className="text-sm font-bold text-[#12324A]">{pageCopy.symptomTitle}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {(Object.keys(pageCopy.symptoms) as Symptom[]).map((item) => (
            <label key={item} className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm font-medium text-slate-700">
              <input type="radio" name="scale-symptom" checked={symptom === item} onChange={() => setSymptom(item)} className="accent-slate-900" />
              {pageCopy.symptoms[item]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.current}</span>
          <input value={current} onChange={(event) => setCurrent(event.target.value)} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none" inputMode="decimal" aria-describedby="current-size-help" />
          <span id="current-size-help" className="mt-1 block text-xs leading-5 text-slate-500">{pageCopy.currentHelp}</span>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.target}</span>
          <input value={target} onChange={(event) => setTarget(event.target.value)} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none" inputMode="decimal" aria-describedby="target-size-help" />
          <span id="target-size-help" className="mt-1 block text-xs leading-5 text-slate-500">{pageCopy.targetHelp}</span>
        </label>
      </div>
      <div className="mt-6 rounded-3xl bg-[#f7fbff] p-5 ring-1 ring-sky-100">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">{pageCopy.resultLabel}</p>
        <p className="mt-2 text-4xl font-black text-[#12324A]">{scale ? `${scale}%` : pageCopy.empty}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{pageCopy.resultHelp}</p>
      </div>

      <div className="mt-5 rounded-3xl border border-amber-200 bg-[#fffdf7] p-5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Next best step</p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-[#12324A]">{guidance.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{guidance.text}</p>
        <Link href={safeLocalizedPath(guidance.href, locale)} className="mt-4 inline-block rounded-full bg-[#12324A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1d4d70]">
          {guidance.cta}
        </Link>
      </div>
    </section>
  );
}
