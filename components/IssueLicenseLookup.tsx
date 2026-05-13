"use client";

import { FormEvent, useState } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    title: "Look up license delivery",
    text: "Enter the checkout session ID or purchase email to check whether a license can be recovered. In local test mode, a temporary test key may be shown here.",
    session: "Checkout session ID",
    email: "Purchase email",
    sessionPlaceholder: "Optional checkout session ID",
    emailPlaceholder: "you@example.com",
    button: "Check delivery status",
    busy: "Checking...",
    initial: "No lookup has been requested yet.",
    failed: "Could not check license delivery right now. Use free tools and previews for now.",
    testKey: "Local test key",
  },
  es: {
    title: "Consultar entrega de licencia",
    text: "Introduce el ID de sesión de checkout o el email de compra para comprobar si se puede recuperar una licencia. En modo de prueba local, aquí puede aparecer una clave temporal.",
    session: "ID de sesión checkout",
    email: "Email de compra",
    sessionPlaceholder: "ID de sesión opcional",
    emailPlaceholder: "you@example.com",
    button: "Comprobar estado",
    busy: "Comprobando...",
    initial: "Aún no se ha solicitado ninguna consulta.",
    failed: "No se pudo comprobar la entrega de licencia ahora. Usa las herramientas gratuitas y las vistas previas por ahora.",
    testKey: "Clave local de prueba",
  },
  fr: {
    title: "Vérifier la livraison de licence",
    text: "Saisissez l'ID de session checkout ou l'e-mail d'achat pour vérifier si une licence peut être récupérée. En mode test local, une clé temporaire peut apparaître ici.",
    session: "ID de session checkout",
    email: "E-mail d'achat",
    sessionPlaceholder: "ID de session optionnel",
    emailPlaceholder: "you@example.com",
    button: "Vérifier le statut",
    busy: "Vérification...",
    initial: "Aucune vérification demandée pour le moment.",
    failed: "Impossible de vérifier la livraison de licence maintenant. Utilisez les outils gratuits et les aperçus pour le moment.",
    testKey: "Clé de test locale",
  },
  de: {
    title: "Lizenzzustellung prüfen",
    text: "Gib die Checkout-Session-ID oder Kauf-E-Mail ein, um zu prüfen, ob eine Lizenz wiederhergestellt werden kann. Im lokalen Testmodus kann hier ein temporärer Schlüssel erscheinen.",
    session: "Checkout-Session-ID",
    email: "Kauf-E-Mail",
    sessionPlaceholder: "Optionale Session-ID",
    emailPlaceholder: "you@example.com",
    button: "Status prüfen",
    busy: "Prüfung läuft...",
    initial: "Es wurde noch keine Abfrage gestartet.",
    failed: "Die Lizenzzustellung konnte gerade nicht geprüft werden. Nutze vorerst kostenlose Tools und Vorschauen.",
    testKey: "Lokaler Testschlüssel",
  },
  ja: {
    title: "ライセンス配信を確認",
    text: "checkout セッションIDまたは購入メールを入力して、ライセンスを復元できるか確認します。ローカルテストモードでは一時キーが表示される場合があります。",
    session: "Checkout セッションID",
    email: "購入メール",
    sessionPlaceholder: "任意のセッションID",
    emailPlaceholder: "you@example.com",
    button: "配信状況を確認",
    busy: "確認中...",
    initial: "まだ確認は実行されていません。",
    failed: "現在ライセンス配信を確認できません。無料ツールとプレビューを利用してください。",
    testKey: "ローカルテストキー",
  },
  zh: {
    title: "查询许可证发送状态",
    text: "输入 checkout session ID 或购买邮箱，检查是否可以恢复许可证。本地测试模式下，这里可能显示临时测试密钥。",
    session: "Checkout session ID",
    email: "购买邮箱",
    sessionPlaceholder: "可选 checkout session ID",
    emailPlaceholder: "you@example.com",
    button: "检查发送状态",
    busy: "正在检查...",
    initial: "尚未发起查询。",
    failed: "暂时无法检查许可证发送状态。现在仍可使用免费工具和预览。",
    testKey: "本地测试密钥",
  },
} satisfies Record<Locale, Record<string, string>>;

export function IssueLicenseLookup({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = copy[locale] ?? copy.en;
  const [checkoutSessionId, setCheckoutSessionId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(pageCopy.initial);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/issue-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutSessionId, email }),
      });
      const result = await response.json() as { reason?: string; licenseKey?: string };
      setMessage(result.licenseKey ? `${result.reason}\n${pageCopy.testKey}: ${result.licenseKey}` : result.reason ?? pageCopy.failed);
    } catch {
      setMessage(pageCopy.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-[#12324A]">{pageCopy.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{pageCopy.text}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.session}</span>
          <input value={checkoutSessionId} onChange={(event) => setCheckoutSessionId(event.target.value)} placeholder={pageCopy.sessionPlaceholder} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none" />
        </label>
        <label>
          <span className="text-sm font-bold text-[#12324A]">{pageCopy.email}</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={pageCopy.emailPlaceholder} className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:bg-white focus:outline-none" inputMode="email" />
        </label>
      </div>
      <button type="submit" disabled={busy || (!checkoutSessionId.trim() && !email.trim())} className="mt-5 rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70] disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? pageCopy.busy : pageCopy.button}
      </button>
      <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#f7fbff] p-4 text-sm leading-6 text-slate-700 ring-1 ring-sky-100">{message}</p>
    </form>
  );
}
