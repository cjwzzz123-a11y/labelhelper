import type { Carrier, Platform } from "./rules";
import type { FAQItem } from "@/components/FAQ";
import type { RelatedLink } from "@/components/RelatedLinks";
import type { SeoPage, SeoPageKind } from "./seo-pages";

const commonRelated: RelatedLink[] = [
  { href: "/#checker", title: "Comprobador de tamaño de etiquetas", description: "Revisa papel, escala y orientación antes de imprimir." },
  { href: "/4x6-shipping-label-template", title: "Plantilla de etiqueta 4×6", description: "Descarga una plantilla en blanco para etiquetas de envío 4×6." },
  { href: "/shipping-label-printing-too-small", title: "La etiqueta sale demasiado pequeña", description: "Corrige etiquetas reducidas, problemas de escala y ajustes de impresión." },
];

function platformPage(slug: string, name: string, platform: Platform, carrier: Carrier = "usps"): SeoPage {
  return {
    slug,
    kind: "platform",
    title: `Tamaño de etiqueta de envío de ${name}`,
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
    title: `Tamaño de etiqueta de ${name}`,
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
  const content = label === "4×6" ? {
    quickAnswer: "Usa este archivo en blanco de 4 × 6 pulgadas para probar un rollo térmico o una hoja 4×6 antes de imprimir franqueo. Imprime al 100% / Tamaño real, mide ambos lados y detente si la página PDF, el medio del driver y el material cargado no coinciden en 4×6.",
    sections: [
      { heading: "Prueba un recorrido de medio 4×6", body: "Esta plantilla aísla el recorrido de impresoras térmicas comunes y de hojas cortadas a 4×6. Úsala después de cambiar rollo, impresora, driver, equipo o visor PDF. Solo comprueba tamaño físico, avance y alineación; no demuestra que un código de transportista será aceptado." },
      { heading: "Haz coincidir los tres tamaños", body: "Confirma una página PDF de 4 × 6 pulgadas, medio 4×6 en el sistema o driver y material físico 4×6. Usa 100% / Tamaño real y desactiva encabezados, pies y Ajustar. No compenses con un porcentaje personalizado un medio incorrecto en el driver." },
      { heading: "Interpreta la forma del fallo", body: "Un borde uniformemente pequeño o grande apunta a escala. El mismo lado ausente en cada etiqueta apunta a anchura, guías u origen. Una posición que cambia apunta a avance o detección. Barras tenues o rayas indican calidad de impresión, no tamaño de página." },
      { heading: "Exige una prueba repetible", body: "Mide un límite completo de 4 × 6 pulgadas y repítelo en una segunda prueba en blanco. Si hay recorte o cambia el avance, sigue la carga y calibración del modelo exacto. El archivo no contiene dirección, seguimiento ni franqueo pagado." },
    ],
    faq: [
      { question: "¿El PDF 4×6 en blanco es una etiqueta real?", answer: "No. No contiene dirección, código de seguimiento ni franqueo; es una prueba física de calibración." },
      { question: "¿Qué debe coincidir antes de imprimir?", answer: "La página PDF, el medio del driver y el material cargado deben ser 4 × 6 pulgadas." },
      { question: "¿Por qué toda la prueba queda pequeña?", answer: "Es más probable un ajuste de escala o una discordancia de página/driver. Restaura tamaños coincidentes y Tamaño real antes de corregir porcentajes." },
      { question: "¿Por qué cambia el borde ausente?", answer: "Una posición variable apunta a guías, avance o detección. Usa el procedimiento del modelo exacto." },
      { question: "¿Cuándo puedo reimprimir franqueo?", answer: "Cuando una prueba en blanco medida se repita sin recortes; luego usa la ruta de reimpresión permitida por el emisor." },
    ],
    reviewChecklist: ["Confirma 4×6 en PDF, driver y medio.", "Mide ambos lados físicos a Tamaño real.", "Exige una prueba repetible antes de reimprimir franqueo."],
  } : label === "A4" ? {
    quickAnswer: "Usa esta página en blanco de 210 × 297 mm para probar una ruta de impresión A4. Elige papel A4 y 100% / Tamaño real, revisa orientación y márgenes no imprimibles, y no conviertas un documento A4 exigido por el flujo a 4×6 solo para llenar otro medio.",
    sections: [
      { heading: "Usa A4 para un origen o flujo A4", body: "La plantilla comprueba una impresora inkjet o láser que debe producir una página A4. Úsala tras cambiar bandeja, valores del driver o visor. Una etiqueta 4×6 real puede conservar su tamaño sobre una hoja mayor; estirarla para llenar A4 cambia su geometría." },
      { heading: "Define el contrato de la hoja", body: "Carga A4, selecciona A4 en el driver e imprime el PDF A4 al 100% / Tamaño real con la orientación prevista. Desactiva encabezados y pies. No elijas Letter por parecido: ambos formatos tienen dimensiones y áreas imprimibles distintas." },
      { heading: "Separa márgenes de errores de escala", body: "Si todas las medidas cambian proporcionalmente, revisa la escala. Si falta solo un borde externo y las medidas interiores son correctas, el límite probable es el área no imprimible. Prefiere el diseño A4 del emisor o una ruta de margen admitida antes de reducir contenido crítico." },
      { heading: "Protege documentos de varias partes", body: "Un archivo A4 emitido puede incluir varias etiquetas, aduanas u otro contenido necesario. Revisa todas las páginas antes de extraer. La plantilla en blanco no identifica el significado del documento ni autoriza descartar contenido contiguo." },
    ],
    faq: [
      { question: "¿Qué tamaño tiene A4?", answer: "A4 mide 210 × 297 mm. La página, el driver y la hoja cargada deben coincidir." },
      { question: "¿Puedo seleccionar Letter?", answer: "No para esta prueba. Letter y A4 difieren y sustituirlos puede provocar recorte o espacio inesperado." },
      { question: "¿Debo usar Ajustar?", answer: "Empieza con 100% / Tamaño real sobre A4 coincidente. Ajustar cambia la geometría y puede ocultar una discordancia." },
      { question: "¿Puedo recortar un documento A4 a 4×6?", answer: "Solo si el emisor identifica una etiqueta completa independiente y permite esa ruta. Detente si hay contenido contiguo obligatorio o el significado es incierto." },
      { question: "¿Qué demuestra un borde exterior recortado?", answer: "Puede revelar el área no imprimible, pero no prueba que debas reducir la etiqueta real. Revisa el flujo de origen y el manual de la impresora." },
    ],
    reviewChecklist: ["Confirma A4 en origen, driver y hoja.", "Revisa todas las páginas y contenido contiguo.", "Distingue margen no imprimible de escala incorrecta."],
  } : {
    quickAnswer: "Usa esta página en blanco de 8,5 × 11 pulgadas para probar una ruta US Letter. Elige Letter y 100% / Tamaño real, revisa orientación y márgenes, y conserva cualquier etiqueta menor en sus dimensiones de origen en vez de ampliarla para llenar la hoja.",
    sections: [
      { heading: "Usa Letter para un origen o flujo Letter", body: "Esta plantilla prueba una impresora inkjet o láser cargada con papel de 8,5 × 11 pulgadas. Úsala tras cambiar bandeja, driver o visor. Una etiqueta 4×6 independiente puede quedar a su tamaño en Letter; no debe ampliarse solo para ocupar más hoja." },
      { heading: "Haz coincidir PDF, driver y bandeja", body: "Selecciona Letter en el driver e imprime el PDF Letter al 100% / Tamaño real con la orientación prevista. Desactiva encabezados, pies y Ajustar. No sustituyas A4: los formatos difieren en ancho, alto y comportamiento de márgenes." },
      { heading: "Diagnostica recortes sin reducir el código", body: "Un error proporcional apunta a escala. Un borde de hoja ausente con medidas interiores correctas apunta al área imprimible o a orientación. Usa un diseño Letter nativo o corrige el papel antes de reducir una etiqueta completa." },
      { heading: "Conserva intacto el contenido emitido", body: "Antes de cortar o extraer una etiqueta de un PDF Letter real, revisa cada página y clasifica el documento. Albaranes, aduanas o varias etiquetas únicas pueden ser obligatorios. La prueba en blanco valida la hoja, no autoriza eliminar contenido." },
    ],
    faq: [
      { question: "¿Qué tamaño tiene US Letter?", answer: "US Letter mide 8,5 × 11 pulgadas. Haz coincidir PDF, driver y bandeja." },
      { question: "¿Letter es igual que A4?", answer: "No. Sus dimensiones difieren y el cambio puede modificar márgenes o recortar un borde." },
      { question: "¿Una etiqueta 4×6 debe llenar la hoja Letter?", answer: "No. Conserva una etiqueta 4×6 real en 4 × 6 pulgadas salvo que el emisor entregue otro diseño nativo." },
      { question: "¿Por qué solo se recorta el borde exterior?", answer: "La orientación o el área no imprimible puede ser responsable. Confírmalo antes de cambiar la escala del contenido." },
      { question: "¿Cuándo debo detenerme?", answer: "Cuando el tamaño de origen sea incierto, se perderían documentos obligatorios o la página en blanco aún no coincida con Letter." },
    ],
    reviewChecklist: ["Confirma Letter en PDF, driver y bandeja.", "Conserva una etiqueta 4×6 en su tamaño original.", "Revisa todas las páginas antes de extraer contenido."],
  };

  return {
    slug,
    kind: "template",
    title: `Descarga de plantilla de etiqueta ${label}`,
    description: `Descarga una plantilla en blanco de etiqueta ${label} y comprueba la escala antes de imprimir etiquetas de transportista.`,
    h1: `Plantilla de etiqueta de envío ${label}`,
    updatedAt: "2026-08-29",
    evidenceNote: "Este flujo con archivo en blanco verifica tamaño físico, avance y límites imprimibles. No verifica códigos, autoriza conversiones ni garantiza aceptación por el transportista.",
    ...content,
    related: commonRelated,
  };
}

type ReviewedTroublePage = Pick<SeoPage, "description" | "quickAnswer" | "updatedAt" | "evidenceNote" | "decisionTree" | "sections" | "faq" | "reviewChecklist" | "sources">;

const reviewedTroublePages: Record<string, ReviewedTroublePage> = {
  "shipping-label-printing-too-small": {
    description: "Diagnostica una etiqueta de envío demasiado pequeña separando una hoja completa reducida, un error real de escala 4×6 y una impresión débil.",
    quickAnswer: "Primero decide si se comprimió una página Letter/A4 completa en papel 4×6, si una página 4×6 real se redujo de forma uniforme o si solo falla la calidad de impresión. Haz coincidir la página de origen, el medio del driver y el papel físico antes de usar una escala personalizada; reimprime desde el PDF original sin modificar solo cuando una prueba en blanco salga bien.",
    updatedAt: "2026-08-29",
    evidenceNote: "Marco general de diagnóstico: Adobe documenta el comportamiento de Ajustar y Tamaño real, y Zebra documenta la calibración de medios térmicos. Estas fuentes respaldan las ramas de diagnóstico, no la aceptación por un transportista ni todos los modelos de impresora.",
    decisionTree: {
      headline: "Separa la reducción de página de una impresión deficiente",
      intro: "Mide primero el límite de la página y sigue la rama que coincida con el PDF de origen, el medio físico y el síntoma impreso.",
      firstAction: "No amplíes la etiqueta hasta saber si la página de origen es 4×6, Letter o A4.",
      steps: [
        { title: "La página PDF es mayor que el rollo", symptom: "Una página completa Letter o A4 se está ajustando a una sola etiqueta térmica 4×6.", action: "Inspecciona el cuadro de página del PDF. Obtén el formato 4×6 del emisor o extrae únicamente un área de etiqueta completa; no amplíes la salida miniaturizada.", href: "/tools/pdf-analyzer", cta: "Inspeccionar la página PDF" },
        { title: "Todo el borde es uniformemente pequeño", symptom: "Un origen 4×6 real se imprime proporcionalmente más pequeño en un medio 4×6 del mismo tamaño.", action: "Confirma 4×6 en el driver, desactiva Ajustar, imprime una plantilla en blanco y calcula una corrección solo si el recorrido del medio ya coincide.", href: "/tools/scale-calculator", cta: "Medir el error de escala" },
        { title: "Solo las barras o el texto se ven débiles", symptom: "El borde de la etiqueta es correcto, pero las líneas finas se ven borrosas, grises o cortadas.", action: "Trátalo como un problema de calidad, no de escala. Prueba densidad, velocidad, material y estado del cabezal antes de otra etiqueta real.", href: "/tools/test-print-pack", cta: "Probar la calidad de impresión" },
      ],
    },
    sections: [
      { heading: "1. Decide si es pequeña la página o solo la etiqueta", body: "Lee el cuadro de página del PDF antes de tocar la escala. Si una página Letter o A4 se ajusta a un rollo 4×6, todos los elementos quedan diminutos; si una página 4×6 real sale a 3,8×5,7 pulgadas, apunta a un cambio del driver o de escala. Si el límite físico es correcto pero las barras finas se ven débiles, pasa a comprobar la calidad en vez de ampliar la página." },
      { heading: "2. Sigue la rama de impresora térmica", body: "Para un origen 4×6 independiente, configura tanto el driver del sistema como el diálogo de impresión con el medio 4×6 cargado. Desactiva Ajustar e imprime una plantilla 4×6 en blanco. Si también sale pequeña, revisa el medio del driver y la calibración específica del modelo antes de aplicar un porcentaje personalizado." },
      { heading: "3. Sigue la rama de inkjet o láser", body: "En papel Letter o A4, conserva las dimensiones previstas de una etiqueta 4×6 real en vez de estirarla para llenar la hoja. Si el origen ya es una composición de hoja, selecciona exactamente ese tamaño. Adobe define Ajustar como redimensionar una página al área imprimible y Tamaño real como no aplicar escala; la vista previa no demuestra el tamaño físico." },
      { heading: "4. Detente antes de reimprimir una etiqueta real", body: "No uses la impresión pequeña si cambió el código, su espacio blanco, la dirección, el número de seguimiento o el texto del servicio. Conserva la transacción y el PDF originales, exige una prueba en blanco medida y después usa la ruta de reimpresión vigente del emisor si sigue disponible. No compres franqueo duplicado solo para diagnosticar la impresora." },
    ],
    faq: [
      { question: "¿Por qué un PDF Letter quedó diminuto en mi impresora térmica?", answer: "Es probable que el sistema ajustara toda la página Letter a una etiqueta 4×6. Obtén el formato 4×6 del emisor o extrae una sola etiqueta completa únicamente cuando la estructura del documento lo permita." },
      { question: "¿Debo aumentar la escala por encima del 100%?", answer: "Solo después de que la página PDF, el medio del driver y el papel físico coincidan y una prueba en blanco medida aún muestre un error uniforme. Adivinar un valor mayor puede recortar otro borde." },
      { question: "¿Qué cambia con una impresora inkjet o láser?", answer: "Una etiqueta 4×6 puede quedar sin cambios dentro de una hoja Letter o A4. Selecciona la hoja física y conserva el límite de la etiqueta en lugar de llenar la página." },
      { question: "¿Qué cambia con una impresora térmica?", answer: "La página de origen y el driver deben coincidir con el rollo, y la impresora puede requerir una calibración de medios específica del modelo. No ajustes una hoja completa a una sola etiqueta del rollo." },
      { question: "¿Cuándo debo detenerme y reimprimir?", answer: "Detente si cambió cualquier contenido crítico para el escaneo o la prueba en blanco aún falla. Reimprime la etiqueta original solo después de que la configuración corregida pase la prueba." },
    ],
    reviewChecklist: ["Identifica el tamaño de página del PDF antes de cambiar la escala.", "Usa la rama térmica o de hoja que coincida con el medio cargado.", "Exige una prueba en blanco medida antes de reimprimir una etiqueta real."],
    sources: [
      { label: "Tamaño de página para imprimir en Adobe Acrobat", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe define el comportamiento de Ajustar, Tamaño real, Reducir páginas grandes y la escala personalizada." },
      { label: "Calibración de medios SmartCal de Zebra", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documenta cómo una impresora térmica representativa mide el material de etiqueta y los parámetros de detección." },
    ],
  },
  "shipping-label-cut-off-when-printing": {
    description: "Localiza si la etiqueta se recortó en el PDF de origen, el recorrido térmico o el área imprimible Letter/A4 y define una reimpresión segura.",
    quickAnswer: "Compara el PDF original con la impresión. Si el borde ya falta en el archivo, regenera el documento en el flujo que lo emitió. Si solo se corta en papel, sigue la rama del rollo térmico o de la hoja; nunca reduzcas toda la etiqueta solo para revelar un borde perdido del código de barras.",
    updatedAt: "2026-08-29",
    evidenceNote: "Marco general de diagnóstico: Adobe respalda el comportamiento de tamaño del PDF y Zebra la rama de calibración térmica. Los botones, offsets y áreas imprimibles concretos deben consultarse en el manual del modelo exacto.",
    decisionTree: {
      headline: "Localiza dónde desapareció el borde",
      intro: "Compara el PDF original con la salida física antes de cambiar la escala: un recorte en el origen y un recorte de impresora requieren soluciones distintas.",
      firstAction: "Detente si falta cualquier código, dirección, texto de servicio o dato de enrutamiento.",
      steps: [
        { title: "El borde ya falta en el PDF", symptom: "El archivo descargado está incompleto antes de llegar al diálogo de impresión.", action: "Detente. Vuelve al flujo del pedido o envío que lo emitió y regenera el documento; la escala de impresora no puede restaurar contenido ausente.", href: "/tools/pdf-analyzer", cta: "Inspeccionar el PDF de origen" },
        { title: "Siempre se recorta el mismo borde térmico", symptom: "El PDF está completo, pero cada etiqueta del rollo pierde el mismo lado.", action: "Haz coincidir el medio del driver, vuelve a cargar y centrar las guías y calibra la impresora. No reduzcas todo el código para ocultar un error de origen o avance.", href: "/tools/calibration-sheet", cta: "Probar la alineación térmica" },
        { title: "Se recorta un borde de la hoja", symptom: "La salida Letter o A4 alcanza el área no imprimible de la impresora.", action: "Usa el tamaño de hoja y la orientación que coincidan con el origen. Imprime un límite en blanco antes de decidir si necesitas una composición de hoja nativa del flujo.", href: "/letter-shipping-label-template", cta: "Probar el límite de la hoja" },
      ],
    },
    sections: [
      { heading: "1. Encuentra el primer borde que falta", body: "Abre el PDF sin modificar e inspecciona todas las páginas antes de imprimir. Si el código, la dirección o la marca de servicio ya faltan, detente y vuelve al emisor: ningún ajuste puede reconstruir el origen. Si el PDF está completo, anota papel, escala, orientación y borde físico recortado." },
      { heading: "2. Diagnostica un recorte térmico de un borde", body: "Si todas las etiquetas 4×6 pierden el mismo borde, confirma el medio del driver, vuelve a cargar y centrar las guías y ejecuta la calibración documentada. Si el recorte cambia en etiquetas sucesivas, investiga la detección de avance o el material suelto en vez de cambiar la escala del PDF." },
      { heading: "3. Diagnostica un recorte en Letter o A4", body: "Una impresora de escritorio puede tener margen no imprimible. Adobe indica que Tamaño real no aplica escala y puede recortar una página que no cabe en el papel seleccionado. Usa el tamaño y orientación del origen o regenera una composición nativa; Ajustar puede ocultar el problema reduciendo todo." },
      { heading: "4. Define la condición para reimprimir", body: "Una plantilla en blanco con el mismo visor, driver y medio debe imprimirse completa antes de otra etiqueta pagada. Reimprime desde el PDF original si se recortó el código, su zona libre, el seguimiento, la dirección, el servicio o una marca de enrutamiento. Escala al emisor si el origen sigue incompleto." },
    ],
    faq: [
      { question: "¿Cómo sé si recortó el PDF o la impresora?", answer: "Si falta el borde en el PDF original, regenera el archivo. Si el PDF está completo pero una plantilla y la etiqueta pierden el mismo borde, el responsable es el recorrido de impresión." },
      { question: "¿Por qué siempre falta el mismo borde térmico?", answer: "Un borde fijo apunta al tamaño del medio, las guías, el origen imprimible o la calibración. Sigue el manual del modelo exacto antes de usar offsets." },
      { question: "¿Por qué cambia el borde recortado entre etiquetas?", answer: "Los bordes variables apuntan más a la detección de avance, el desplazamiento del rollo o guías sueltas que a un recorte fijo del PDF." },
      { question: "¿Ajustar a página resuelve un recorte de hoja?", answer: "Puede mostrar el borde al redimensionar toda la página, pero también cambia el código de barras. Prefiere papel coincidente o un diseño de origen correcto." },
      { question: "¿Cuándo debo detenerme?", answer: "Detente cuando falte contenido activo, una plantilla siga recortándose o el PDF de origen esté incompleto. Reimprime solo después de corregir el recorrido responsable." },
    ],
    reviewChecklist: ["Verifica que el borde exista en el PDF original.", "Usa el patrón fijo o cambiante del recorte para elegir la rama de impresora.", "Exige una plantilla en blanco completa antes de reimprimir franqueo."],
    sources: [
      { label: "Tamaño de página para imprimir en Adobe Acrobat", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe indica que Tamaño real imprime sin escala y recorta páginas o selecciones que no caben." },
      { label: "Calibración de medios SmartCal de Zebra", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documenta la detección y calibración de medios térmicos representativos con separación, marca o continuos." },
    ],
  },
  "shipping-label-barcode-not-scanning": {
    description: "Diagnostica un código de etiqueta que no escanea revisando escala, zona libre, contraste, daños y salida sin prometer aceptación del transportista.",
    quickAnswer: "Trata el fallo de un teléfono o lector como un síntoma, no como un veredicto del transportista. Restaura primero la geometría original y revisa después la zona libre, el contraste, los daños en las barras y la colocación plana. Reimprime desde el archivo original si el símbolo se redimensionó, recortó, rayó, arrugó o cubrió.",
    updatedAt: "2026-08-29",
    evidenceNote: "Marco general de diagnóstico: GS1 identifica factores habituales de calidad, Zebra documenta una ruta de calidad térmica y una fuente del transportista cubre la colocación. Esta página no verifica códigos ni garantiza su aceptación.",
    decisionTree: {
      headline: "Revisa la geometría antes de la calidad de impresión",
      intro: "Un código puede fallar porque cambió toda la página, las barras se imprimieron mal o se dañaron el espacio circundante y la colocación.",
      firstAction: "Un escaneo con teléfono es una pista, no una verificación normativa ni la aceptación del transportista.",
      steps: [
        { title: "La etiqueta se redimensionó o recortó", symptom: "El límite impreso difiere del origen o desapareció el espacio blanco alrededor del código.", action: "Corrige primero tamaño de página y escala. Una prueba de escaneo no aporta evidencia útil mientras todo el símbolo esté alterado.", href: "/tools/scale-calculator", cta: "Verificar la escala física" },
        { title: "Las barras están tenues, rotas o ensanchadas", symptom: "El límite es correcto, pero rayas térmicas o tinta corrida cambian las barras.", action: "Ejecuta una prueba de calidad. En térmicas revisa material, densidad, velocidad y cabezal; en inkjet o láser usa una salida limpia y de alto contraste.", href: "/tools/test-print-pack", cta: "Probar la calidad" },
        { title: "El código impreso parece limpio", symptom: "Aun así toca un borde, pliegue, cinta o impresión cercana, o solo una app de teléfono indica que escanea.", action: "Revisa el espacio libre y la colocación plana. Reimprime si está dañado y consulta al emisor o transportista si la aceptación sigue siendo incierta.", href: "/tools/barcode-quiet-zone-checker", cta: "Revisar el espacio circundante" },
      ],
    },
    sections: [
      { heading: "1. Restaura la geometría antes de probar el escaneo", body: "Compara el límite físico y el código con el PDF original. Si Ajustar, una captura, un recorte o el medio incorrecto cambió el símbolo o su espacio blanco, corrige primero página y escala. Escanear repetidamente una salida alterada no la valida." },
      { heading: "2. Revisa zona libre, contraste y daños", body: "GS1 incluye el tamaño de la zona libre, contraste, tamaño del símbolo, altura de barras, interferencias del embalaje, deterioro y posición entre las comprobaciones habituales. Úsalas como categorías de diagnóstico, no como límites numéricos universales de un símbolo de transportista." },
      { heading: "3. Separa calidad térmica y de hoja", body: "Para impresión térmica directa, prueba material, cabezal, densidad y velocidad con el manual del modelo; Zebra documenta que calor, velocidad y medio actúan juntos. En inkjet o láser, usa negro limpio sobre material blanco adecuado y rechaza tinta corrida, pérdidas o bajo contraste." },
      { heading: "4. Detente ante un código obstruido o dudoso", body: "Mantén el código plano y lejos de pliegues, juntas y cinta brillante. Reimprime si las barras están rotas, falta espacio libre o la etiqueta está dañada. El éxito de una cámara solo es una comprobación rápida; pregunta al emisor o transportista si la entrega sigue siendo incierta." },
    ],
    faq: [
      { question: "¿Un escaneo con teléfono demuestra que la etiqueta será aceptada?", answer: "No. Es una pista de diagnóstico, no una verificación normativa ni la aprobación del transportista." },
      { question: "¿Qué reviso antes de cambiar la oscuridad de la impresora?", answer: "Confirma que el límite de página y el código no se redimensionaron ni recortaron. Los errores geométricos se resuelven antes de ajustar densidad." },
      { question: "¿Qué deben probar quienes usan impresora térmica?", answer: "Usa el procedimiento del modelo exacto para comprobar material, cabezal, densidad y velocidad después de corregir tamaño y calibración." },
      { question: "¿Qué deben probar quienes usan inkjet o láser?", answer: "Busca contraste negro-blanco, bordes limpios, tinta corrida, pérdidas y daños; mantén cinta y pliegues fuera del código." },
      { question: "¿Cuándo conviene reimprimir en vez de repetir el escaneo?", answer: "Reimprime si el símbolo está redimensionado, recortado, rayado, borroso, arrugado, mojado o cubierto, o si falta el espacio circundante requerido." },
    ],
    reviewChecklist: ["Restaura la geometría original antes de probar escaneos.", "Revisa por separado zona libre, contraste, daños y colocación.", "Reimprime la salida dañada; no trates un escaneo de teléfono como aprobación."],
    sources: [
      { label: "Comprobaciones de calidad de códigos de barras de GS1", url: "https://support.gs1.org/support/solutions/articles/43000734141-what-should-i-check-to-ensure-good-quality-barcodes-", checkedAt: "2026-08-29", supports: "GS1 incluye zona libre, contraste, tamaño, altura de barras, daños, interferencias del embalaje y posición como factores de calidad." },
      { label: "Ajuste de calidad de impresión térmica de Zebra", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/c-zd620-420-print-operations/t-zd421-zd621-ug-adjusting-the-print-quality.html", checkedAt: "2026-08-29", supports: "Zebra documenta la interacción entre calor o densidad, velocidad y material cargado en impresoras térmicas representativas." },
      { label: "Colocación de etiquetas de envío de FedEx", url: "https://www.fedex.com/en-us/shipping/create-shipping-label.html", checkedAt: "2026-08-29", supports: "FedEx aconseja mantener los códigos planos, lejos de juntas y bordes y sin cinta transparente encima." },
    ],
  },
  "shipping-label-not-centered": {
    description: "Decide si una etiqueta descentrada es solo estética o nace del PDF, el avance térmico, el origen del driver o los márgenes de hoja.",
    quickAnswer: "Una etiqueta no necesita márgenes blancos simétricos para ser utilizable. Confirma primero que el PDF esté completo y a la escala prevista. Corrige el avance térmico o el offset de origen solo si se repite el mismo desplazamiento medido; en A4 o Letter, no muevas contenido completo a Tamaño real salvo que esté recortado o girado.",
    updatedAt: "2026-08-29",
    evidenceNote: "Marco general de diagnóstico: las fuentes explican el tamaño del PDF y una calibración térmica representativa. No se presenta el centrado visual como requisito del transportista; los offsets del modelo exigen su manual.",
    decisionTree: {
      headline: "Decide si el centrado es estético o destructivo",
      intro: "Localiza el desplazamiento en el PDF de origen, el recorrido térmico o el área imprimible de la hoja antes de mover contenido.",
      firstAction: "No reduzcas una etiqueta completa solo para que el espacio blanco parezca simétrico.",
      steps: [
        { title: "El propio PDF está descentrado", symptom: "El cuadro de página o el diseño ya aparecen desplazados en el archivo descargado.", action: "Vuelve al formato coincidente del emisor o extrae intencionadamente una etiqueta completa. No añadas un offset de impresora para compensar un origen defectuoso.", href: "/tools/pdf-analyzer", cta: "Inspeccionar el cuadro PDF" },
        { title: "Cada etiqueta térmica tiene el mismo offset", symptom: "Una plantilla 4×6 y la etiqueta real comienzan en la misma posición incorrecta.", action: "Vuelve a cargar el rollo, centra las guías, calibra la detección y solo entonces usa un offset horizontal o vertical documentado para tu modelo.", href: "/tools/calibration-sheet", cta: "Medir el desplazamiento" },
        { title: "Solo la colocación en hoja parece desigual", symptom: "La etiqueta completa está a Tamaño real en Letter o A4, pero no se ve centrada.", action: "No muevas ni escales contenido crítico solo por simetría. Verifica que todo quepa en el área imprimible y reimprime solo si algo está recortado o girado.", href: "/letter-shipping-label-template", cta: "Comprobar el ajuste en hoja" },
      ],
    },
    sections: [
      { heading: "1. Separa el espacio estético del contenido perdido", body: "Inspecciona el PDF original y mide la salida. Si la etiqueta está completa, a Tamaño real y dentro del papel, el espacio exterior desigual de una hoja puede ser estético. Si se recorta un código, su zona libre, la dirección o una marca de servicio, trata el offset como fallo de impresión." },
      { heading: "2. Rastrea un desplazamiento térmico", body: "Un desplazamiento repetible en una plantilla 4×6 y en la etiqueta real apunta a guías, detección, origen del driver o un ajuste de posición documentado. Vuelve a cargar y calibra primero. No reduzcas todo ni uses offsets no documentados para ocultar un problema de avance." },
      { heading: "3. Rastrea la colocación en Letter o A4", body: "Confirma que hoja y orientación coincidan con el PDF. Tamaño real conserva dimensiones pero puede recortar si la página no cabe; Ajustar cambia dimensiones. Elige un diseño de origen compatible en vez de mover el código para lograr simetría visual." },
      { heading: "4. Detente si la posición altera contenido activo", body: "Reimprime después de que pase la plantilla si la salida real está recortada, girada, doblada o demasiado cerca de un borde para pegarla plana. Si solo el PDF de origen está desplazado o incompleto, vuelve al flujo emisor en vez de compensarlo en la impresora." },
    ],
    faq: [
      { question: "¿Una etiqueta debe estar centrada en papel Letter o A4?", answer: "No por simetría visual. Las comprobaciones importantes son contenido completo, escala prevista y posibilidad de pegarla plana sin cortar zonas activas." },
      { question: "¿Por qué todas mis etiquetas térmicas se desplazan igual?", answer: "Un desplazamiento repetible apunta a guías, detección, origen del driver o un ajuste de posición. Prueba una plantilla y sigue el manual del modelo exacto." },
      { question: "¿Debo reducir la etiqueta para centrarla?", answer: "No. Reducir cambia la geometría del código. Corrige medio, orientación, calibración o diseño de origen." },
      { question: "¿Y si solo está descentrado el PDF original?", answer: "Vuelve al formato correcto del emisor o extrae intencionadamente una etiqueta completa cuando esté permitido. No superpongas un offset de impresora a un problema del origen." },
      { question: "¿Cuándo debo reimprimir?", answer: "Reimprime si el desplazamiento recorta o gira contenido activo, impide una colocación plana o persiste tras probar la plantilla correcta." },
    ],
    reviewChecklist: ["Confirma si el offset es estético o recorta contenido activo.", "Calibra un desplazamiento térmico repetido antes de aplicar offsets.", "Reimprime solo después de que la plantilla coincidente quepa completa."],
    sources: [
      { label: "Tamaño de página para imprimir en Adobe Acrobat", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe distingue Tamaño real sin escala de Ajustar y documenta el riesgo de recorte cuando una página no cabe." },
      { label: "Calibración de medios SmartCal de Zebra", url: "https://docs.zebra.com/us/en/printers/desktop/zd421-and-zd621-desktop-printers-user-guide/setup/running-a-smartcal-media-calibration.html", checkedAt: "2026-08-29", supports: "Zebra documenta carga, detección y calibración de medios en impresoras térmicas representativas." },
    ],
  },
  "fit-to-page-vs-actual-size-shipping-label": {
    description: "Elige Ajustar o Tamaño real según el PDF y el medio: cuándo Tamaño real conserva escala, cuándo recorta y cuándo regenerar la etiqueta.",
    quickAnswer: "Usa Tamaño real / 100% cuando la página PDF y el medio cargado ya coinciden. Adobe define Ajustar como redimensionar al área imprimible del papel y Tamaño real como no aplicar escala; aun así, Tamaño real puede recortar una página que no cabe. Si origen y medio difieren, obtén el formato correcto en vez de suponer que un botón es seguro.",
    updatedAt: "2026-08-29",
    evidenceNote: "Marco general de diagnóstico: Adobe y Apple documentan el comportamiento de sus visores. El formato correcto de la etiqueta sigue procediendo del marketplace o transportista emisor, no de esta página.",
    decisionTree: {
      headline: "Elige la escala según la relación entre origen y medio",
      intro: "Tamaño real conserva dimensiones; Ajustar las cambia. Ninguna opción repara una página de origen que no corresponde al medio seleccionado.",
      firstAction: "Lee el tamaño de página del PDF y confirma el medio cargado antes de elegir una opción.",
      steps: [
        { title: "El origen y el medio ya coinciden", symptom: "La página PDF y el papel cargado son ambos 4×6, Letter o A4.", action: "Usa Tamaño real / 100% y verifica una prueba medida. Adobe define Tamaño real como impresión sin escala.", href: "/tools/scale-calculator", cta: "Medir el resultado" },
        { title: "El origen es mayor que el medio", symptom: "Una página Letter o A4 se envía a una sola etiqueta de rollo 4×6.", action: "No uses Ajustar para miniaturizar toda la página. Obtén el formato correcto o extrae una etiqueta completa cuando la estructura lo permita.", href: "/tools/pdf-analyzer", cta: "Inspeccionar antes de convertir" },
        { title: "Tamaño real recortaría la página", symptom: "La página de origen no cabe en la hoja seleccionada o en el área imprimible.", action: "Elige papel coincidente o regenera el diseño correcto. Adobe indica que Tamaño real puede recortar lo que no cabe: es una señal para detenerse, no para adivinar.", href: "/tools/test-print-pack", cta: "Probar el diseño coincidente" },
      ],
    },
    sections: [
      { heading: "1. Empieza por el origen y el medio físico", body: "Lee si la página PDF es 4×6, Letter, A4 o una hoja mayor que contiene una etiqueta pequeña. Confirma después el papel o rollo cargado en la impresora elegida. La escala debe decidirse al final, cuando esos dos datos coincidan." },
      { heading: "2. Usa Tamaño real en un recorrido coincidente", body: "Adobe indica que Tamaño real imprime sin escala. Úsalo cuando una página 4×6 real va a un medio 4×6, o una página Letter/A4 a una hoja del mismo tamaño. Mide una prueba en blanco porque el driver final aún puede aplicar su propia configuración." },
      { heading: "3. Trata Ajustar como una transformación", body: "Adobe indica que Ajustar reduce o amplía una página al área imprimible. Puede servir para documentos comunes, pero cambia la geometría del código. En macOS, Apple documenta Escalar para ajustar y opciones distintas para conservar toda la página o llenar y recortar el papel." },
      { heading: "4. Detente si ninguna opción conserva el documento", body: "Si Tamaño real recorta contenido requerido y Ajustar lo miniaturiza o amplía, el diseño no corresponde al medio. Regenera el formato correcto del emisor, usa papel coincidente o extrae una etiqueta completa solo cuando el documento lo permita; no pruebes por tanteo con un código real." },
    ],
    faq: [
      { question: "¿Tamaño real siempre es seguro para etiquetas de envío?", answer: "No. Conserva la escala, pero Adobe advierte que el contenido puede recortarse si la página no cabe en el papel elegido." },
      { question: "¿Ajustar a página siempre está mal?", answer: "Es una operación de redimensionado documentada. No la uses cuando necesitas conservar las dimensiones emitidas del código; obtén un formato de origen coincidente." },
      { question: "¿Qué uso para un PDF 4×6 real y un rollo 4×6?", answer: "Empieza con medio 4×6 y Tamaño real / 100%, y mide una prueba en blanco antes del franqueo real." },
      { question: "¿Qué uso para un PDF Letter en una impresora térmica?", answer: "Ni Ajustar ni una ampliación a ciegas. Obtén un formato 4×6 o extrae una etiqueta completa solo si cabe todo el contenido requerido." },
      { question: "¿Cuándo debo detenerme y regenerar?", answer: "Detente si Tamaño real recorta, Ajustar cambia el código, la página incluye documentos adyacentes necesarios o el emisor da una instrucción específica de formato." },
    ],
    reviewChecklist: ["Lee el tamaño del PDF y confirma el medio cargado.", "Usa Tamaño real solo cuando origen y medio coincidan.", "Regenera el formato correcto si Tamaño real recorta y Ajustar redimensiona."],
    sources: [
      { label: "Tamaño de página para imprimir en Adobe Acrobat", url: "https://helpx.adobe.com/acrobat/desktop/print-documents/set-up-and-print-pdfs/page-size.html", checkedAt: "2026-08-29", supports: "Adobe define el comportamiento de Ajustar, Tamaño real, Reducir páginas grandes y la escala personalizada." },
      { label: "Opciones de impresión de Vista Previa de Apple", url: "https://support.apple.com/en-gb/guide/preview/prvw15175/mac", checkedAt: "2026-08-29", supports: "Apple documenta Escala, Escalar para ajustar, Imprimir imagen completa y Llenar todo el papel en Vista Previa." },
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
    description: `Corrige ${symptom.toLowerCase()}. Revisa escala, papel, márgenes, orientación y el área libre del código antes de reimprimir.`,
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

  return { ...base, ...reviewedTroublePages[slug] };
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
