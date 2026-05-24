"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaidToolGate } from "@/components/PaidToolGate";
import { carrierOptions, paperOptions, platformOptions, printerOptions, type Carrier, type Paper, type Platform, type Printer, type Rule } from "@/data/rules";
import { defaultLocale, hasLocalizedPath, safeLocalizedPath, type Locale } from "@/lib/i18n";
import { lookup } from "@/lib/rules-engine";
import { getSizeCheckerNextStepAction, type SizeCheckerNextStepAction } from "@/lib/size-checker-next-step";

interface SizeCheckerProps {
  initialRule: Rule;
  initialPlatform?: Platform;
  initialCarrier?: Carrier;
  initialPaper?: Paper;
  initialPrinter?: Printer;
  locale?: Locale;
  variant?: "hero" | "page" | "inline";
}

const verdictStyles: Record<Rule["verdict"], string> = {
  compatible: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  not_ideal: "bg-amber-100 text-amber-900 ring-amber-200",
  not_recommended: "bg-red-100 text-red-800 ring-red-200",
};

type CheckerCopy = {
  englishTool: string;
  verdicts: Record<Rule["verdict"], string>;
  steps: string[];
  fields: Record<"platform" | "carrier" | "paper" | "printer", string>;
  setupHelp?: string;
  result: {
    plan: string;
    basis: string;
    use: string;
    inches: string;
    metric: string;
    setDialog: string;
    orient: string;
    avoid: string;
    official: string;
    sourceTitle: string;
    sourceLabelFallback: string;
    lastChecked: string;
    rulesVersion: string;
    rulesMayChange: string;
    confidence: Record<Rule["verdict"], string>;
    computed: Record<Rule["verdict"], string>;
  };
  nextStepActions: Record<SizeCheckerNextStepAction, { title: string; text: string; cta: string; when?: string }>;
  moreChecks: string;
  moreChecksHelp?: string;
  recommendedActionLabel?: string;
  ctas: Record<"calibration" | "pdf", string>;
  checkDescriptions?: Record<"calibration" | "pdf", string>;
  options: {
    platform: Record<Platform, string>;
    carrier: Record<Carrier, string>;
    paper: Record<Paper, string>;
    printer: Record<Printer, string>;
  };
  ruleText: {
    scale4x6: string;
    scaleSheet: string;
    orientation: Record<Rule["orientation"], string>;
    thermalMistakes: string[];
    sheetMistakes: string[];
    unusualNote: string;
    tier1FourBySixNote: string;
    tier1SheetNote: string;
    generatedNote: string;
  };
};

const baseOptions = {
  platform: { etsy: "Etsy", shopify: "Shopify", ebay: "eBay", amazon_fba: "Amazon FBA", usps_direct: "USPS Direct", ups_direct: "UPS Direct", fedex_direct: "FedEx Direct", dhl_direct: "DHL Direct", other: "Other" },
  carrier: { usps: "USPS", ups: "UPS", fedex: "FedEx", dhl: "DHL", royal_mail: "Royal Mail", canada_post: "Canada Post", australia_post: "Australia Post" },
  paper: { "4x6": "4 × 6 in", a4: "A4", letter: "Letter", "6x4": "6 × 4 in", other: "Other" },
  printer: { thermal: "Thermal (direct)", inkjet: "Inkjet", laser: "Laser" },
} satisfies CheckerCopy["options"];

const checkerCopy: Record<Locale, CheckerCopy> = {
  en: {
    englishTool: " (English tool)",
    verdicts: { compatible: "Compatible", not_ideal: "Not ideal", not_recommended: "Not recommended" },
    steps: ["Step 1 · Choose setup", "Step 2 · Read result", "Step 3 · Print test"],
    fields: { platform: "Platform", carrier: "Carrier", paper: "Paper size", printer: "Printer type" },
    setupHelp: "Printer type matters because thermal printers usually use 4×6 label rolls, while inkjet/laser printers usually use A4 or Letter sheets.",
    nextStepActions: {
      template: { title: "Recommended next step", text: "Download the blank 4×6 test PDF, then print it at 100% scale before buying or reprinting postage.", cta: "Download 4×6 test PDF", when: "Use this when your setup looks usable and you need a safe physical test." },
      calibration: { title: "Recommended next step", text: "Confirm scale, margins and orientation before using this setup for a live label.", cta: "Open calibration sheet", when: "Use this when the setup is not ideal or you changed printer, roll, paper or driver settings." },
      scale: { title: "Recommended next step", text: "If the label is tiny, cut off or blurry, adjust scale before reprinting postage.", cta: "Calculate corrected scale", when: "Use this when you already printed once and the physical size is wrong." },
      pdf: { title: "Recommended next step", text: "Check the PDF page size before changing printer settings or buying postage again.", cta: "Check PDF page size", when: "Use this when the label file may be Letter, A4 or 4×6 and the print dialog is guessing." },
      templates: { title: "Recommended next step", text: "Compare template sizes before choosing paper, rolls or a printer setup.", cta: "Compare templates", when: "Use this before buying paper, rolls or a printer." },
    },
    result: { plan: "Your print plan", basis: "Based on the selected platform, carrier, paper and printer. Confirm the carrier label file before buying postage.", use: "Use", inches: "inches", metric: "Metric size", setDialog: "Set print dialog to", orient: "Orient", avoid: "Avoid", official: "Open official documentation", sourceTitle: "Source", sourceLabelFallback: "Official carrier documentation", lastChecked: "Last checked", rulesVersion: "Rules version", rulesMayChange: "Carrier and platform rules may change. This tool does not certify or guarantee label acceptance.", confidence: { compatible: "Good baseline setup", not_ideal: "Usable with caution", not_recommended: "Change paper or printer setup before printing" }, computed: { compatible: "Calculated result: compatible. Good baseline setup.", not_ideal: "Calculated result: not ideal. Usable with caution.", not_recommended: "Calculated result: not recommended. Change paper or printer setup before printing." } },
    moreChecks: "Optional checks",
    moreChecksHelp: "Use these only if the recommended step does not match your problem.",
    recommendedActionLabel: "Do this next",
    ctas: { calibration: "Calibration sheet", pdf: "PDF page-size check" },
    checkDescriptions: {
      calibration: "Print a ruler/alignment page to verify physical scale, margins and paper feed.",
      pdf: "Read the label PDF page size so you know whether the file is 4×6, Letter or A4.",
    },
    options: baseOptions,
    ruleText: { scale4x6: "100% — do not select Fit to Page", scaleSheet: "100% / Actual Size — do not shrink to printable area", orientation: { portrait: "Portrait", landscape: "Landscape" }, thermalMistakes: ["Selecting Fit to Page instead of printing at 100% scale.", "Loading the 4 × 6 label roll sideways or with the wrong orientation.", "Letting the platform crop the label instead of downloading the carrier PDF."], sheetMistakes: ["Printing a 4 × 6 label stretched across the whole sheet.", "Forgetting to disable browser header/footer margins.", "Cutting into the barcode quiet zone after printing on sheet paper."], unusualNote: "This is an unusual setup. Start with a 4 × 6 label at 100% scale and verify against the carrier documentation before shipping.", tier1FourBySixNote: "This platform and carrier combination should normally print at 100% scale. A 4 × 6 thermal label is the safest setup for label printers.", tier1SheetNote: "This platform and carrier combination should normally print at 100% scale. Sheet paper works for inkjet/laser printers when the label is not scaled to fit.", generatedNote: "This setup is supported, but it is not a primary tested combination. Print one calibration sheet before buying postage in volume." },
  },
  es: {
    englishTool: " (herramienta en inglés)", verdicts: { compatible: "Compatible", not_ideal: "No ideal", not_recommended: "No recomendado" }, steps: ["Paso 1 · Elegir configuración", "Paso 2 · Leer resultado", "Paso 3 · Imprimir prueba"], fields: { platform: "Plataforma", carrier: "Transportista", paper: "Papel", printer: "Impresora" }, nextStepActions: { template: { title: "Siguiente paso recomendado", text: "Descarga el PDF de prueba 4×6 en blanco e imprímelo al 100% antes de comprar o reimprimir envío.", cta: "Descargar PDF 4×6" }, calibration: { title: "Siguiente: imprime una calibración", text: "Confirma escala, márgenes y orientación antes de usar esta configuración con una etiqueta real.", cta: "Abrir calibración" }, scale: { title: "Siguiente: corrige la escala", text: "Si la etiqueta sale pequeña, cortada o borrosa, ajusta la escala antes de reimprimir.", cta: "Calcular escala" }, pdf: { title: "Siguiente: revisa el PDF", text: "Comprueba el tamaño de página del PDF antes de cambiar la impresora o comprar envío otra vez.", cta: "Comprobar PDF" }, templates: { title: "Siguiente: compara formatos seguros", text: "Compara tamaños de plantilla antes de elegir papel, rollos o impresora.", cta: "Comparar plantillas" } }, result: { plan: "Plan de impresión", basis: "Según plataforma, transportista, papel e impresora seleccionados. Confirma el archivo del transportista antes de comprar envío.", use: "Usar", inches: "pulgadas", metric: "Tamaño métrico", setDialog: "Configura impresión en", orient: "Orientación", avoid: "Evita", official: "Abrir documentación oficial", sourceTitle: "Fuente", sourceLabelFallback: "Documentación oficial del transportista", lastChecked: "Última revisión", rulesVersion: "Versión de reglas", rulesMayChange: "Las reglas del transportista y la plataforma pueden cambiar. Esta herramienta no certifica ni garantiza la aceptación de la etiqueta.", confidence: { compatible: "Buena base", not_ideal: "Usable con cuidado", not_recommended: "Cambia papel o impresora antes de imprimir" }, computed: { compatible: "Resultado calculado: es compatible. Buena base.", not_ideal: "Resultado calculado: no es ideal. Usable con cuidado.", not_recommended: "Resultado calculado: no recomendado. Cambia papel o impresora antes de imprimir." } }, moreChecks: "Más comprobaciones", ctas: { calibration: "Hoja de calibración", pdf: "Comprobar PDF" }, options: { ...baseOptions, platform: { ...baseOptions.platform, other: "Otro" }, paper: { ...baseOptions.paper, letter: "Carta", other: "Otro" }, printer: { thermal: "Térmica (directa)", inkjet: "Inyección de tinta", laser: "Láser" } }, ruleText: { scale4x6: "100% — no uses Ajustar a página", scaleSheet: "100% / Tamaño real — no reducir al área imprimible", orientation: { portrait: "Vertical", landscape: "Horizontal" }, thermalMistakes: ["Usar Ajustar a página en vez de 100%.", "Cargar el rollo 4×6 de lado o con orientación incorrecta.", "Dejar que la plataforma recorte la etiqueta en vez de descargar el PDF."], sheetMistakes: ["Estirar una etiqueta 4×6 por toda la hoja.", "Olvidar desactivar encabezados/pies del navegador.", "Cortar la zona blanca del código de barras."], unusualNote: "Configuración poco común. Empieza con 4×6 al 100% y verifica la documentación del transportista.", tier1FourBySixNote: "Esta combinación normalmente debe imprimirse al 100%. Una etiqueta térmica 4×6 es la opción más segura.", tier1SheetNote: "Esta combinación normalmente debe imprimirse al 100%. El papel de hoja funciona si no se escala la etiqueta.", generatedNote: "Configuración compatible, pero no es una combinación principal probada. Imprime una calibración antes de comprar envíos en volumen." },
  },
  fr: {
    englishTool: " (outil en anglais)", verdicts: { compatible: "Compatible", not_ideal: "Pas idéal", not_recommended: "Non recommandé" }, steps: ["Étape 1 · Choisir", "Étape 2 · Lire le résultat", "Étape 3 · Tester"], fields: { platform: "Plateforme", carrier: "Transporteur", paper: "Papier", printer: "Imprimante" }, nextStepActions: { template: { title: "Étape suivante recommandée", text: "Téléchargez le PDF de test 4×6 vierge, puis imprimez-le à 100% avant l’affranchissement ou la réimpression.", cta: "Télécharger le PDF 4×6" }, calibration: { title: "Ensuite : imprimez une calibration", text: "Confirmez l’échelle, les marges et l’orientation avant une étiquette réelle.", cta: "Ouvrir la calibration" }, scale: { title: "Ensuite : corrigez l’échelle", text: "Si l’étiquette est petite, coupée ou floue, ajustez l’échelle avant de réimprimer.", cta: "Calculer l’échelle" }, pdf: { title: "Ensuite : inspectez le PDF", text: "Vérifiez la taille de page du PDF avant de changer les réglages ou de racheter l’affranchissement.", cta: "Contrôler le PDF" }, templates: { title: "Ensuite : comparez les formats sûrs", text: "Comparez les tailles de modèles avant de choisir papier, rouleaux ou imprimante.", cta: "Comparer les modèles" } }, result: { plan: "Plan d’impression", basis: "Basé sur la plateforme, le transporteur, le papier et l’imprimante choisis. Confirmez le fichier transporteur avant achat.", use: "Utiliser", inches: "pouces", metric: "Taille métrique", setDialog: "Régler l’impression sur", orient: "Orientation", avoid: "À éviter", official: "Ouvrir la documentation officielle", sourceTitle: "Source", sourceLabelFallback: "Documentation officielle du transporteur", lastChecked: "Dernière vérification", rulesVersion: "Version des règles", rulesMayChange: "Les règles du transporteur et de la plateforme peuvent changer. Cet outil ne certifie pas et ne garantit pas l’acceptation de l’étiquette.", confidence: { compatible: "Bonne configuration de base", not_ideal: "Utilisable avec prudence", not_recommended: "Changez papier ou imprimante avant d’imprimer" }, computed: { compatible: "Résultat calculé : compatible. Bonne configuration de base.", not_ideal: "Résultat calculé : pas idéal. Utilisable avec prudence.", not_recommended: "Résultat calculé : non recommandé. Changez papier ou imprimante avant d’imprimer." } }, moreChecks: "Plus de contrôles", ctas: { calibration: "Feuille de calibration", pdf: "Contrôle PDF" }, options: { ...baseOptions, platform: { ...baseOptions.platform, other: "Autre" }, paper: { ...baseOptions.paper, other: "Autre" }, printer: { thermal: "Thermique (directe)", inkjet: "Jet d’encre", laser: "Laser" } }, ruleText: { scale4x6: "100% — ne pas utiliser Ajuster à la page", scaleSheet: "100% / Taille réelle — ne pas réduire à la zone imprimable", orientation: { portrait: "Portrait", landscape: "Paysage" }, thermalMistakes: ["Utiliser Ajuster à la page au lieu de 100%.", "Charger le rouleau 4×6 de côté ou dans le mauvais sens.", "Laisser la plateforme rogner l’étiquette au lieu de télécharger le PDF."], sheetMistakes: ["Étirer une étiquette 4×6 sur toute la feuille.", "Oublier de désactiver les marges navigateur.", "Couper la zone blanche du code-barres."], unusualNote: "Configuration inhabituelle. Commencez par 4×6 à 100% et vérifiez la documentation du transporteur.", tier1FourBySixNote: "Cette combinaison doit normalement être imprimée à 100%. Le 4×6 thermique est le plus sûr.", tier1SheetNote: "Cette combinaison doit normalement être imprimée à 100%. Le papier feuille fonctionne si l’étiquette n’est pas réduite.", generatedNote: "Configuration prise en charge, mais pas une combinaison principale testée. Imprimez une calibration avant les volumes." },
  },
  de: {
    englishTool: " (englisches Tool)", verdicts: { compatible: "Kompatibel", not_ideal: "Nicht ideal", not_recommended: "Nicht empfohlen" }, steps: ["Schritt 1 · Setup wählen", "Schritt 2 · Ergebnis lesen", "Schritt 3 · Test drucken"], fields: { platform: "Plattform", carrier: "Versanddienst", paper: "Papier", printer: "Drucker" }, nextStepActions: { template: { title: "Empfohlener nächster Schritt", text: "Laden Sie das leere 4×6-Test-PDF herunter und drucken Sie es mit 100%, bevor Sie Porto kaufen oder neu drucken.", cta: "4×6-Test-PDF herunterladen" }, calibration: { title: "Nächster Schritt: Kalibrierung drucken", text: "Prüfen Sie Skalierung, Ränder und Ausrichtung vor einem echten Label.", cta: "Kalibrierung öffnen" }, scale: { title: "Nächster Schritt: Skalierung korrigieren", text: "Wenn das Label klein, abgeschnitten oder unscharf ist, passen Sie vor dem Nachdruck die Skalierung an.", cta: "Skalierung berechnen" }, pdf: { title: "Nächster Schritt: Label-PDF prüfen", text: "Prüfen Sie die PDF-Seitengröße, bevor Sie Druckereinstellungen ändern oder Porto erneut kaufen.", cta: "PDF prüfen" }, templates: { title: "Nächster Schritt: sichere Layouts vergleichen", text: "Vergleichen Sie Vorlagengrößen, bevor Sie Papier, Rollen oder Drucker wählen.", cta: "Vorlagen vergleichen" } }, result: { plan: "Druckplan", basis: "Basierend auf Plattform, Versanddienst, Papier und Drucker. Prüfen Sie die Versanddatei vor dem Portokauf.", use: "Nutzen", inches: "Zoll", metric: "Metrische Größe", setDialog: "Druckdialog einstellen auf", orient: "Ausrichtung", avoid: "Vermeiden", official: "Offizielle Dokumentation öffnen", sourceTitle: "Quelle", sourceLabelFallback: "Offizielle Versanddienst-Dokumentation", lastChecked: "Zuletzt geprüft", rulesVersion: "Regelversion", rulesMayChange: "Versanddienst- und Plattformregeln können sich ändern. Dieses Tool zertifiziert nicht und garantiert keine Annahme des Labels.", confidence: { compatible: "Gute Basiskonfiguration", not_ideal: "Mit Vorsicht nutzbar", not_recommended: "Papier oder Drucker vor dem Drucken ändern" }, computed: { compatible: "Berechnetes Ergebnis: kompatibel. Gute Basiskonfiguration.", not_ideal: "Berechnetes Ergebnis: nicht ideal. Mit Vorsicht nutzbar.", not_recommended: "Berechnetes Ergebnis: nicht empfohlen. Papier oder Drucker vor dem Drucken ändern." } }, moreChecks: "Weitere Checks", ctas: { calibration: "Kalibrierungsseite", pdf: "PDF-Seitengröße" }, options: { ...baseOptions, platform: { ...baseOptions.platform, other: "Andere" }, paper: { ...baseOptions.paper, other: "Andere" }, printer: { thermal: "Thermo (direkt)", inkjet: "Tintenstrahl", laser: "Laser" } }, ruleText: { scale4x6: "100% — nicht An Seite anpassen wählen", scaleSheet: "100% / Tatsächliche Größe — nicht auf Druckbereich verkleinern", orientation: { portrait: "Hochformat", landscape: "Querformat" }, thermalMistakes: ["An Seite anpassen statt 100% verwenden.", "4×6-Rolle seitlich oder falsch ausgerichtet laden.", "Plattform das Etikett zuschneiden lassen statt PDF herunterzuladen."], sheetMistakes: ["4×6-Etikett auf die ganze Seite strecken.", "Browser-Kopf-/Fußzeilen nicht deaktivieren.", "Barcode-Ruhezone nach dem Druck anschneiden."], unusualNote: "Ungewöhnliches Setup. Starten Sie mit 4×6 bei 100% und prüfen Sie die Versanddienst-Dokumentation.", tier1FourBySixNote: "Diese Kombination sollte normalerweise mit 100% gedruckt werden. 4×6 Thermo ist für Etikettendrucker am sichersten.", tier1SheetNote: "Diese Kombination sollte normalerweise mit 100% gedruckt werden. Blattpapier funktioniert, wenn das Etikett nicht skaliert wird.", generatedNote: "Setup wird unterstützt, ist aber keine primär getestete Kombination. Drucken Sie vor Volumenporto eine Kalibrierung." },
  },
  ja: {
    englishTool: "（英語ツール）", verdicts: { compatible: "対応", not_ideal: "注意が必要", not_recommended: "非推奨" }, steps: ["手順 1 · 設定を選択", "手順 2 · 結果を確認", "手順 3 · テスト印刷"], fields: { platform: "プラットフォーム", carrier: "配送会社", paper: "用紙", printer: "プリンター" }, nextStepActions: { template: { title: "おすすめの次の手順", text: "空白の 4×6 テスト PDF をダウンロードし、送料購入や再印刷の前に 100% で印刷します。", cta: "4×6 テスト PDF をダウンロード" }, calibration: { title: "次：キャリブレーションを印刷", text: "実際のラベルに使う前に、倍率、余白、向きを確認します。", cta: "キャリブレーションを開く" }, scale: { title: "次：印刷倍率を修正", text: "ラベルが小さい、切れる、ぼやける場合は、再印刷前に倍率を調整します。", cta: "倍率を計算" }, pdf: { title: "次：ラベル PDF を確認", text: "プリンター設定変更や送料再購入の前に、PDF のページサイズを確認します。", cta: "PDF を確認" }, templates: { title: "次：安全なレイアウトを比較", text: "用紙、ロール、プリンターを選ぶ前にテンプレートサイズを比較します。", cta: "テンプレート比較" } }, result: { plan: "印刷プラン", basis: "選択したプラットフォーム、配送会社、用紙、プリンターに基づきます。送料購入前に配送会社のラベルファイルを確認してください。", use: "使用", inches: "インチ", metric: "メートル法サイズ", setDialog: "印刷設定", orient: "向き", avoid: "避けること", official: "公式ドキュメントを開く", sourceTitle: "参照元", sourceLabelFallback: "配送会社の公式ドキュメント", lastChecked: "最終確認", rulesVersion: "ルール版", rulesMayChange: "配送会社やプラットフォームのルールは変更される場合があります。このツールはラベルの承認や受理を保証しません。", confidence: { compatible: "基本設定として良好", not_ideal: "注意して使用可能", not_recommended: "印刷前に用紙またはプリンター設定を変更" }, computed: { compatible: "計算結果：対応しています。基本設定として良好です。", not_ideal: "計算結果：理想的ではありません。注意して使用可能です。", not_recommended: "計算結果：非推奨です。印刷前に用紙またはプリンター設定を変更してください。" } }, moreChecks: "追加チェック", ctas: { calibration: "キャリブレーション", pdf: "PDF サイズ確認" }, options: { ...baseOptions, platform: { ...baseOptions.platform, other: "その他" }, paper: { ...baseOptions.paper, other: "その他" }, printer: { thermal: "サーマル（直接）", inkjet: "インクジェット", laser: "レーザー" } }, ruleText: { scale4x6: "100% — ページに合わせるを選ばない", scaleSheet: "100% / 実際のサイズ — 印刷可能範囲に縮小しない", orientation: { portrait: "縦", landscape: "横" }, thermalMistakes: ["100% ではなくページに合わせるを使う。", "4×6 ロールを横向きまたは誤った向きでセットする。", "配送会社 PDF をダウンロードせず、平台側でラベルを切り抜く。"], sheetMistakes: ["4×6 ラベルを用紙全体に引き伸ばす。", "ブラウザーのヘッダー/フッター余白を無効にしない。", "印刷後にバーコードの余白を切ってしまう。"], unusualNote: "一般的でない設定です。4×6 を 100% で印刷し、配送会社の資料を確認してください。", tier1FourBySixNote: "この組み合わせは通常 100% で印刷します。ラベルプリンターでは 4×6 サーマルが安全です。", tier1SheetNote: "この組み合わせは通常 100% で印刷します。ラベルを縮小しなければシート用紙でも使用できます。", generatedNote: "対応していますが主要な検証済み組み合わせではありません。大量購入前にキャリブレーションを印刷してください。" },
  },
  zh: {
    englishTool: "（英文工具）",
    verdicts: { compatible: "兼容", not_ideal: "不理想", not_recommended: "不推荐" },
    steps: ["第 1 步 · 选择设置", "第 2 步 · 查看结果", "第 3 步 · 打印测试"],
    fields: { platform: "销售平台", carrier: "承运商", paper: "纸张尺寸", printer: "打印机类型" },
    setupHelp: "选择打印机类型是为了判断纸张是否匹配：热敏通常用 4×6 标签卷，喷墨/激光通常用 A4 或 Letter 纸。",
    nextStepActions: {
      template: { title: "推荐下一步", text: "先下载 4×6 空白测试 PDF，再按 100% 比例打印。购买或重打运费前，用它做一次安全的实物测试。", cta: "下载 4×6 测试 PDF", when: "适合：当前设置看起来可用，你需要先做一次安全的实物测试。" },
      calibration: { title: "推荐下一步", text: "用于真实标签前，先确认比例、边距和方向。", cta: "打开校准页", when: "适合：设置不够理想，或你刚换过打印机、标签卷、纸张、驱动。" },
      scale: { title: "推荐下一步", text: "如果标签过小、被裁切或模糊，重打前先调整打印比例。", cta: "计算修正比例", when: "适合：你已经打过一次，实物尺寸明显不对。" },
      pdf: { title: "推荐下一步", text: "更改打印机设置或再次购买运费前，先检查 PDF 页面尺寸。", cta: "检查 PDF 页面", when: "适合：不确定标签文件到底是 4×6、Letter 还是 A4。" },
      templates: { title: "推荐下一步", text: "选择纸张、标签卷或打印机前，先比较模板尺寸。", cta: "比较模板", when: "适合：购买纸张、标签卷或打印机之前先确认方案。" },
    },
    result: { plan: "你的打印方案", basis: "基于已选择的平台、承运商、纸张和打印机。购买运费前仍需确认承运商标签文件。", use: "使用", inches: "英寸", metric: "公制尺寸", setDialog: "打印对话框设为", orient: "方向", avoid: "避免", official: "打开官方文档", sourceTitle: "来源", sourceLabelFallback: "承运商官方文档", lastChecked: "最近核对", rulesVersion: "规则版本", rulesMayChange: "承运商和平台规则可能变化。此工具不提供认证，也不保证标签一定被接受。", confidence: { compatible: "可作为基础设置", not_ideal: "可用但需谨慎", not_recommended: "打印前请更换纸张或打印机设置" }, computed: { compatible: "经过计算：是兼容的，可作为基础设置。", not_ideal: "经过计算：不是最理想，但可用，打印前需要谨慎确认。", not_recommended: "经过计算：不推荐，打印前请更换纸张或打印机设置。" } },
    moreChecks: "可选检查",
    moreChecksHelp: "只有当推荐步骤不符合你的问题时，再用下面这些检查。",
    recommendedActionLabel: "下一步就做这个",
    ctas: { calibration: "校准页", pdf: "PDF 页面尺寸检查" },
    checkDescriptions: {
      calibration: "打印带尺子和对齐标记的页面，用来确认实物比例、边距和走纸是否正确。",
      pdf: "读取标签 PDF 的页面尺寸，确认文件本身是 4×6、Letter 还是 A4。",
    },
    options: { ...baseOptions, platform: { ...baseOptions.platform, other: "其他" }, paper: { ...baseOptions.paper, letter: "Letter", other: "其他" }, printer: { thermal: "热敏（直打）", inkjet: "喷墨", laser: "激光" } },
    ruleText: { scale4x6: "100% — 不要选择适合页面", scaleSheet: "100% / 实际大小 — 不要缩小到可打印区域", orientation: { portrait: "纵向", landscape: "横向" }, thermalMistakes: ["选择适合页面，而不是按 100% 比例打印。", "4×6 标签卷横向装入或方向错误。", "让平台裁切标签，而不是下载承运商 PDF。"], sheetMistakes: ["把 4×6 标签拉伸到整张纸。", "忘记关闭浏览器页眉页脚边距。", "在纸张打印后裁切到条码空白区。"], unusualNote: "这是不常见设置。先用 4×6 标签按 100% 比例打印，并在发货前核对承运商文档。", tier1FourBySixNote: "这个平台和承运商组合通常应按 100% 比例打印。4×6 热敏标签是标签打印机最稳妥的设置。", tier1SheetNote: "这个平台和承运商组合通常应按 100% 比例打印。只要标签不被缩放，纸张打印也可用于喷墨/激光打印机。", generatedNote: "此组合受支持，但不是主要测试组合。批量购买运费前，请先打印一张校准页。" },
  },
};

export function SizeChecker({
  initialRule,
  initialPlatform = initialRule.platform,
  initialCarrier = initialRule.carrier,
  initialPaper = initialRule.paper,
  initialPrinter = initialRule.printer,
  locale = defaultLocale,
  variant = "page",
}: SizeCheckerProps) {
  const router = useRouter();
  const copy = checkerCopy[locale];
  const fallbackLabel = (path: string) => (path.startsWith("/api/") || locale === defaultLocale || hasLocalizedPath(path, locale) ? "" : copy.englishTool);
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [carrier, setCarrier] = useState<Carrier>(initialCarrier);
  const [paper, setPaper] = useState<Paper>(initialPaper);
  const [printer, setPrinter] = useState<Printer>(initialPrinter);
  const isInline = variant === "inline";

  const rule = useMemo(() => lookup(platform, carrier, paper, printer), [platform, carrier, paper, printer]);
  const nextStepAction = getSizeCheckerNextStepAction({ verdict: rule.verdict, useCase: "starting" });
  const optionLabel = {
    paper: copy.options.paper[paper],
  };
  const isFourBySix = paper === "4x6" || paper === "6x4";
  const isTierOne = ["etsy", "shopify", "ebay", "amazon_fba"].includes(platform) && ["usps", "ups", "fedex", "dhl"].includes(carrier) && ["4x6", "letter"].includes(paper) && ["thermal", "laser"].includes(printer);
  const ruleNotes = platform === "other" || paper === "other"
    ? copy.ruleText.unusualNote
    : isTierOne
      ? isFourBySix
        ? copy.ruleText.tier1FourBySixNote
        : copy.ruleText.tier1SheetNote
      : copy.ruleText.generatedNote;
  const commonMistakes = printer === "thermal" ? copy.ruleText.thermalMistakes : copy.ruleText.sheetMistakes;
  const issueReason = getIssueReason({ locale, paper, printer, verdict: rule.verdict });
  const analyzerParams = new URLSearchParams({ platform, carrier, paper, printer }).toString();
  const pdfAnalyzerHref = `${safeLocalizedPath("/tools/pdf-analyzer", locale)}?${analyzerParams}`;
  const nextStepHref = {
    template: "/api/templates/4x6",
    calibration: safeLocalizedPath("/tools/calibration-sheet", locale),
    scale: safeLocalizedPath("/tools/scale-calculator", locale),
    pdf: pdfAnalyzerHref,
    templates: safeLocalizedPath("/templates", locale),
  }[nextStepAction];
  const nextStep = { ...copy.nextStepActions[nextStepAction], href: nextStepHref };
  const secondaryChecks = [
    { action: "calibration" as const, href: safeLocalizedPath("/tools/calibration-sheet", locale), label: copy.ctas.calibration, fallbackPath: "/tools/calibration-sheet", text: copy.checkDescriptions?.calibration ?? "" },
    { action: "pdf" as const, href: pdfAnalyzerHref, label: copy.ctas.pdf, fallbackPath: "/tools/pdf-analyzer", text: copy.checkDescriptions?.pdf ?? "" },
  ].filter((check) => check.action !== nextStepAction);
  const stepCardClass = `grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100 ${isInline ? "sm:p-5" : "sm:p-6"}`;

  function updateQuery(next: Partial<{ platform: Platform; carrier: Carrier; paper: Paper; printer: Printer }>) {
    const values = {
      platform,
      carrier,
      paper,
      printer,
      ...next,
    };
    const params = new URLSearchParams(values);
    router.replace(`?${params.toString()}#result`, { scroll: false });
  }

  return (
    <PaidToolGate feature={locale === "zh" ? "尺寸检查器" : "Size checker"} locale={locale}>
      <div className="grid gap-4">
        <section className={stepCardClass}>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">{copy.steps[0]}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={copy.fields.platform}>
              <select
                value={platform}
                onChange={(event) => {
                  const value = event.target.value as Platform;
                  setPlatform(value);
                  updateQuery({ platform: value });
                }}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {copy.options.platform[option.value]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={copy.fields.carrier}>
              <select
                value={carrier}
                onChange={(event) => {
                  const value = event.target.value as Carrier;
                  setCarrier(value);
                  updateQuery({ carrier: value });
                }}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none"
              >
                {carrierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {copy.options.carrier[option.value]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={copy.fields.paper}>
              <select
                value={paper}
                onChange={(event) => {
                  const value = event.target.value as Paper;
                  setPaper(value);
                  updateQuery({ paper: value });
                }}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none"
              >
                {paperOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {copy.options.paper[option.value]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={copy.fields.printer}>
              <select
                value={printer}
                onChange={(event) => {
                  const value = event.target.value as Printer;
                  setPrinter(value);
                  updateQuery({ printer: value });
                }}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none"
              >
                {printerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {copy.options.printer[option.value]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {copy.setupHelp ? <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-600 ring-1 ring-sky-100">{copy.setupHelp}</p> : null}
        </section>

        <section id="result" className={stepCardClass}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">{copy.steps[1]}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">{copy.result.plan}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy.result.basis}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-bold ring-1 ${verdictStyles[rule.verdict]}`}>
              {copy.verdicts[rule.verdict]}
            </span>
          </div>
          <div className={`mt-4 rounded-2xl p-4 text-sm font-bold leading-6 ring-1 ${verdictStyles[rule.verdict]}`}>{copy.result.computed[rule.verdict]}</div>
          {issueReason ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-100">{issueReason}</p> : null}
          <p className="mt-4 text-sm leading-6 text-slate-700">{ruleNotes}</p>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{copy.result.use}</h4>
            <p className="mt-2 text-2xl font-black tracking-tight text-[#12324A]">
              {rule.recommended_size.width_in} × {rule.recommended_size.height_in} {copy.result.inches}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{optionLabel.paper}</p>
            <dl className="mt-5 grid gap-3">
              <ResultStat label={copy.result.metric} value={`${rule.recommended_size.width_mm} × ${rule.recommended_size.height_mm} mm`} />
              <ResultStat label={copy.result.setDialog} value={isFourBySix ? copy.ruleText.scale4x6 : copy.ruleText.scaleSheet} />
              <ResultStat label={copy.result.orient} value={copy.ruleText.orientation[rule.orientation]} />
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">{copy.result.avoid}</h4>
            <ul className="mt-4 grid gap-3 text-sm text-slate-700">
              {commonMistakes.map((mistake, index) => (
                <li key={mistake} className="grid grid-cols-[1.75rem_1fr] gap-3 rounded-2xl bg-amber-50/70 p-3 ring-1 ring-amber-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800">{index + 1}</span>
                  <span className="leading-6">{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        </section>

        <section className={stepCardClass}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{copy.steps[2]}</p>
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">{copy.recommendedActionLabel ?? nextStep.title}</p>
            <h4 className="mt-2 text-lg font-black leading-6">{nextStep.cta}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-200">{nextStep.text}</p>
            {nextStep.when ? <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold leading-5 text-slate-100 ring-1 ring-white/10">{nextStep.when}</p> : null}
            {nextStep.href.startsWith("/api/") ? (
              <a href={nextStep.href} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100">
                {nextStep.cta}
              </a>
            ) : (
              <Link href={nextStep.href} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100">
                {nextStep.cta}{fallbackLabel(nextStep.href)}
              </Link>
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{copy.moreChecks}</p>
            {copy.moreChecksHelp ? <p className="mt-1 text-sm leading-6 text-slate-600">{copy.moreChecksHelp}</p> : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {secondaryChecks.map((check) => (
                <Link key={check.action} href={check.href} className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                  <span className="block text-sm font-black text-slate-950">{check.label}{fallbackLabel(check.fallbackPath)}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-600">{check.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {rule.official_doc_url ? (
          <p className="px-1 text-xs leading-5 text-slate-500">
            {copy.result.rulesMayChange}{" "}
            <a href={rule.official_doc_url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4 hover:text-slate-900">
              {copy.result.official}
            </a>
          </p>
        ) : null}
      </div>
    </PaidToolGate>
  );
}

function getIssueReason({
  locale,
  paper,
  printer,
  verdict,
}: {
  locale: Locale;
  paper: Paper;
  printer: Printer;
  verdict: Rule["verdict"];
}) {
  if (verdict === "compatible") return "";

  const isZh = locale === "zh";
  const isFourBySix = paper === "4x6" || paper === "6x4";
  const isThermal = printer === "thermal";

  if (paper === "other") {
    return isZh
      ? "原因：纸张选择了“其他”，无法确认它是否和承运商标签文件、打印机纸张一致。"
      : "Reason: paper is set to Other, so the tool cannot confirm that it matches the carrier label file and printer paper.";
  }

  if (paper === "6x4") {
    return isZh
      ? "原因：6×4 是横向标签，很多承运商标签默认按 4×6 纵向生成，需要额外确认打印方向。"
      : "Reason: 6×4 is a landscape label, while many carrier labels are generated as 4×6 portrait files. Confirm orientation before printing.";
  }

  if (isThermal && !isFourBySix) {
    return isZh
      ? "原因：你选择了热敏打印机，但纸张不是 4×6 标签卷。热敏直打通常配 4×6 标签卷。"
      : "Reason: you selected a thermal printer, but the paper is not a 4×6 label roll. Thermal direct printing usually expects 4×6 labels.";
  }

  if (!isThermal && isFourBySix) {
    return isZh
      ? "原因：你选择了喷墨/激光打印机，但纸张是 4×6 标签。喷墨/激光通常用 A4 或 Letter 纸，打印 4×6 时更容易被缩放或裁切。"
      : "Reason: you selected an inkjet/laser printer with 4×6 paper. Inkjet and laser printers usually use A4 or Letter sheets, so 4×6 labels are easier to scale or crop by mistake.";
  }

  return isZh
    ? "原因：当前纸张和打印机组合不是最稳妥的基础设置，打印前需要先做一次安全测试。"
    : "Reason: this paper and printer combination is not the safest baseline setup. Run a safe test print before using a live label.";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-950">{value}</dd>
    </div>
  );
}
