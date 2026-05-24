import { defaultLocale, type Locale } from "@/lib/i18n";
import { getLicenseServiceStatus } from "@/lib/license";

const copy = {
  en: {
    eyebrow: "Connection status",
    readyTitle: "Real license verification is connected",
    previewTitle: "Paid access is still in preview mode",
    testTitle: "Local test mode is enabled",
    readyText: "Checkout, webhook, storage and email are configured. Enter a purchase key to unlock paid tools on this browser.",
    previewText: "Guides and reference pages stay available now. Paid tool access appears here after checkout, webhook, storage and email credentials are connected.",
    testText: "Use this only for local QA. Temporary keys can unlock this browser, but they are not real purchases.",
    checkout: "Checkout",
    webhook: "Webhook",
    license: "License storage",
    email: "Email",
    ready: "ready",
    missing: "missing",
  },
  es: {
    eyebrow: "Estado de conexión",
    readyTitle: "La verificación real de licencia está conectada",
    previewTitle: "El acceso de pago sigue en modo vista previa",
    testTitle: "El modo de prueba local está activo",
    readyText: "Checkout, webhook, almacenamiento y email están configurados. Introduce una clave de compra para desbloquear las herramientas en este navegador.",
    previewText: "Ahora puedes usar herramientas gratuitas y vistas previas con marca de agua. La verificación real aparecerá cuando checkout, webhook, almacenamiento y email estén conectados.",
    testText: "Úsalo solo para QA local. Las claves temporales pueden desbloquear este navegador, pero no son compras reales.",
    checkout: "Checkout",
    webhook: "Webhook",
    license: "Almacenamiento",
    email: "Email",
    ready: "listo",
    missing: "falta",
  },
  fr: {
    eyebrow: "État de connexion",
    readyTitle: "La vérification réelle de licence est connectée",
    previewTitle: "L'accès payant est encore en mode aperçu",
    testTitle: "Le mode test local est activé",
    readyText: "Checkout, webhook, stockage et e-mail sont configurés. Saisissez une clé d'achat pour déverrouiller les outils sur ce navigateur.",
    previewText: "Vous pouvez utiliser les outils gratuits et les aperçus avec filigrane. La vérification réelle apparaîtra lorsque checkout, webhook, stockage et e-mail seront connectés.",
    testText: "À utiliser uniquement pour le QA local. Des clés temporaires peuvent déverrouiller ce navigateur, mais ce ne sont pas de vrais achats.",
    checkout: "Checkout",
    webhook: "Webhook",
    license: "Stockage licence",
    email: "E-mail",
    ready: "prêt",
    missing: "manquant",
  },
  de: {
    eyebrow: "Verbindungsstatus",
    readyTitle: "Echte Lizenzprüfung ist verbunden",
    previewTitle: "Bezahlzugang ist noch im Vorschaumodus",
    testTitle: "Lokaler Testmodus ist aktiviert",
    readyText: "Checkout, Webhook, Speicherung und E-Mail sind konfiguriert. Gib einen Kaufschlüssel ein, um Tools in diesem Browser freizuschalten.",
    previewText: "Du kannst kostenlose Tools und Vorschauen mit Wasserzeichen nutzen. Die echte Kaufprüfung erscheint, wenn Checkout, Webhook, Speicherung und E-Mail verbunden sind.",
    testText: "Nur für lokales QA verwenden. Temporäre Schlüssel können diesen Browser freischalten, sind aber keine echten Käufe.",
    checkout: "Checkout",
    webhook: "Webhook",
    license: "Lizenzspeicher",
    email: "E-Mail",
    ready: "bereit",
    missing: "fehlt",
  },
  ja: {
    eyebrow: "接続ステータス",
    readyTitle: "実購入ライセンス確認が接続済み",
    previewTitle: "有料アクセスはまだプレビューモードです",
    testTitle: "ローカルテストモードが有効です",
    readyText: "checkout、webhook、storage、email が設定済みです。購入キーを入力するとこのブラウザで有料ツールを解除できます。",
    previewText: "現在は無料ツールと透かし付きプレビューを利用できます。実購入確認は checkout、webhook、storage、email 接続後に表示されます。",
    testText: "ローカルQA専用です。一時キーでこのブラウザを解除できますが、実購入ではありません。",
    checkout: "Checkout",
    webhook: "Webhook",
    license: "ライセンス保存",
    email: "Email",
    ready: "準備済み",
    missing: "未接続",
  },
  zh: {
    eyebrow: "连接状态",
    readyTitle: "真实许可证验证已接入",
    previewTitle: "付费访问仍处于预览模式",
    testTitle: "本地测试模式已启用",
    readyText: "结账、webhook、存储和邮件已配置。输入购买密钥即可在此浏览器解锁付费工具。",
    previewText: "指南和参考页面现在仍可访问。结账、webhook、存储和邮件凭证接入后，这里会显示付费工具访问状态。",
    testText: "仅用于本地 QA。临时密钥可解锁此浏览器，但它不是真实购买。",
    checkout: "结账",
    webhook: "Webhook",
    license: "许可证存储",
    email: "邮件",
    ready: "已就绪",
    missing: "未接入",
  },
} satisfies Record<Locale, Record<string, string>>;

export function LicenseStatusPanel({ locale = defaultLocale }: { locale?: Locale }) {
  const status = getLicenseServiceStatus();
  const pageCopy = copy[locale] ?? copy.en;
  const title = status.canVerifyRealLicenses ? pageCopy.readyTitle : status.testMode ? pageCopy.testTitle : pageCopy.previewTitle;
  const text = status.canVerifyRealLicenses ? pageCopy.readyText : status.testMode ? pageCopy.testText : pageCopy.previewText;

  const checks = [
    [pageCopy.checkout, status.checkoutConfigured],
    [pageCopy.webhook, status.webhookConfigured],
    [pageCopy.license, status.licenseConfigured],
    [pageCopy.email, status.emailConfigured],
  ] as const;

  return (
    <section className="rounded-3xl border border-amber-200 bg-[#fffdf7] p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">{pageCopy.eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-[#12324A]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {checks.map(([label, ready]) => (
          <div key={label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-amber-100">
            <span className="font-semibold text-slate-700">{label}</span>
            <span className={ready ? "font-bold text-emerald-700" : "font-bold text-amber-800"}>{ready ? pageCopy.ready : pageCopy.missing}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
