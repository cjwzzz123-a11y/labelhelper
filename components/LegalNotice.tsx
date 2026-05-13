import Link from "next/link";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    shipTitle: "Verify before you ship",
    shipText: "This tool helps with label sizing and PDF formatting only. It does not generate postage, validate customs compliance, or detect printer and paper problems on your side. Before shipping, scan the barcode and verify addresses, customs text, tracking numbers and final label size.",
    downloadTitle: "Download does not mean ship-ready",
    downloadText: "Before using any downloaded PDF on a real package, test-scan the barcode, confirm the printed size, and check every address and customs field. If anything looks wrong, do not ship with that output.",
    refundTitle: "Refund-friendly, not loss coverage",
    refundText: "If a paid tool does not work for you, request a refund under the refund policy. Shipping costs, returned packages, customs holds, penalties and marketplace losses remain your responsibility.",
    legalLinks: "Terms and refund policy",
  },
  zh: {
    shipTitle: "寄件前请自行核对",
    shipText: "本工具只辅助检查标签尺寸和 PDF 排版，不生成邮资、不验证海关合规，也无法检测你本地打印机和纸张问题。寄件前请扫码测试条码，并核对地址、海关信息、追踪号和最终标签尺寸。",
    downloadTitle: "下载不等于可以直接寄出",
    downloadText: "任何下载的 PDF 用在真实包裹前，都必须测试条码能否扫出、确认打印尺寸，并核对所有地址和海关字段。发现异常时，请不要使用该输出寄件。",
    refundTitle: "可以退款，但不承担寄件损失",
    refundText: "如果付费工具不适合你，可按退款政策申请退款。运费、退件、海关扣留、罚款和平台损失仍由你自行承担。",
    legalLinks: "服务条款和退款政策",
  },
};

function getCopy(locale: Locale) {
  return locale === "zh" ? copy.zh : copy.en;
}

export function ShippingResponsibilityNotice({ locale = defaultLocale, className = "" }: { locale?: Locale; className?: string }) {
  const c = getCopy(locale);

  return (
    <section className={`rounded-3xl border border-amber-200 bg-[#fffdf7] p-5 text-amber-950 ${className}`}>
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-black tracking-tight">{c.shipTitle}</h2>
          <p className="mt-2 text-sm leading-6">{c.shipText}</p>
          <p className="mt-3 text-sm font-semibold">
            <Link href={safeLocalizedPath("/terms", locale)} className="underline">{c.legalLinks}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function DownloadResponsibilityNotice({ locale = defaultLocale, compact = false }: { locale?: Locale; compact?: boolean }) {
  const c = getCopy(locale);

  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 text-amber-950 ${compact ? "p-3 text-xs leading-5" : "p-4 text-sm leading-6"}`}>
      <div className="flex gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
        <div>
          <p className="font-black">{c.downloadTitle}</p>
          <p className="mt-1">{c.downloadText}</p>
        </div>
      </div>
    </div>
  );
}

export function RefundBoundaryNotice({ locale = defaultLocale, compact = false }: { locale?: Locale; compact?: boolean }) {
  const c = getCopy(locale);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white text-slate-700 ${compact ? "p-3 text-xs leading-5" : "p-4 text-sm leading-6"}`}>
      <p className="font-black text-slate-950">{c.refundTitle}</p>
      <p className="mt-1">{c.refundText}</p>
    </div>
  );
}
