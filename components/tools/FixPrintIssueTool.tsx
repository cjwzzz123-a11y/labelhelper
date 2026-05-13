"use client";

import { useState } from "react";
import { BarcodeQuietZoneChecker } from "@/components/tools/BarcodeQuietZoneChecker";
import { PdfAnalyzer } from "@/components/tools/PdfAnalyzer";
import { ScaleCalculator } from "@/components/tools/ScaleCalculator";
import { defaultLocale, type Locale } from "@/lib/i18n";

type Issue = "scale" | "pdf" | "barcode";

const copy = {
  en: {
    eyebrow: "Problem finder",
    title: "Start from the visible symptom",
    intro: "Use this order: choose what you can see, confirm why this tool is the right one, then run only that diagnostic. Setup checks stay on the home page; physical test prints stay in Test Print.",
    choose: "1 · Choose the symptom",
    run: "2 · Run this check",
    why: "Why this check",
    issues: {
      scale: {
        label: "Too small or too large",
        text: "Measure one edge and calculate the print percentage to try next.",
        tool: "Scale calculator",
        why: "Use this when the whole label is consistently smaller or larger. It answers: what print scale should I try next?",
      },
      pdf: {
        label: "PDF size, cut off or not centered",
        text: "Upload the label PDF and check whether the file size matches the paper before changing printer settings.",
        tool: "PDF page-size check",
        why: "Use this before blaming the printer. It answers: is the PDF itself the expected 4×6, A4 or Letter size?",
      },
      barcode: {
        label: "Barcode will not scan",
        text: "Upload or paste a label image and check barcode quiet-zone risk.",
        tool: "Barcode quiet-zone check",
        why: "Use this after scale looks correct. It answers: is there enough blank space around the barcode for scanners?",
      },
    },
    current: "Selected check",
  },
  zh: {
    eyebrow: "问题定位",
    title: "从肉眼看到的症状开始",
    intro: "按这个顺序使用：先选择你看到的问题，再确认为什么用这个工具，然后只运行对应诊断。打印前设置留在首页，实物测试留在测试打印页。",
    choose: "1 · 选择症状",
    run: "2 · 运行这个检查",
    why: "为什么用这个检查",
    issues: {
      scale: {
        label: "太小或太大",
        text: "测量同一条边，计算下一次应该尝试的打印百分比。",
        tool: "比例计算",
        why: "当整张标签整体变小或变大时用它。它回答的问题是：下一次应该尝试多少打印比例？",
      },
      pdf: {
        label: "PDF 尺寸、裁切或不居中",
        text: "上传标签 PDF，先确认文件尺寸是否匹配纸张，再改打印机设置。",
        tool: "PDF 页面尺寸检查",
        why: "先别急着怪打印机。它回答的问题是：PDF 本身是不是预期的 4×6、A4 或 Letter 尺寸？",
      },
      barcode: {
        label: "条码扫不出来",
        text: "上传或粘贴标签图片，检查条码空白区风险。",
        tool: "条码空白区检查",
        why: "当比例看起来正确但条码仍失败时用它。它回答的问题是：条码周围是否有足够空白给扫描器识别？",
      },
    },
    current: "当前检查",
  },
} satisfies Record<"en" | "zh", {
  eyebrow: string;
  title: string;
  intro: string;
  choose: string;
  run: string;
  why: string;
  issues: Record<Issue, { label: string; text: string; tool: string; why: string }>;
  current: string;
}>;

const issueOrder: Issue[] = ["scale", "pdf", "barcode"];

export function FixPrintIssueTool({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = locale === "zh" ? copy.zh : copy.en;
  const [issue, setIssue] = useState<Issue>("scale");
  const selected = pageCopy.issues[issue];

  return (
    <section>
      <div className="grid gap-6">
        <header className="rounded-[2rem] bg-white p-5 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{pageCopy.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{pageCopy.intro}</p>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-amber-700">{pageCopy.choose}</p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {issueOrder.map((item) => {
              const active = item === issue;
              const issueCopy = pageCopy.issues[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setIssue(item)}
                  className={`min-h-32 rounded-2xl p-4 text-left ring-1 transition ${active ? "bg-[#12324A] text-white ring-[#12324A]" : "bg-[#f7fbff] text-slate-700 ring-sky-100 hover:-translate-y-0.5 hover:bg-sky-50"}`}
                >
                  <span className="block text-sm font-black">{issueCopy.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${active ? "text-slate-200" : "text-slate-500"}`}>{issueCopy.text}</span>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-white text-[#12324A]" : "bg-white text-sky-800 ring-1 ring-sky-100"}`}>{issueCopy.tool}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid gap-4">
          <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">{pageCopy.run}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight">{selected.tool}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selected.text}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-200">{pageCopy.why}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{selected.why}</p>
              </div>
            </div>
          </div>
          {issue === "scale" ? <ScaleCalculator locale={locale} /> : null}
          {issue === "pdf" ? <PdfAnalyzer locale={locale} /> : null}
          {issue === "barcode" ? <BarcodeQuietZoneChecker locale={locale} /> : null}
        </div>
      </div>
    </section>
  );
}
