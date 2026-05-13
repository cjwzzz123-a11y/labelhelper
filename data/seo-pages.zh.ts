import type { Carrier, Platform } from "./rules";
import type { FAQItem } from "@/components/FAQ";
import type { RelatedLink } from "@/components/RelatedLinks";
import type { SeoPage, SeoPageKind, TroubleshooterStep } from "./seo-pages";

const commonRelated: RelatedLink[] = [
  { href: "/#checker", title: "运单标签尺寸检查器", description: "打印前检查纸张、比例和方向。" },
  { href: "/4x6-shipping-label-template", title: "4×6 标签模板", description: "下载空白 4×6 运单标签模板。" },
  { href: "/shipping-label-printing-too-small", title: "标签打印过小", description: "修复标签过小、缩放问题和错误打印设置。" },
];

function platformPage(slug: string, name: string, platform: Platform, carrier: Carrier = "usps"): SeoPage {
  return {
    slug,
    kind: "platform",
    title: `${name} 运单标签尺寸 — 2026 指南`,
    description: `查找 ${name} 运单标签适合的尺寸、打印比例、纸张和打印机设置，覆盖 4×6、Letter 和 A4 标签。`,
    h1: `${name} 运单标签尺寸`,
    quickAnswer: `${name} 卖家通常使用 4 × 6 英寸标签并在热敏打印机上以 100% 比例打印最稳妥。Letter 和 A4 也可用于纸张打印，但需要关闭缩放，并确保条码空白区没有被裁切。`,
    defaultCombo: { platform, carrier },
    sections: [
      { heading: `${name} 运单标签应该用什么尺寸？`, body: `对多数 ${name} 卖家来说，4 × 6 英寸运单标签是最实用的目标尺寸，因为它匹配常见热敏打印机和承运商扫描流程。如果使用激光或喷墨打印机，请将下载的标签 PDF 以 100% / 实际大小打印在 Letter 或 A4 纸上，并且只在条码和地址区域之外裁切或折叠。` },
      { heading: `${name} 的最佳打印设置`, body: "从 100% 比例、纵向和与 PDF 或标签卷匹配的纸张尺寸开始。避免浏览器页眉页脚、“适合页面”、“缩小过大页面”和会悄悄调整 PDF 大小的打印机默认设置。如果预览居中但纸面输出偏移，先打印空白模板，把打印机对齐问题和标签文件问题分开。" },
      { heading: `${name} 常见打印问题`, body: "标签过小通常说明打印对话框缩小了 PDF。标签被裁切通常说明纸张尺寸、卷纸宽度或方向错误。条码模糊或无法扫描通常与打印浓度过低、胶带反光、热敏纸质量差或条码空白区缺失有关。批量购买运费前，请先使用上方检查器。" },
      { heading: "发货前需要确认什么", body: "确认承运商名称、追踪条码、收件地址和退货地址清晰可读。如果这是新打印机、新标签卷或新电脑，请用尺子测量打印出的 4 × 6 边界。修复设置后尽量重打同一份标签 PDF，而不是在平台允许重打时重复购买运费。" },
    ],
    faq: commonFaq(name),
    related: commonRelated,
  };
}

function carrierPage(slug: string, name: string, carrier: Carrier): SeoPage {
  return {
    slug,
    kind: "carrier",
    title: `${name} 运单标签尺寸 — 完整指南`,
    description: `检查 ${name} 运单标签在热敏、喷墨和激光打印机上的推荐尺寸、比例和纸张设置。`,
    h1: `${name} 运单标签尺寸`,
    quickAnswer: `${name} 标签通常以 4 × 6 英寸热敏标签并按 100% 比例打印最稳妥。纸张打印也可以使用，但条码不能被缩放或裁切，标签也应平整贴在包裹上。`,
    defaultCombo: { platform: carrier === "usps" ? "usps_direct" : carrier === "ups" ? "ups_direct" : carrier === "fedex" ? "fedex_direct" : "dhl_direct", carrier },
    sections: [
      { heading: `${name} 标签是什么尺寸？`, body: `除非你的 ${name} 流程明确提供其他格式，否则热敏打印机优先使用 4 × 6 英寸。纸张打印请以 100% 比例打印在 Letter 或 A4 上，并保持条码空白区完整。不要裁切条码，也不要让条码折到包裹边缘。` },
      { heading: "热敏打印与纸张打印", body: "热敏打印机速度更快，也能减少缩放错误，因为卷纸尺寸通常与标签匹配。喷墨和激光打印机最好先下载承运商 PDF，在 PDF 阅读器中打开，并在打印前关闭缩小适配选项。" },
      { heading: "排查扫描问题", body: "如果标签被裁切、过小、未居中或无法扫描，先确认打印比例和纸张尺寸与生成的标签匹配。然后检查打印浓度、纸张质量、胶带反光，以及条码空白区是否被切掉。" },
      { heading: "承运商收件前检查", body: `投递 ${name} 包裹前，确认追踪条码清晰、服务文字可读，并且标签平整粘贴。如果更换了打印机、浏览器、PDF 阅读器或标签纸，请先打印空白测试页，再打印正式运单。` },
    ],
    faq: [
      { question: `${name} 标签可以打印成 4×6 吗？`, answer: "可以，4×6 是热敏运单标签的常见格式。" },
      { question: "为什么我的条码无法扫描？", answer: "条码可能被缩小、模糊、裁切，或缺少必要的空白区。" },
      { question: "从浏览器直接打印安全吗？", answer: "通常下载承运商 PDF，并以实际大小打印，比从浏览器预览直接打印更稳妥。" },
      { question: `${name} 条码上可以贴胶带吗？`, answer: "尽量避免在条码上覆盖亮面胶带，因为反光会降低扫描可靠性。必须使用时保持平整且无褶皱。" },
      { question: "更换打印机后应该检查什么？", answer: "运行 100% 比例测试打印，测量输出尺寸，并确认条码区域没有被裁切。" },
    ],
    related: commonRelated,
  };
}

function templatePage(slug: string, label: string): SeoPage {
  return {
    slug,
    kind: "template",
    title: `${label} 运单标签模板下载`,
    description: `下载空白 ${label} 运单标签模板，在打印承运商标签前检查打印比例。`,
    h1: `${label} 运单标签模板`,
    quickAnswer: `下载 ${label} 空白模板，以 100% 比例打印，并在打印真实运费前确认边缘和条码区域对齐。该模板仅用于校准，不会生成运费。`,
    sections: [
      { heading: `什么时候使用 ${label} 模板`, body: "使用空白模板确认打印机驱动、纸张、边距和方向，再打印真实运单标签。安装新打印机、更换浏览器、切换 PDF 阅读器或装入新标签卷后尤其有用。" },
      { heading: "打印设置", body: "使用 100% / 实际大小。关闭“适合页面”、“缩小过大页面”和浏览器页眉页脚。让打印对话框中的纸张尺寸匹配模板尺寸，然后检查边框是否按预期物理尺寸打印。" },
      { heading: "打印后", body: "用尺子测量输出。如果尺寸比预期更小或更大，请先使用比例计算器估算修正后的打印百分比，再重新打印模板。如果边框被裁切，请检查方向、边距，以及打印机是否支持该纸张尺寸的可打印区域。" },
      { heading: "它和真实运费标签有什么不同", body: "这个模板是空白测试文件，不包含承运商条码、追踪号、收件地址或运费付款。用它验证硬件和打印设置后，再从平台或承运商账户打印真实标签。" },
    ],
    faq: [
      { question: "这是运费标签吗？", answer: "不是。它是用于检查打印比例和对齐的空白测试模板。" },
      { question: "可以用于热敏打印机吗？", answer: "4×6 可以。A4 和 Letter 模板主要用于纸张打印机。" },
      { question: "应该以 100% 打印吗？", answer: "是的。校准时从 100% / 实际大小开始。" },
      { question: "如果打印出的模板略小怎么办？", answer: "使用比例计算器估算修正百分比，然后先重新打印模板，再打印运费标签。" },
      { question: "为什么模板边缘被裁切？", answer: "纸张尺寸、方向、驱动边距或可打印区域很可能与模板不匹配。先检查这些设置。" },
    ],
    related: commonRelated,
  };
}

function troubleshootingTree(slug: string): SeoPage["decisionTree"] {
  const shared = {
    headline: "重打前先找到原因",
    intro: "选择最接近你坏打印的症状。每一步都指向重买运费前最安全的下一步工具。",
    firstAction: "先用 100% / 实际大小打一张测试。",
  };
  const trees: Record<string, TroubleshooterStep[]> = {
    "shipping-label-printing-too-small": [
      { title: "整张标签变小", symptom: "4×6 边界大约只有 3.7×5.6，或条码看起来被压缩。", action: "关闭适合页面，选择实际大小；如果尺子测量仍不对，再计算修正比例。", href: "/tools/scale-calculator", cta: "计算修正比例" },
      { title: "从浏览器预览打印", symptom: "浏览器添加边距，或把 PDF 缩小到纸张内。", action: "先下载标签 PDF，用 PDF 阅读器按 100% 打印，再改平台设置。", href: "/tools/pdf-analyzer", cta: "检查 PDF 尺寸" },
      { title: "新打印机或新卷纸", symptom: "这台打印机打出的每张标签都略小。", action: "打印校准页，判断是驱动缩放还是标签文件问题。", href: "/tools/calibration-sheet", cta: "打印校准页" },
    ],
    "shipping-label-cut-off-when-printing": [
      { title: "缺少一边", symptom: "地址或条码在左、右、上、下任一边被裁掉。", action: "先让纸张尺寸和方向匹配 PDF，再考虑缩放。", href: "/#checker", cta: "检查纸张设置" },
      { title: "热敏卷纸跑偏", symptom: "第一张接近正常，后面的标签逐渐横向或纵向偏移。", action: "用空白模板区分卷纸对齐和可打印区域问题。", href: "/4x6-shipping-label-template", cta: "下载 4×6 模板" },
      { title: "普通打印机裁切", symptom: "Letter 或 A4 输出在不可打印边距附近裁掉标签。", action: "先运行校准页，确认打印机边距，再打印真实运费。", href: "/tools/calibration-sheet", cta: "打印校准页" },
    ],
    "shipping-label-barcode-not-scanning": [
      { title: "条码太小", symptom: "整张标签被缩小，或条码线条明显被压缩。", action: "先修复打印比例；整张标签尺寸不对时，条码检查不可靠。", href: "/tools/scale-calculator", cta: "修复打印比例" },
      { title: "空白区被裁掉", symptom: "条码贴近文字、标签边缘、胶带或包裹折角。", action: "使用图片检查器估算条码周围空白区。", href: "/tools/barcode-quiet-zone-checker", cta: "检查条码空白区" },
      { title: "打印发灰或反光", symptom: "条码褪色、有断线、起皱，或被亮面胶带覆盖。", action: "提高打印浓度或调整纸张/胶带后，先重打一张测试。", href: "/tools/test-print-pack", cta: "下载测试打印包" },
    ],
    "shipping-label-not-centered": [
      { title: "固定偏移", symptom: "每张标签都偏左、偏右、偏上或偏下。", action: "打印校准页，区分驱动偏移和平台标签布局问题。", href: "/tools/calibration-sheet", cta: "打印校准页" },
      { title: "介质尺寸错误", symptom: "预览居中，但实物输出偏移或旋转。", action: "先检查平台、承运商、纸张和打印机组合，再修改边距。", href: "/#checker", cta: "检查标签设置" },
      { title: "模板也偏移", symptom: "空白 4×6 测试也有同样的对齐问题。", action: "先修复导纸器、卷纸装载或驱动偏移，再重打运费。", href: "/4x6-shipping-label-template", cta: "下载 4×6 模板" },
    ],
    "fit-to-page-vs-actual-size-shipping-label": [
      { title: "选择打印比例", symptom: "适合页面在预览里看起来更安全，但会改变条码大小。", action: "先使用实际大小，再测量输出，不要只相信屏幕预览。", href: "/tools/scale-calculator", cta: "测量并计算" },
      { title: "不确定 PDF 尺寸", symptom: "标签文件可能是 Letter、A4 或 4×6，打印对话框在猜测。", action: "先本地读取 PDF 页面尺寸，再选择纸张或比例设置。", href: "/tools/pdf-analyzer", cta: "分析 PDF 尺寸" },
      { title: "需要安全测试", symptom: "你准备在新设置下打印真实已付运费。", action: "先打印带水印测试包，避免浪费真实标签。", href: "/tools/test-print-pack", cta: "下载测试包" },
    ],
  };

  return { ...shared, steps: trees[slug] ?? trees["shipping-label-printing-too-small"] };
}

function troublePage(slug: string, symptom: string, fix: string): SeoPage {
  return {
    slug,
    kind: "troubleshooter",
    title: `${symptom} — 运单标签打印修复方法`,
    description: `修复运单标签打印问题：${symptom}。检查比例、纸张、边距、方向和条码空白区。`,
    h1: `${symptom} — 如何修复`,
    quickAnswer: fix,
    decisionTree: troubleshootingTree(slug),
    sections: [
      { heading: "第 1 步：检查打印比例", body: "打开打印对话框，选择 100% 或实际大小。避免使用“适合页面”，因为它会缩小条码和标签边界。如果你从浏览器预览打印，请下载 PDF 后用 PDF 阅读器重试。" },
      { heading: "第 2 步：检查纸张和方向", body: "确认打印机里的纸张与标签 PDF 匹配。4×6 卷纸不应按 Letter 打印，Letter 纸也不应裁切标签区域。如果输出被旋转，先切换纵向/横向，再调整比例。" },
      { heading: "第 3 步：运行校准打印", body: "在购买新标签或重打运费前，先打印空白模板。如果模板也不对，承运商标签也会不对。测量打印边框并与目标尺寸对比。" },
      { heading: "第 4 步：决定下一步修哪里", body: "如果整张标签尺寸错误，修复比例。如果只有一边缺失，修复纸张尺寸、边距或卷纸对齐。如果尺寸正确但扫描失败，检查打印浓度、条码空白区、胶带反光和标签损坏。" },
    ],
    faq: [
      { question: "需要重新购买运费吗？", answer: "通常不需要。先修复打印设置，如果平台允许，再重打原始 PDF。" },
      { question: "为什么实际大小很重要？", answer: "条码扫描器需要条码和空白区保持在容差范围内。缩小可能导致扫描失败。" },
      { question: "胶带会导致扫描问题吗？", answer: "会。亮面胶带覆盖条码可能反光，降低扫描可靠性。" },
      { question: "如果很着急，应该先试什么？", answer: "下载标签 PDF，用 PDF 阅读器以 100% / 实际大小打印，并确认选择的纸张尺寸与打印机里的纸张一致。" },
      { question: "怎么判断是打印机问题还是标签文件问题？", answer: "以 100% 打印空白模板。如果模板也错误，请先修复打印机设置，再调整标签文件或购买新运费。" },
    ],
    related: commonRelated,
  };
}

function commonFaq(name: string): FAQItem[] {
  return [
    { question: `${name} 标签最佳尺寸是什么？`, answer: "4 × 6 英寸标签是热敏打印机和多数承运商流程最稳妥的默认选择。" },
    { question: "应该使用适合页面吗？", answer: "不建议。先使用 100% 或实际大小，避免条码被缩小。" },
    { question: "可以用普通打印机吗？", answer: "可以。使用 Letter 或 A4 纸，并确认打印出的条码清晰且未被裁切。" },
    { question: `为什么我的 ${name} 标签打印过小？`, answer: "常见原因是浏览器或 PDF 缩放。关闭适合页面，选择实际大小，并在重打前匹配纸张尺寸。" },
    { question: "打印坏了之后需要重新购买运费吗？", answer: "通常不需要。先修复打印设置，如果平台或承运商账户仍允许，再重打原始 PDF。" },
  ];
}

export const seoPagesZh: SeoPage[] = [
  platformPage("etsy-shipping-label-size", "Etsy", "etsy"),
  platformPage("shopify-shipping-label-size", "Shopify", "shopify"),
  platformPage("ebay-shipping-label-size", "eBay", "ebay"),
  platformPage("amazon-fba-label-size", "Amazon FBA", "amazon_fba", "ups"),
  carrierPage("usps-shipping-label-size", "USPS", "usps"),
  carrierPage("ups-label-size", "UPS", "ups"),
  carrierPage("fedex-label-size", "FedEx", "fedex"),
  carrierPage("dhl-shipping-label-size", "DHL", "dhl"),
  templatePage("4x6-shipping-label-template", "4×6"),
  templatePage("a4-shipping-label-template", "A4"),
  templatePage("letter-shipping-label-template", "Letter"),
  troublePage("shipping-label-printing-too-small", "运单标签打印过小", "标签过小多数由“适合页面”、纸张尺寸错误或浏览器边距设置导致。请以 100% / 实际大小重打；如果问题继续，先测量空白模板。"),
  troublePage("shipping-label-cut-off-when-printing", "运单标签打印时被裁切", "标签被裁切通常说明纸张尺寸、边距或方向与标签 PDF 不匹配。先修复这些设置，再更改运费或购买新标签卷。"),
  troublePage("shipping-label-barcode-not-scanning", "运单标签条码无法扫描", "条码扫描失败通常来自缩小、模糊、胶带反光或缺少空白区。先确认比例，再检查打印质量和粘贴位置。"),
  troublePage("shipping-label-not-centered", "运单标签没有居中", "标签偏移通常由打印机驱动偏移、卷纸对齐或页面边距设置导致。运行空白模板，把对齐问题和标签文件问题分开。"),
  troublePage("fit-to-page-vs-actual-size-shipping-label", "运单标签的适合页面 vs 实际大小", "先使用实际大小或 100%。即使预览在屏幕上看起来更整齐，“适合页面”也可能缩小标签并降低条码可靠性。"),
];

export const zhSeoPageKinds: Record<SeoPageKind, string> = {
  platform: "平台",
  carrier: "承运商",
  template: "模板",
  troubleshooter: "故障排查",
};
