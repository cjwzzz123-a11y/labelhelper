import type { Carrier, Platform } from "./rules";
import type { FAQItem } from "@/components/FAQ";
import type { RelatedLink } from "@/components/RelatedLinks";
import type { SeoPage, SeoPageKind, TroubleshooterStep } from "./seo-pages";

const commonRelated: RelatedLink[] = [
  { href: "/#checker", title: "Comprobador de tamaño de etiquetas", description: "Revisa papel, escala y orientación antes de imprimir." },
  { href: "/4x6-shipping-label-template", title: "Plantilla de etiqueta 4×6", description: "Descarga una plantilla en blanco para etiquetas de envío 4×6." },
  { href: "/shipping-label-printing-too-small", title: "La etiqueta sale demasiado pequeña", description: "Corrige etiquetas reducidas, problemas de escala y ajustes de impresión." },
];

function platformPage(slug: string, name: string, platform: Platform, carrier: Carrier = "usps"): SeoPage {
  return {
    slug,
    kind: "platform",
    title: `Tamaño de etiqueta de envío de ${name} — Guía 2026`,
    description: `Encuentra el tamaño, escala, papel e impresora adecuados para etiquetas de ${name} en 4×6, Letter y A4.`,
    h1: `Tamaño de etiqueta de envío de ${name}`,
    quickAnswer: `Para vendedores de ${name}, la opción más segura suele ser una etiqueta de 4 × 6 pulgadas impresa al 100% en una impresora térmica. Letter y A4 también pueden funcionar para impresión en hojas si la escala está desactivada y no se recorta el margen libre del código de barras.`,
    defaultCombo: { platform, carrier },
    sections: [
      { heading: `¿Qué tamaño debe tener una etiqueta de ${name}?`, body: `Para la mayoría de vendedores de ${name}, el objetivo práctico es una etiqueta de 4 × 6 pulgadas porque coincide con impresoras térmicas comunes y con los flujos de escaneo de transportistas. Si usas impresora láser o inkjet, imprime el PDF descargado en papel Letter o A4 al 100% / Tamaño real, y corta o dobla solo fuera del área de dirección y código de barras.` },
      { heading: `Mejores ajustes de impresión para ${name}`, body: `Empieza con escala 100%, orientación vertical y el tamaño de papel que coincida con el PDF o el rollo de etiquetas. Evita encabezados y pies del navegador, Ajustar a página, Reducir páginas grandes y valores del driver que cambian el tamaño del PDF sin avisar. Si la vista previa parece centrada pero el papel sale desplazado, imprime primero una plantilla en blanco para separar problemas de alineación de la impresora y del archivo.` },
      { heading: `Problemas comunes al imprimir etiquetas de ${name}`, body: `Las etiquetas demasiado pequeñas casi siempre indican que el cuadro de impresión redujo el PDF. Las etiquetas cortadas suelen indicar tamaño de papel, ancho de rollo u orientación incorrectos. Los códigos de barras borrosos o que no escanean suelen venir de baja densidad, cinta brillante, papel térmico deficiente o falta de margen libre alrededor del código. Usa el comprobador antes de comprar franqueo en volumen.` },
      { heading: "Qué verificar antes de enviar", body: "Confirma que el nombre del transportista, el código de seguimiento, la dirección de destino y la dirección de devolución sean legibles. Si es una impresora, rollo o computadora nueva, mide el borde 4 × 6 impreso con una regla. Después de corregir ajustes, reimprime el mismo PDF cuando la plataforma lo permita en lugar de comprar franqueo duplicado." },
    ],
    faq: commonFaq(name),
    related: commonRelated,
  };
}

function carrierPage(slug: string, name: string, carrier: Carrier): SeoPage {
  return {
    slug,
    kind: "carrier",
    title: `Tamaño de etiqueta de ${name} — Guía completa`,
    description: `Revisa el tamaño, escala y papel recomendados para etiquetas de ${name} en impresoras térmicas, inkjet y láser.`,
    h1: `Tamaño de etiqueta de ${name}`,
    quickAnswer: `Las etiquetas de ${name} suelen ser más seguras como etiquetas térmicas de 4 × 6 pulgadas impresas al 100%. La impresión en hojas puede funcionar si el código de barras no se redimensiona ni se recorta y la etiqueta queda plana sobre el paquete.`,
    defaultCombo: { platform: carrier === "usps" ? "usps_direct" : carrier === "ups" ? "ups_direct" : carrier === "fedex" ? "fedex_direct" : "dhl_direct", carrier },
    sections: [
      { heading: `¿Qué tamaño tiene una etiqueta de ${name}?`, body: `Usa 4 × 6 pulgadas para impresoras térmicas salvo que tu flujo de ${name} indique explícitamente otro formato. Para impresoras de hoja, imprime al 100% en Letter o A4 y conserva el margen libre del código de barras. No recortes el código ni lo dobles sobre el borde del paquete.` },
      { heading: "Impresión térmica frente a impresión en hojas", body: "Las impresoras térmicas son más rápidas y reducen errores de escala porque el tamaño del rollo suele coincidir con la etiqueta. Las impresoras inkjet y láser funcionan mejor cuando descargas el PDF del transportista, lo abres en un visor PDF y desactivas las opciones de reducir para ajustar antes de imprimir." },
      { heading: "Solucionar problemas de escaneo", body: "Si la etiqueta sale cortada, demasiado pequeña, descentrada o no escanea, primero confirma que la escala y el tamaño de papel coincidan con la etiqueta generada. Después revisa densidad, calidad del papel, reflejo de cinta y si se recortó el margen libre del código de barras." },
      { heading: "Comprobaciones antes de entregar al transportista", body: `Antes de entregar un paquete de ${name}, verifica que el código de seguimiento sea nítido, el texto del servicio sea legible y la etiqueta esté pegada plana. Si cambiaste impresora, navegador, visor PDF o material de etiqueta, imprime una prueba en blanco antes de imprimir etiquetas reales.` },
    ],
    faq: [
      { question: `¿Las etiquetas de ${name} se pueden imprimir en 4×6?`, answer: "Sí. 4×6 es el formato común para etiquetas térmicas de envío." },
      { question: "¿Por qué no escanea mi código de barras?", answer: "Puede estar reducido, borroso, cortado o sin margen libre suficiente alrededor." },
      { question: "¿Es seguro imprimir desde el navegador?", answer: "Normalmente es más seguro descargar el PDF del transportista e imprimirlo en Tamaño real desde un visor PDF." },
      { question: `¿Puedo poner cinta sobre un código de barras de ${name}?`, answer: "Evita cinta brillante sobre el código de barras porque el reflejo puede reducir la fiabilidad del escaneo. Si debes usar cinta, mantenla plana y sin arrugas." },
      { question: "¿Qué debo comprobar al cambiar de impresora?", answer: "Haz una prueba al 100%, mide el resultado y confirma que el área del código de barras no esté recortada antes de imprimir franqueo real." },
    ],
    related: commonRelated,
  };
}

function templatePage(slug: string, label: string): SeoPage {
  return {
    slug,
    kind: "template",
    title: `Descarga de plantilla de etiqueta ${label}`,
    description: `Descarga una plantilla en blanco de etiqueta ${label} y comprueba la escala antes de imprimir etiquetas de transportista.`,
    h1: `Plantilla de etiqueta de envío ${label}`,
    quickAnswer: `Descarga la plantilla en blanco ${label}, imprímela al 100% y confirma que los bordes y el área del código de barras queden alineados antes de imprimir franqueo real. La plantilla solo sirve para calibración y no crea franqueo.`,
    sections: [
      { heading: `Cuándo usar una plantilla ${label}`, body: "Usa una plantilla en blanco para confirmar driver, papel, márgenes y orientación antes de imprimir una etiqueta real. Es especialmente útil después de instalar una impresora nueva, cambiar de navegador, cambiar de visor PDF o cargar un rollo nuevo." },
      { heading: "Ajustes de impresión", body: "Usa 100% / Tamaño real. Desactiva Ajustar a página, Reducir páginas grandes y encabezados o pies del navegador. Haz que el tamaño de papel del diálogo de impresión coincida con la plantilla y revisa que el borde salga al tamaño físico esperado." },
      { heading: "Después de imprimir", body: "Mide el resultado con una regla. Si queda más pequeño o más grande de lo esperado, usa la calculadora de escala antes de imprimir etiquetas reales. Si se recorta el borde, revisa orientación, márgenes y si la impresora admite el área imprimible de ese papel." },
      { heading: "Diferencia frente a una etiqueta con franqueo", body: "Esta plantilla es un archivo de prueba en blanco. No incluye código de barras del transportista, número de seguimiento, dirección de destino ni pago de franqueo. Úsala para validar hardware y ajustes, y luego imprime la etiqueta real desde tu plataforma o cuenta del transportista." },
    ],
    faq: [
      { question: "¿Esto es una etiqueta con franqueo?", answer: "No. Es una plantilla de prueba en blanco para revisar escala y alineación." },
      { question: "¿Puedo usarla con una impresora térmica?", answer: "Sí para 4×6. Las plantillas A4 y Letter están pensadas principalmente para impresoras de hoja." },
      { question: "¿Debo imprimir al 100%?", answer: "Sí. Para calibrar, empieza con 100% / Tamaño real." },
      { question: "¿Qué hago si la plantilla impresa queda un poco pequeña?", answer: "Usa la calculadora de escala para estimar un porcentaje corregido, vuelve a imprimir la plantilla y solo después imprime franqueo." },
      { question: "¿Por qué se recortan los bordes de la plantilla?", answer: "Probablemente el tamaño de papel, la orientación, los márgenes del driver o el área imprimible no coinciden con la plantilla. Revisa esos ajustes primero." },
    ],
    related: commonRelated,
  };
}

function troubleshootingTree(slug: string): SeoPage["decisionTree"] {
  const shared = {
    headline: "Encuentra la causa antes de reimprimir",
    intro: "Sigue el síntoma que más se parezca a tu mala impresión. Cada paso apunta a la herramienta más segura antes de comprar franqueo de nuevo.",
    firstAction: "Imprime primero una prueba al 100% / Tamaño real.",
  };
  const trees: Record<string, TroubleshooterStep[]> = {
    "shipping-label-printing-too-small": [
      { title: "Toda la etiqueta queda más pequeña", symptom: "El borde 4×6 mide cerca de 3.7×5.6 o el código de barras se ve comprimido.", action: "Desactiva Ajustar a página, elige Tamaño real y calcula la corrección si la medida con regla sigue fallando.", href: "/tools/scale-calculator", cta: "Calcular escala corregida" },
      { title: "Impresión desde vista previa del navegador", symptom: "El navegador agregó márgenes o redujo el PDF para ajustarlo a la hoja.", action: "Descarga el PDF de la etiqueta e imprímelo desde un visor PDF al 100% antes de cambiar ajustes del marketplace.", href: "/tools/pdf-analyzer", cta: "Revisar tamaño del PDF" },
      { title: "Impresora o rollo nuevo", symptom: "Todas las etiquetas de esta impresora quedan ligeramente pequeñas.", action: "Imprime una hoja de calibración para saber si la reducción viene del driver o del archivo de etiqueta.", href: "/tools/calibration-sheet", cta: "Imprimir hoja de calibración" },
    ],
    "shipping-label-cut-off-when-printing": [
      { title: "Falta un borde", symptom: "La dirección o el código de barras se corta a la izquierda, derecha, arriba o abajo.", action: "Haz coincidir tamaño de papel y orientación con el PDF antes de cambiar cualquier escala.", href: "/#checker", cta: "Revisar papel" },
      { title: "El rollo térmico se desplaza", symptom: "La primera etiqueta está cerca, pero las siguientes se mueven de lado o hacia arriba.", action: "Usa una plantilla en blanco para aislar problemas de alineación del rollo y área imprimible.", href: "/4x6-shipping-label-template", cta: "Descargar plantilla 4×6" },
      { title: "La impresora de hoja recorta", symptom: "La salida Letter o A4 corta la etiqueta cerca del margen no imprimible.", action: "Imprime una página de calibración y confirma los márgenes de la impresora antes de usar franqueo real.", href: "/tools/calibration-sheet", cta: "Imprimir hoja de calibración" },
    ],
    "shipping-label-barcode-not-scanning": [
      { title: "El código de barras es demasiado pequeño", symptom: "Toda la etiqueta se redujo o las barras se ven comprimidas.", action: "Corrige primero la escala; las revisiones del código de barras no son fiables si toda la etiqueta tiene tamaño incorrecto.", href: "/tools/scale-calculator", cta: "Corregir escala" },
      { title: "Se recortó el margen libre", symptom: "El código de barras toca texto, borde de etiqueta, cinta o pliegues del paquete.", action: "Usa el comprobador de imagen para estimar el margen libre alrededor del código de barras.", href: "/tools/barcode-quiet-zone-checker", cta: "Revisar margen libre" },
      { title: "La impresión se ve gris o brillante", symptom: "El código está descolorido, con líneas, arrugado o cubierto por cinta brillante.", action: "Reimprime una prueba después de aumentar densidad o cambiar papel/cinta.", href: "/tools/test-print-pack", cta: "Descargar paquete de prueba" },
    ],
    "shipping-label-not-centered": [
      { title: "Desplazamiento constante", symptom: "Todas las etiquetas empiezan demasiado a la izquierda, derecha, arriba o abajo.", action: "Imprime una hoja de calibración para separar offset del driver y diseño de la etiqueta.", href: "/tools/calibration-sheet", cta: "Imprimir hoja de calibración" },
      { title: "Tamaño de medio incorrecto", symptom: "La vista previa está centrada, pero la salida física aparece desplazada o girada.", action: "Revisa la combinación de plataforma, transportista, papel e impresora antes de editar márgenes.", href: "/#checker", cta: "Revisar configuración" },
      { title: "La plantilla también queda descentrada", symptom: "Una prueba en blanco 4×6 tiene el mismo problema de alineación.", action: "Corrige guías de papel, carga del rollo u offsets del driver antes de reimprimir franqueo.", href: "/4x6-shipping-label-template", cta: "Descargar plantilla 4×6" },
    ],
    "fit-to-page-vs-actual-size-shipping-label": [
      { title: "Elegir la escala de impresión", symptom: "Ajustar a página parece más seguro en la vista previa, pero cambia el tamaño del código de barras.", action: "Usa primero Tamaño real y mide la salida en lugar de confiar solo en la vista previa.", href: "/tools/scale-calculator", cta: "Medir y calcular" },
      { title: "No sabes qué tamaño tiene el PDF", symptom: "El archivo puede ser Letter, A4 o 4×6, y el cuadro de impresión está adivinando.", action: "Lee localmente el tamaño de página del PDF antes de elegir papel o escala.", href: "/tools/pdf-analyzer", cta: "Analizar PDF" },
      { title: "Necesitas una prueba segura", symptom: "Vas a imprimir franqueo pagado con una configuración nueva.", action: "Imprime primero un paquete de prueba con marca de agua para no desperdiciar etiquetas reales.", href: "/tools/test-print-pack", cta: "Descargar paquete de prueba" },
    ],
  };

  return { ...shared, steps: trees[slug] ?? trees["shipping-label-printing-too-small"] };
}

function troublePage(slug: string, symptom: string, fix: string): SeoPage {
  return {
    slug,
    kind: "troubleshooter",
    title: `${symptom} — Cómo corregir la impresión de etiquetas`,
    description: `Corrige problemas de impresión de etiquetas: ${symptom.toLowerCase()}. Revisa escala, papel, márgenes, orientación y margen libre del código de barras.`,
    h1: `${symptom} — Cómo corregirlo`,
    quickAnswer: fix,
    decisionTree: troubleshootingTree(slug),
    sections: [
      { heading: "Paso 1: revisa la escala de impresión", body: "Abre el cuadro de impresión y elige 100% o Tamaño real. Evita Ajustar a página porque puede reducir el código de barras y los límites de la etiqueta. Si imprimiste desde una vista previa del navegador, descarga el PDF y vuelve a intentar desde un visor PDF." },
      { heading: "Paso 2: revisa papel y orientación", body: "Confirma que el papel de la impresora coincida con el PDF de la etiqueta. Un rollo 4×6 no debe imprimirse como Letter, y las hojas Letter no deben recortar el área de etiqueta. Si la salida está girada, cambia vertical/horizontal antes de ajustar escala." },
      { heading: "Paso 3: imprime una calibración", body: "Imprime una plantilla en blanco antes de comprar etiquetas nuevas o reimprimir franqueo. Si la plantilla está mal, la etiqueta del transportista también saldrá mal. Mide el borde impreso y compáralo con el tamaño objetivo." },
      { heading: "Paso 4: decide qué corregir después", body: "Si toda la etiqueta tiene tamaño incorrecto, corrige escala. Si falta solo un borde, corrige tamaño de papel, márgenes o alineación del rollo. Si el tamaño es correcto pero no escanea, revisa densidad, margen libre del código de barras, reflejo de cinta y daños en la etiqueta." },
    ],
    faq: [
      { question: "¿Debo comprar franqueo de nuevo?", answer: "Normalmente no. Primero corrige los ajustes de impresión y reimprime el PDF original si tu plataforma lo permite." },
      { question: "¿Por qué importa Tamaño real?", answer: "Los escáneres esperan que las barras y el margen libre se mantengan dentro de tolerancia. Reducir la etiqueta puede hacer que falle el escaneo." },
      { question: "¿La cinta puede causar problemas de escaneo?", answer: "Sí. La cinta brillante sobre un código de barras puede reflejar luz y reducir la fiabilidad del escaneo." },
      { question: "¿Qué pruebo primero si tengo prisa?", answer: "Descarga el PDF de la etiqueta, imprime desde un visor PDF al 100% / Tamaño real y verifica que el tamaño de papel seleccionado coincida con el papel de la impresora." },
      { question: "¿Cómo sé si el problema es la impresora o el archivo?", answer: "Imprime una plantilla en blanco al 100%. Si la plantilla también está mal, corrige la impresora antes de cambiar el archivo o comprar nuevo franqueo." },
    ],
    related: commonRelated,
  };
}

function commonFaq(name: string): FAQItem[] {
  return [
    { question: `¿Cuál es el mejor tamaño de etiqueta para ${name}?`, answer: "Una etiqueta de 4 × 6 pulgadas es el valor predeterminado más seguro para impresoras térmicas y la mayoría de flujos de transportistas." },
    { question: "¿Debo usar Ajustar a página?", answer: "No. Empieza con 100% o Tamaño real para no reducir el código de barras." },
    { question: "¿Puedo usar una impresora normal?", answer: "Sí. Usa papel Letter o A4 y confirma que el código de barras impreso sea claro y no esté cortado." },
    { question: `¿Por qué mi etiqueta de ${name} sale demasiado pequeña?`, answer: "La causa habitual es escala del navegador o del PDF. Desactiva Ajustar a página, elige Tamaño real y coincide el tamaño de papel antes de reimprimir." },
    { question: "¿Necesito comprar franqueo otra vez después de una mala impresión?", answer: "Normalmente no. Corrige primero los ajustes y reimprime el PDF original si tu plataforma o cuenta de transportista todavía lo permite." },
  ];
}

export const seoPagesEs: SeoPage[] = [
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
  troublePage("shipping-label-printing-too-small", "La etiqueta de envío sale demasiado pequeña", "La mayoría de etiquetas pequeñas se deben a Ajustar a página, tamaño de papel incorrecto o márgenes del navegador. Reimprime al 100% / Tamaño real y mide una plantilla en blanco si el problema continúa."),
  troublePage("shipping-label-cut-off-when-printing", "La etiqueta de envío se corta al imprimir", "Las etiquetas cortadas suelen indicar que el tamaño de papel, los márgenes o la orientación no coinciden con el PDF. Corrige eso antes de cambiar franqueo o comprar otro rollo."),
  troublePage("shipping-label-barcode-not-scanning", "El código de barras de la etiqueta no escanea", "Los fallos de escaneo suelen venir de reducción, borrosidad, reflejo de cinta o falta de margen libre. Confirma primero la escala y después revisa calidad de impresión y colocación."),
  troublePage("shipping-label-not-centered", "La etiqueta de envío no está centrada", "Las etiquetas descentradas suelen deberse a offsets del driver, alineación del rollo o márgenes de página. Usa una plantilla en blanco para separar alineación de impresora y problemas del archivo."),
  troublePage("fit-to-page-vs-actual-size-shipping-label", "Ajustar a página vs Tamaño real para etiquetas de envío", "Usa primero Tamaño real o 100%. Ajustar a página puede reducir etiquetas y hacer menos fiable el código de barras, aunque la vista previa se vea más limpia."),
];

export const esSeoPageKinds: Record<SeoPageKind, string> = {
  platform: "plataforma",
  carrier: "transportista",
  template: "plantilla",
  troubleshooter: "solución de problemas",
};
