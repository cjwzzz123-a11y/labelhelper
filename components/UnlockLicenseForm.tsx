"use client";

import { FormEvent, useState } from "react";
import { isPlausibleLicenseKey, saveVerifiedLicense, useStoredLicense } from "@/lib/client-license";
import { defaultLocale, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    label: "License key",
    placeholder: "Paste your Creem license key",
    button: "Unlock this browser",
    checking: "Checking key...",
    initial: "Paste the license key from your Creem receipt or customer portal. This site has no account system, so keep your key somewhere safe.",
    invalid: "Enter the license key from your Creem receipt or customer portal.",
    verified: "License verified and cached locally on this device.",
    unavailable: "License verification is temporarily unavailable.",
    fallback: "License verification is not available yet.",
    unlocked: "This browser is unlocked until",
    helper: "Your key can be reused on another browser or device. The browser stores only the key and Creem instance id locally.",
  },
  es: {
    label: "Clave de licencia",
    placeholder: "Pega tu clave de licencia de Creem",
    button: "Desbloquear este navegador",
    checking: "Comprobando clave...",
    initial: "Pega la clave de licencia de tu recibo o portal de Creem. Este sitio no tiene cuentas, así que guarda tu clave en un lugar seguro.",
    invalid: "Introduce la clave de licencia de tu recibo o portal de Creem.",
    verified: "Licencia verificada y guardada localmente en este dispositivo.",
    unavailable: "La verificación de licencia no está disponible temporalmente.",
    fallback: "La verificación de licencia aún no está disponible.",
    unlocked: "Este navegador está desbloqueado hasta",
    helper: "Tu clave puede reutilizarse en otro navegador o dispositivo. El navegador guarda solo la clave y el instance id de Creem localmente.",
  },
  fr: {
    label: "Clé de licence",
    placeholder: "Collez votre clé de licence Creem",
    button: "Déverrouiller ce navigateur",
    checking: "Vérification de la clé...",
    initial: "Collez la clé de licence depuis votre reçu ou portail Creem. Ce site n'a pas de comptes, gardez donc votre clé en lieu sûr.",
    invalid: "Saisissez la clé de licence de votre reçu ou portail Creem.",
    verified: "Licence vérifiée et enregistrée localement sur cet appareil.",
    unavailable: "La vérification de licence est temporairement indisponible.",
    fallback: "La vérification de licence n'est pas encore disponible.",
    unlocked: "Ce navigateur est déverrouillé jusqu'au",
    helper: "Votre clé peut être réutilisée sur un autre navigateur ou appareil. Le navigateur ne garde localement que la clé et l'instance id Creem.",
  },
  de: {
    label: "Lizenzschlüssel",
    placeholder: "Creem-Lizenzschlüssel einfügen",
    button: "Diesen Browser freischalten",
    checking: "Schlüssel wird geprüft...",
    initial: "Füge den Lizenzschlüssel aus deinem Creem-Beleg oder Kundenportal ein. Diese Site hat keine Konten, bewahre den Schlüssel daher sicher auf.",
    invalid: "Gib den Lizenzschlüssel aus deinem Creem-Beleg oder Kundenportal ein.",
    verified: "Lizenz verifiziert und lokal auf diesem Gerät gespeichert.",
    unavailable: "Die Lizenzprüfung ist vorübergehend nicht verfügbar.",
    fallback: "Die Lizenzprüfung ist noch nicht verfügbar.",
    unlocked: "Dieser Browser ist freigeschaltet bis",
    helper: "Dein Schlüssel kann in einem anderen Browser oder Gerät erneut verwendet werden. Der Browser speichert nur Schlüssel und Creem instance id lokal.",
  },
  ja: {
    label: "ライセンスキー",
    placeholder: "Creemのライセンスキーを貼り付け",
    button: "このブラウザを解除",
    checking: "キーを確認中...",
    initial: "Creemの領収書またはカスタマーポータルのライセンスキーを貼り付けてください。このサイトにはアカウント機能がないため、キーは安全に保管してください。",
    invalid: "Creemの領収書またはカスタマーポータルのライセンスキーを入力してください。",
    verified: "ライセンスを確認し、この端末にローカル保存しました。",
    unavailable: "ライセンス確認は一時的に利用できません。",
    fallback: "ライセンス確認はまだ利用できません。",
    unlocked: "このブラウザの解除期限",
    helper: "キーは別のブラウザや端末でも再利用できます。ブラウザはキーとCreem instance idだけをローカル保存します。",
  },
  zh: {
    label: "许可证密钥",
    placeholder: "粘贴你的 Creem 许可证密钥",
    button: "解锁此浏览器",
    checking: "正在检查密钥...",
    initial: "粘贴 Creem 收据或客户门户里的许可证密钥。本站没有账号系统，所以请你自己妥善保存密钥。",
    invalid: "请输入 Creem 收据或客户门户里的许可证密钥。",
    verified: "许可证已验证，并已缓存在此设备本地。",
    unavailable: "许可证验证暂时不可用。",
    fallback: "许可证验证尚不可用。",
    unlocked: "此浏览器已解锁，有效期至",
    helper: "同一份密钥可以在其他浏览器或设备再次使用。浏览器只会本地保存密钥和 Creem instance id。",
  },
} satisfies Record<Locale, Record<string, string>>;

export function UnlockLicenseForm({ locale = defaultLocale }: { locale?: Locale }) {
  const pageCopy = copy[locale] ?? copy.en;
  const license = useStoredLicense();
  const [key, setKey] = useState(license.key);
  const [message, setMessage] = useState(pageCopy.initial);
  const [isChecking, setIsChecking] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedKey = key.trim();

    if (!isPlausibleLicenseKey(trimmedKey)) {
      setMessage(pageCopy.invalid);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmedKey, instanceId: license.instanceId }),
      });
      const result = await response.json() as { valid?: boolean; reason?: string; verifiedUntil?: string; instanceId?: string };

      if (result.valid) {
        saveVerifiedLicense(trimmedKey, result.verifiedUntil, result.instanceId);
        setMessage(result.reason ?? pageCopy.verified);
      } else {
        setMessage(result.reason ?? pageCopy.fallback);
      }
    } catch {
      setMessage(pageCopy.unavailable);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-3xl bg-[#f7fbff] p-4 ring-1 ring-sky-100 sm:p-5">
      <label htmlFor="license-key" className="text-sm font-bold text-[#12324A]">{pageCopy.label}</label>
      <input
        id="license-key"
        value={key}
        onChange={(event) => setKey(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 font-mono text-sm text-[#12324A] shadow-sm focus:border-sky-400 focus:outline-none"
        placeholder={pageCopy.placeholder}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isChecking} className="rounded-full bg-[#12324A] px-5 py-3 text-sm font-bold text-white hover:bg-[#1d4d70] disabled:cursor-not-allowed disabled:opacity-60">
          {isChecking ? pageCopy.checking : pageCopy.button}
        </button>
        <p className="max-w-xl text-xs leading-5 text-slate-500">{pageCopy.helper}</p>
      </div>
      <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700 ring-1 ring-sky-100">{message}</p>
      {license.verified ? <p className="mt-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100">{pageCopy.unlocked} {new Date(license.verifiedUntil).toLocaleString()}.</p> : null}
    </form>
  );
}
