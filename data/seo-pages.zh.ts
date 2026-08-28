import type { Carrier, Platform } from "./rules";
import type { FAQItem } from "@/components/FAQ";
import type { RelatedLink } from "@/components/RelatedLinks";
import type { SeoPage, SeoPageKind } from "./seo-pages";

const commonRelated: RelatedLink[] = [
  { href: "/#checker", title: "运单标签尺寸检查器", description: "打印前检查纸张、比例和方向。" },
  { href: "/4x6-shipping-label-template", title: "4×6 标签模板", description: "下载空白 4×6 运单标签模板。" },
  { href: "/shipping-label-printing-too-small", title: "标签打印过小", description: "修复标签过小、缩放问题和错误打印设置。" },
];

function platformPage(slug: string, name: string, platform: Platform, carrier: Carrier = "usps"): SeoPage {
  return {
    slug,
    kind: "platform",
    title: `${name} 运单标签尺寸指南`,
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
    title: `${name} 运单标签尺寸指南`,
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
  const content = label === "4×6" ? {
    quickAnswer: "用这份 4 × 6 英寸空白文件测试热敏标签卷或匹配的 4×6 单张纸。按 100% / 实际大小打印并测量两条边；只要 PDF 页面、驱动介质和实际纸张没有同时匹配 4×6，就先停止打印真实运费标签。",
    sections: [
      { heading: "用它测试 4×6 介质链路", body: "这份模板用于隔离常见热敏运单打印机或 4×6 单张介质的尺寸、走纸与对齐问题。更换标签卷、打印机、驱动、电脑或 PDF 阅读器后可先运行一次。它不证明承运商会接受某个条码，只验证物理打印链路。" },
      { heading: "让三处尺寸完全一致", body: "确认源 PDF 页面为 4 × 6 英寸、操作系统或打印机驱动选择 4×6、实际装入的介质也是 4×6。使用 100% / 实际大小，并关闭浏览器页眉页脚和“适合页面”。不要用自定义百分比掩盖错误的驱动介质。" },
      { heading: "根据失败形态定位原因", body: "边框整体等比偏小或偏大，更像缩放问题；每张都缺同一侧，更像介质宽度、导纸器或打印起点问题；缺边位置不断变化，更像走纸或感测问题。条线发淡或拉丝属于打印质量，不是页面尺寸证据。" },
      { heading: "通过重复测试后再重打", body: "完整测出 4 × 6 英寸边界，并在第二张空白测试中重复得到相同结果。若仍裁切或走纸变化，请按准确打印机型号的装纸与校准说明处理。空白文件不含地址、追踪号或已付运费。" },
    ],
    faq: [
      { question: "空白 4×6 PDF 是真实运单吗？", answer: "不是。它不含地址、追踪条码或运费，只是实体校准夹具。" },
      { question: "打印前哪三处必须一致？", answer: "PDF 页面、驱动介质设置和实际装入的纸张都应为 4 × 6 英寸。" },
      { question: "为什么整张测试都偏小？", answer: "更可能是“适合页面”、缩放或页面与驱动不匹配。先恢复相同尺寸和实际大小，再考虑比例修正。" },
      { question: "为什么缺边位置会变化？", answer: "位置变化更像导纸器、走纸或介质感测问题，应按准确型号的流程处理。" },
      { question: "什么时候可以重打真实运费标签？", answer: "有测量结果的空白测试能够无裁切重复通过后，再使用签发方允许的重打流程。" },
    ],
    reviewChecklist: ["确认 PDF、驱动和实际介质均为 4×6。", "按实际大小测量两条实体边。", "重打运费前要求空白测试可以重复通过。"],
  } : label === "A4" ? {
    quickAnswer: "用这份 210 × 297 毫米空白页测试 A4 纸张打印链路。选择 A4 和 100% / 实际大小，检查方向与不可打印边距；不要仅为适配其他介质，把流程要求保留的 A4 文档强行改成 4×6。",
    sections: [
      { heading: "只为 A4 源文件或 A4 流程使用", body: "这份模板验证本应输出 A4 页面时的喷墨或激光打印链路，适合在更换纸盒、驱动默认值或 PDF 阅读器后使用。真实 4×6 标签可以原尺寸放在更大纸张上，但把它拉伸填满 A4 会改变几何尺寸。" },
      { heading: "建立一致的纸张契约", body: "装入 A4 纸，在驱动中选择 A4，并按预期方向以 100% / 实际大小打印 A4 PDF；关闭浏览器页眉页脚。不要因为外观接近就选择 Letter：两种纸张的尺寸和可打印区域不同。" },
      { heading: "区分不可打印边距与比例错误", body: "所有测量值等比变化时，检查缩放；只有外边缘缺失、内部测量仍正确时，更可能触及打印机不可打印区域。优先使用签发方原生 A4 布局或打印机支持的边距方案，不要无依据缩小扫描关键内容。" },
      { heading: "保护多文档页面", body: "签发的 A4 文件可能包含多张标签、报关材料或其他必要内容。提取前检查每一页。空白模板无法判断文档语义，也不会授权裁掉或丢弃相邻内容。" },
    ],
    faq: [
      { question: "A4 的尺寸是多少？", answer: "A4 是 210 × 297 毫米；PDF 页面、驱动选择和实际纸张应一致。" },
      { question: "可以改选 Letter 吗？", answer: "不能把它用于这次尺寸测试。Letter 与 A4 不同，替换后可能造成裁切或意外留白。" },
      { question: "A4 页面应使用“适合页面”吗？", answer: "匹配 A4 纸张时从 100% / 实际大小开始。“适合页面”会改变几何尺寸并可能掩盖不匹配。" },
      { question: "可以把 A4 运单文档裁成 4×6 吗？", answer: "仅当签发流程明确识别出一张完整独立标签并允许这样做。若相邻内容必需或语义不清，请停止。" },
      { question: "外边框被裁切说明什么？", answer: "它可能暴露不可打印区域，但不能单独证明真实标签应该缩小；还需核对源流程与打印机说明。" },
    ],
    reviewChecklist: ["确认源文件、驱动和实际纸张都是 A4。", "检查所有页面和相邻必要内容。", "区分不可打印边距与真正比例错误。"],
  } : {
    quickAnswer: "用这份 8.5 × 11 英寸空白页测试 US Letter 纸张打印链路。选择 Letter 和 100% / 实际大小，检查方向与不可打印边距；较小的标签应保持源尺寸，不要为了填满整页而放大。",
    sections: [
      { heading: "为 Letter 源文件或纸张流程使用", body: "这份模板测试装入 8.5 × 11 英寸纸张的喷墨或激光打印机，可在更换纸盒、驱动或阅读器后运行。独立 4×6 标签可以保持原尺寸放在 Letter 上，不应只为占满纸面而放大。" },
      { heading: "匹配 PDF、驱动与纸盒", body: "在驱动中选择 Letter，以预期方向按 100% / 实际大小打印 Letter PDF；关闭浏览器页眉页脚和“适合页面”。不要静默替换为 A4：两者宽高和边距行为都不同。" },
      { heading: "不要靠缩小条码掩盖裁切", body: "整体等比错误指向缩放；内部测量正确但纸张外边缘缺失，指向方向或设备可打印区域。应先使用流程原生 Letter 布局或修正纸张选择，再考虑改变完整标签。" },
      { heading: "保持签发内容完整", body: "从真实 Letter PDF 剪裁或提取标签前，应检查每一页并确认文档类型。装箱单、报关表或多张唯一标签可能都是必要内容。空白测试只验证纸张链路，不授权删除签发内容。" },
    ],
    faq: [
      { question: "US Letter 的尺寸是多少？", answer: "US Letter 是 8.5 × 11 英寸；PDF、驱动和纸盒应使用同一尺寸。" },
      { question: "Letter 和 A4 相同吗？", answer: "不同。两者尺寸不同，互换可能改变边距或裁掉一侧。" },
      { question: "4×6 标签应该填满 Letter 纸吗？", answer: "不应该。真实 4×6 标签应保持 4 × 6 英寸，除非签发方提供另一种原生布局。" },
      { question: "为什么只有外边缘被裁切？", answer: "方向或不可打印区域可能是原因；改变标签内容比例前先确认这两项。" },
      { question: "什么时候应停止？", answer: "源尺寸不清、会移除必要相邻文档，或空白页仍无法匹配 Letter 链路时都应停止。" },
    ],
    reviewChecklist: ["确认 PDF、驱动和纸盒都是 Letter。", "让真实 4×6 标签保持原尺寸。", "提取内容前检查真实文件的每一页。"],
  };

  return {
    slug,
    kind: "template",
    title: `${label} 运单标签模板下载`,
    description: `下载空白 ${label} 运单标签模板，在打印承运商标签前检查打印比例。`,
    h1: `${label} 运单标签模板`,
    updatedAt: "2026-08-29",
    evidenceNote: "这套空白文件流程只验证实体尺寸、走纸和可打印边界；它不验证承运商条码、不授权转换文档，也不保证承运商验收。",
    ...content,
    related: commonRelated,
  };
}

type ReviewedTroublePage = Pick<SeoPage, "description" | "quickAnswer" | "updatedAt" | "evidenceNote" | "decisionTree" | "sections" | "faq" | "reviewChecklist" | "sources">;

const reviewedTroublePages: Record<string, ReviewedTroublePage> = {
  "shipping-label-printing-too-small": {
    description: "诊断运单标签为何打印过小，区分整页被压缩、真实 4×6 比例错误，以及热敏或普通打印机输出偏淡。",
    quickAnswer: "先判断是整张 Letter/A4 页面被压进 4×6 介质、真实 4×6 页面被等比缩小，还是只有打印质量偏弱。使用自定义比例前，让源页面、驱动介质和实体纸张相互匹配；空白测试通过后，再从未修改的原始 PDF 重打。",
    updatedAt: "2026-08-29",
    evidenceNote: "通用排错框架：Adobe 说明“适合”和“实际大小”的行为，Zebra 说明热敏介质校准。这些来源只支持诊断分支，不代表承运商验收结论，也不覆盖所有打印机型号。",
    decisionTree: {
      headline: "区分页面缩小与打印质量不佳",
      intro: "先测量页面边界，再按源 PDF、实体介质和打印症状所对应的分支处理。",
      firstAction: "确认源页面是 4×6、Letter 还是 A4 之前，不要放大标签。",
      steps: [
        { title: "PDF 页面比卷纸大", symptom: "整张 Letter 或 A4 页面被适配到一张 4×6 热敏标签上。", action: "检查 PDF 页面框。向签发方获取 4×6 格式，或只提取一个完整标签区域；不要放大已经微缩的输出。", href: "/tools/pdf-analyzer", cta: "检查 PDF 页面" },
        { title: "整个边界等比变小", symptom: "真实 4×6 源文件在匹配的 4×6 介质上按比例缩小。", action: "确认驱动设为 4×6，关闭“适合”，打印一次空白模板；只有介质路径已经匹配时，才计算修正比例。", href: "/tools/scale-calculator", cta: "测量比例误差" },
        { title: "只有条线或文字偏弱", symptom: "标签边界正确，但细线模糊、发灰或断裂。", action: "把它当作打印质量而非页面比例问题。再次打印真实标签前，测试浓度、速度、介质和打印头状态。", href: "/tools/test-print-pack", cta: "测试打印质量" },
      ],
    },
    sections: [
      { heading: "1. 判断变小的是页面还是打印内容", body: "调整比例前先读取 PDF 页面框。Letter 或 A4 页面若被适配到 4×6 卷纸，所有元素都会变小；真实 4×6 页面若打印成 3.8×5.7 英寸，则更像驱动或缩放发生变化。如果实体边界正确而细条偏弱，应转查打印质量，不要放大页面。" },
      { heading: "2. 按热敏打印机分支处理", body: "对于独立 4×6 源文件，让操作系统驱动和打印对话框都匹配已装入的 4×6 介质。关闭“适合”并打印空白 4×6 模板。模板也偏小时，先检查驱动介质和该型号的校准流程，再考虑自定义百分比。" },
      { heading: "3. 按喷墨或激光打印机分支处理", body: "在 Letter 或 A4 纸上，真实 4×6 标签应保持原定尺寸，而不是拉伸填满纸张。如果源文件本身就是整页布局，请选择同尺寸纸张。Adobe 将“适合”定义为缩放到可打印区域，将“实际大小”定义为不缩放，因此屏幕预览不能证明实体尺寸。" },
      { heading: "4. 重打真实标签前设置停止线", body: "若条码、周围留白、地址、追踪号或服务文字发生变化，不要使用过小的输出。保留原交易和原 PDF，先通过一次有测量结果的空白测试；签发方仍允许时，再走当前重打流程。不要为了排查打印设置而重复购买运费。" },
    ],
    faq: [
      { question: "为什么 Letter PDF 在热敏打印机上变得很小？", answer: "打印路径很可能把整张 Letter 页面适配到一张 4×6 标签。请获取签发方的 4×6 格式；只有文档结构允许时，才提取一个完整标签区域。" },
      { question: "应该把比例提高到 100% 以上吗？", answer: "只有 PDF 页面、驱动介质、实体纸张都匹配，而有测量结果的空白测试仍显示等比误差时才考虑。盲猜更高比例可能裁掉另一边。" },
      { question: "喷墨或激光打印有什么不同？", answer: "4×6 标签可以按原尺寸放在 Letter 或 A4 纸上。选择实际装入的纸张并保留标签边界，不要让标签填满整页。" },
      { question: "热敏打印有什么不同？", answer: "源页面和驱动应与卷纸匹配，打印机还可能需要按具体型号校准介质。不要把整张纸面布局适配到一张卷纸标签。" },
      { question: "什么时候应停止并重打？", answer: "任何扫描关键内容发生变化，或空白测试仍不正确时都应停止。只有修正后的设置通过测试，才重打原始标签。" },
    ],
    reviewChecklist: ["改变比例前先识别源 PDF 页面尺寸。", "按已装介质选择热敏或纸张打印分支。", "重打真实标签前，必须通过一次有测量结果的空白测试。"],
    sources: [
      { label: "Adobe Acrobat 打印页面大小设置", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe 定义“适合”“实际大小”“缩小过大页面”和自定义缩放的行为。" },
      { label: "Zebra SmartCal 介质校准", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra 说明代表性热敏打印机如何测量标签介质及感测参数。" },
    ],
  },
  "shipping-label-cut-off-when-printing": {
    description: "判断运单标签是在源 PDF、热敏走纸路径还是 Letter/A4 可打印区域中被裁切，并设置安全的重打门槛。",
    quickAnswer: "对比原始 PDF 和实物打印。如果文件里已经缺边，请回到签发流程重新生成；如果只有纸面输出被裁切，请分别走热敏卷纸或桌面纸张分支。不要为了露出缺失的条码边缘而缩小整张标签。",
    updatedAt: "2026-08-29",
    evidenceNote: "通用排错框架：Adobe 支持 PDF 尺寸行为判断，Zebra 支持热敏校准分支。具体按键、偏移量和可打印区域仍须以准确型号的打印机手册为准。",
    decisionTree: {
      headline: "找到边缘最早消失的位置",
      intro: "改变比例前先对比原始 PDF 和实体输出；源文件裁切与打印机裁切需要不同修复。",
      firstAction: "只要缺少条码、地址、服务或路由内容，就停止使用该打印件。",
      steps: [
        { title: "PDF 里已经缺少边缘", symptom: "下载的文件在进入打印对话框前就不完整。", action: "停止。回到生成它的订单或发货流程重新生成文档；打印缩放无法恢复源文件中不存在的内容。", href: "/tools/pdf-analyzer", cta: "检查源 PDF" },
        { title: "热敏打印总是裁掉同一边", symptom: "PDF 完整，但每张卷纸标签都丢失相同一侧。", action: "匹配驱动介质，重新装入并居中导纸器，然后校准打印机。不要缩小整个条码来掩盖起点或走纸错误。", href: "/tools/calibration-sheet", cta: "测试热敏对齐" },
        { title: "纸张边缘被裁切", symptom: "Letter 或 A4 输出触及打印机的不可打印区域。", action: "使用与源文件匹配的纸张尺寸和方向。先打印空白页面边界，再判断是否需要该流程原生的整页布局。", href: "/letter-shipping-label-template", cta: "测试纸张边界" },
      ],
    },
    sections: [
      { heading: "1. 定位最先缺失的边缘", body: "打印前打开未修改的 PDF 并检查每一页。如果条码、地址或服务标识在文件中已经缺失，请停止并返回签发方，因为任何打印设置都无法重建源内容。PDF 完整时，记录所选纸张、比例、方向以及被裁掉的实体边缘。" },
      { heading: "2. 诊断单侧热敏裁切", body: "每张 4×6 标签都丢失同一边时，请确认驱动介质，重新装入并居中导纸器，再运行文档所述的介质校准。若连续标签的裁切位置变化，应检查走纸感测或介质松动，而不是改变 PDF 比例。" },
      { heading: "3. 诊断 Letter 或 A4 边缘裁切", body: "桌面打印机可能存在不可打印边距。Adobe 说明“实际大小”不缩放，页面不适合所选纸张时可能被裁掉。请选择与源文件一致的纸张尺寸和方向，或重新生成流程原生的整页布局；“适合”只是通过缩小全部内容来掩盖边距问题。" },
      { heading: "4. 定义允许重打的条件", body: "相同阅读器、驱动和介质下的空白模板必须完整打印，才能重打付费标签。如果条码、空白区、追踪号、地址、服务文字或路由标识被裁切，请从原始 PDF 重打。源文件仍不完整时，应向签发方升级处理。" },
    ],
    faq: [
      { question: "怎么判断是 PDF 还是打印机裁掉了标签？", answer: "原始 PDF 已经缺边时需重新生成。PDF 完整，但空白模板和真实标签丢失同一边时，问题来自打印路径。" },
      { question: "为什么热敏标签总是缺少同一边？", answer: "固定缺边通常指向介质尺寸、导纸器、打印起点或校准。使用偏移设置前，请先按准确型号的手册操作。" },
      { question: "为什么不同标签被裁的位置会变化？", answer: "裁切边缘不断变化，更可能是走纸感测、卷纸漂移或导纸器松动，而不是静态 PDF 裁切。" },
      { question: "“适合页面”能解决纸张裁切吗？", answer: "它可以通过缩小整页来露出边缘，但也会改变条码。应优先使用匹配纸张或正确的源布局。" },
      { question: "什么时候必须停止？", answer: "有效内容缺失、模板仍被裁切或源 PDF 不完整时都应停止。修正责任路径后才可以重打。" },
    ],
    reviewChecklist: ["确认原始 PDF 中确实存在该边缘。", "根据裁切位置固定或变化选择对应打印机分支。", "重打运费前必须通过完整的空白模板打印。"],
    sources: [
      { label: "Adobe Acrobat 打印页面大小设置", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe 说明“实际大小”不缩放，并会裁掉无法装入纸张的页面或选区。" },
      { label: "Zebra SmartCal 介质校准", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra 说明代表性的间隙、黑标和连续热敏介质的感测与校准。" },
    ],
  },
  "shipping-label-barcode-not-scanning": {
    description: "从比例、条码空白区、对比度、损坏和打印输出诊断无法扫描的运单条码，不把测试结果表述为承运商批准。",
    quickAnswer: "把手机或手持设备扫描失败视为症状，而不是承运商结论。先恢复原始页面几何，再检查条码留白、对比度、条线损坏和平整粘贴。如果条码被缩放、裁切、拉出条纹、起皱或覆盖，请从原文件重打。",
    updatedAt: "2026-08-29",
    evidenceNote: "通用排错框架：GS1 列出常见条码质量因素，Zebra 说明一种热敏打印质量路径，承运商来源说明粘贴位置。本页不提供条码验证，也不保证承运商验收。",
    decisionTree: {
      headline: "先检查几何，再检查打印质量",
      intro: "条码可能因为整页发生变化、条线打印不良，或周围空间及粘贴位置受损而失效。",
      firstAction: "手机扫描只是诊断线索，不是标准验证或承运商验收。",
      steps: [
        { title: "标签被缩放或裁切", symptom: "打印边界与源文件不同，或条码周围留白消失。", action: "先修复页面尺寸和比例。整个符号已经改变时，扫描测试不能提供有效证据。", href: "/tools/scale-calculator", cta: "验证实体比例" },
        { title: "条线偏淡、断裂或扩散", symptom: "边界正确，但热敏条纹或油墨渗开改变了条线。", action: "运行打印质量测试。热敏打印检查介质、浓度、速度和打印头；喷墨或激光打印应使用清晰、高对比输出。", href: "/tools/test-print-pack", cta: "测试打印质量" },
        { title: "打印条码看起来清晰", symptom: "条码仍触及边缘、折痕、胶带或相邻文字，或者只有手机应用显示能扫。", action: "检查周围留白和平整粘贴。输出损坏时重打；交接是否会被接受仍不确定时，询问签发方或承运商。", href: "/tools/barcode-quiet-zone-checker", cta: "检查周围留白" },
      ],
    },
    sections: [
      { heading: "1. 扫描测试前先恢复几何", body: "把实体边界和条码与原始 PDF 对比。如果“适合”、截图、裁切或错误介质改变了符号或周围留白，请先修复页面尺寸和比例。反复扫描已经改变的输出并不能验证它。" },
      { heading: "2. 分别检查空白区、对比度和损坏", body: "GS1 将空白区尺寸、对比度、符号尺寸、条高、包装干扰、老化损坏和位置列为常见质量检查。应把它们当作诊断类别，而不是某一承运商条码的通用数值上限。" },
      { heading: "3. 区分热敏和纸张打印质量", body: "直接热敏输出应按具体型号手册测试介质、打印头、浓度和速度；Zebra 说明热量、速度和介质会共同影响质量。喷墨或激光输出应在合适白色介质上保持清晰黑色，并拒绝渗墨、缺线或低对比打印。" },
      { heading: "4. 条码被遮挡或结果不确定时停止", body: "让条码平整，远离折痕、接缝和亮面胶带。条线断裂、空白区缺失或标签损坏时请重打。手机相机扫出结果只是一项快速检查；交接仍不确定时，请询问签发平台或承运商。" },
    ],
    faq: [
      { question: "手机能扫出条码，就能证明运单会被接受吗？", answer: "不能。它只是诊断线索，不是标准验证或承运商批准。" },
      { question: "调整打印浓度前应该检查什么？", answer: "先确认页面边界和条码没有被缩放或裁切。几何错误应先于浓度调节处理。" },
      { question: "热敏打印机用户应该测试什么？", answer: "页面尺寸和校准正确后，按准确型号的流程测试介质、打印头、浓度和速度。" },
      { question: "喷墨或激光打印机用户应该测试什么？", answer: "检查黑白对比、条线边缘、渗墨、缺线和损坏，并让胶带和折痕远离条码。" },
      { question: "什么时候重打比继续扫码更安全？", answer: "符号被缩放、裁切、拉出条纹、模糊、起皱、浸湿或覆盖，或者缺少所需周围留白时，应重打。" },
    ],
    reviewChecklist: ["扫描测试前恢复标签原始几何。", "分别检查空白区、对比度、条线损坏和粘贴位置。", "损坏的输出应重打；不要把手机扫描当作批准。"],
    sources: [
      { label: "GS1 条码质量检查", url: "https://support.gs1.org/support/solutions/articles/43000734141-what-should-i-check-to-ensure-good-quality-barcodes-", checkedAt: "2026-08-29", supports: "GS1 将空白区、对比度、符号尺寸、条高、损坏、包装干扰和位置列为质量因素。" },
      { label: "Zebra 热敏打印质量调整", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/c-zd620-420-print-operations/t-zd421-zd621-ug-adjusting-the-print-quality.html", checkedAt: "2026-08-29", supports: "Zebra 说明代表性热敏打印机的热量或浓度、打印速度与已装介质之间的关系。" },
      { label: "FedEx 运单标签粘贴位置", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx 建议保持条码平整、远离接缝和边缘，并且不要覆盖透明胶带。" },
    ],
  },
  "shipping-label-not-centered": {
    description: "判断运单标签偏移只是视觉问题，还是由 PDF 布局、热敏走纸、驱动起点或纸张打印边距造成，再决定是否重打。",
    quickAnswer: "可用标签不要求四周留白完全对称。先确认 PDF 完整且比例正确。只有同一实测偏移反复出现时，才修复热敏走纸或打印起点；在 A4 或 Letter 上，完整且按实际大小打印的内容若未被裁切或旋转，不应随意移动。",
    updatedAt: "2026-08-29",
    evidenceNote: "通用排错框架：来源说明 PDF 页面缩放和代表性热敏校准。本页不把视觉居中描述为承运商要求；具体型号的偏移设置必须查对应打印机手册。",
    decisionTree: {
      headline: "判断偏心是外观问题还是破坏性问题",
      intro: "移动内容前，先确认偏移发生在源 PDF、热敏走纸路径，还是纸张打印机的可打印区域。",
      firstAction: "不要为了让留白看起来对称而缩小一张内容完整的标签。",
      steps: [
        { title: "PDF 本身已经偏移", symptom: "下载文件中的页面框或标签图形本来就偏向一侧。", action: "回到签发方选择匹配格式，或有意提取一个完整标签。不要用打印机偏移补偿有问题的源文件。", href: "/tools/pdf-analyzer", cta: "检查 PDF 页面框" },
        { title: "每张热敏标签偏移相同", symptom: "匹配的 4×6 模板和真实标签都从同一个错误位置开始。", action: "重新装卷、居中导纸器并校准介质感测；之后只使用该型号文档明确支持的水平或垂直偏移。", href: "/tools/calibration-sheet", cta: "测量偏移" },
        { title: "只有纸张位置看起来不均匀", symptom: "完整标签在 Letter 或 A4 上按实际大小打印，但视觉上没有居中。", action: "不要只为对称而移动或缩放扫描关键内容。确认整张标签位于可打印区域；只有内容被裁切或旋转时才重打。", href: "/letter-shipping-label-template", cta: "检查纸张适配" },
      ],
    },
    sections: [
      { heading: "1. 区分视觉留白与内容丢失", body: "检查原始 PDF 并测量输出。若整张标签完整、比例正确且位于纸内，桌面纸张外圈留白不均可能只是视觉问题。如果条码、空白区、地址或服务标识被裁切，则应把偏移视为打印失败。" },
      { heading: "2. 追踪热敏偏移", body: "空白 4×6 模板和真实标签都重复出现相同偏移，通常指向介质导轨、感测、驱动起点或文档化的位置设置。先重新装载并校准。不要缩小整张标签，也不要用未记录的偏移掩盖走纸问题。" },
      { heading: "3. 追踪 Letter 或 A4 上的位置", body: "确认所选纸张和方向与 PDF 匹配。Adobe 的“实际大小”保持尺寸，但页面不适合时可能裁切；“适合”则会改变尺寸。应选择匹配的源布局，不要为视觉对称而移动条码图形。" },
      { heading: "4. 位置影响有效内容时停止", body: "如果真实输出被裁切、旋转、折叠或离边缘太近而无法平整粘贴，请在空白模板通过后重打。如果只有源 PDF 偏移或不完整，应回到签发流程，而不是在打印机中做补偿。" },
    ],
    faq: [
      { question: "运单标签必须在 Letter 或 A4 纸上居中吗？", answer: "不需要仅为视觉对称而居中。关键是内容完整、比例正确，并能平整粘贴且不裁掉有效区域。" },
      { question: "为什么每张热敏标签偏移量都一样？", answer: "重复偏移通常指向导纸器、感测、驱动起点或位置设置。请先测试空白模板，并按准确型号手册处理。" },
      { question: "应该缩小标签让它居中吗？", answer: "不应该。缩小会改变条码几何。应修复介质、方向、校准或源布局。" },
      { question: "如果只有原始 PDF 偏心怎么办？", answer: "回到签发方获取正确格式；允许时也可有意提取一个完整标签。不要在源布局问题之上叠加打印机偏移。" },
      { question: "什么时候应该重打？", answer: "偏移裁切或旋转有效内容、妨碍平整粘贴，或正确空白模板测试后仍存在时，应重打。" },
    ],
    reviewChecklist: ["确认偏移只是视觉问题，还是裁掉了有效内容。", "使用偏移值前，先校准反复出现的热敏偏移。", "匹配的空白模板完整打印后才重打。"],
    sources: [
      { label: "Adobe Acrobat 打印页面大小设置", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe 区分不缩放的“实际大小”和“适合”，并说明页面放不下时的裁切风险。" },
      { label: "Zebra SmartCal 介质校准", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra 说明代表性热敏打印机的介质装载、感测与校准。" },
    ],
  },
  "fit-to-page-vs-actual-size-shipping-label": {
    description: "根据 PDF 页面与打印介质选择“适合”或“实际大小”，判断何时保留比例、何时会裁切，以及何时应重新生成标签。",
    quickAnswer: "PDF 页面和已装介质相互匹配时，使用“实际大小”/ 100%。Adobe 将“适合”定义为缩放到所选纸张的可打印区域，将“实际大小”定义为不缩放；页面放不下时，后者仍可能裁切。源文件与介质不同时，应获取正确格式，不能假设任一按钮都安全。",
    updatedAt: "2026-08-29",
    evidenceNote: "通用排错框架：Adobe 和 Apple 说明阅读器的打印行为。正确的运单标签格式仍由签发它的平台或承运商决定，而不是由本页决定。",
    decisionTree: {
      headline: "按源页面与介质的关系选择比例",
      intro: "“实际大小”保留尺寸，“适合”改变尺寸；两者都不能修复与所选介质不匹配的源页面。",
      firstAction: "选择任一选项前，先读取 PDF 页面尺寸并确认已装介质。",
      steps: [
        { title: "源页面和介质已经匹配", symptom: "PDF 页面与装入的纸张同为 4×6、Letter 或 A4。", action: "使用“实际大小”/ 100%，并测量一次测试。Adobe 将“实际大小”定义为不缩放打印。", href: "/tools/scale-calculator", cta: "测量结果" },
        { title: "源页面比介质大", symptom: "Letter 或 A4 页面正被送到一张 4×6 卷纸标签。", action: "不要用“适合”把整页微缩。获取正确格式；文档结构允许时，只提取一个完整标签区域。", href: "/tools/pdf-analyzer", cta: "转换前先检查" },
        { title: "实际大小会裁掉页面", symptom: "源页面无法装入所选纸张或打印机的可打印区域。", action: "选择匹配纸张或重新生成正确布局。Adobe 说明“实际大小”可能裁掉放不下的页面；这是停止信号，不是猜比例的理由。", href: "/tools/test-print-pack", cta: "测试匹配布局" },
      ],
    },
    sections: [
      { heading: "1. 从源页面和实体介质开始", body: "先读取 PDF 页面是 4×6、Letter、A4，还是包含小标签的更大纸面；再确认所选打印机里装入的纸张或卷纸。只有这两个事实相匹配后，才应选择比例。" },
      { heading: "2. 在匹配路径中使用实际大小", body: "Adobe 说明“实际大小”不应用缩放。真实 4×6 页面送往匹配的 4×6 介质，或 Letter/A4 页面送往同尺寸纸张时可以使用。仍应测量一次空白测试，因为最终驱动可能应用自己的介质设置。" },
      { heading: "3. 把适合页面视为一次变换", body: "Adobe 说明“适合”会缩小或放大页面以进入所选可打印区域。这对普通文档有用，却会改变条码几何。在 macOS 上，Apple 同样说明“缩放以适合”，以及保留完整页面或填满并裁切纸张的不同选项。" },
      { heading: "4. 两个选项都不能保全文档时停止", body: "如果“实际大小”裁掉必需内容，而“适合”又将其微缩或放大，说明源布局不属于所选介质。应重新生成签发方的正确格式、使用匹配纸张，或仅在文档允许时有意提取一个完整标签；不要用真实条码反复试错。" },
    ],
    faq: [
      { question: "“实际大小”对运单标签总是安全吗？", answer: "不是。它保留比例，但 Adobe 说明页面不适合所选纸张时仍可能裁掉内容。" },
      { question: "“适合页面”总是错误的吗？", answer: "它是有明确行为的缩放操作。目标是保留签发条码尺寸时不要使用，应获取匹配的源格式。" },
      { question: "真实 4×6 PDF 和 4×6 卷纸应该选什么？", answer: "从 4×6 介质和“实际大小”/ 100% 开始，打印真实运费前先测量一次空白测试。" },
      { question: "Letter PDF 送往热敏打印机应该选什么？", answer: "既不要使用“适合”，也不要盲目放大。获取 4×6 格式；只有全部必需内容都能保留时，才提取一个完整标签。" },
      { question: "什么时候应该停止并重新生成？", answer: "“实际大小”会裁切、“适合”会改变条码、页面含有必需的相邻文档，或签发方给出特定格式要求时，请停止并重新生成。" },
    ],
    reviewChecklist: ["读取 PDF 页面尺寸并确认已装介质。", "只有源页面与介质匹配时才使用“实际大小”。", "“实际大小”裁切且“适合”缩放时，重新生成正确格式。"],
    sources: [
      { label: "Adobe Acrobat 打印页面大小设置", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe 定义“适合”“实际大小”“缩小过大页面”和自定义缩放的行为。" },
      { label: "Apple 预览打印选项", url: "https://support.apple.com/en-gb/guide/preview/prvw15175/mac", checkedAt: "2026-08-29", supports: "Apple 说明预览中的缩放、缩放以适合、打印完整图像和填满整张纸等行为。" },
    ],
  },
};

function troubleshootingTree(slug: string): SeoPage["decisionTree"] {
  return reviewedTroublePages[slug]?.decisionTree;
}

function troublePage(slug: string, symptom: string, fix: string): SeoPage {
  const base: SeoPage = {
    slug,
    kind: "troubleshooter",
    title: symptom,
    description: `修复${symptom}。重新打印前检查比例、纸张、边距、方向和条码空白区。`,
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

  return { ...base, ...reviewedTroublePages[slug] };
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
