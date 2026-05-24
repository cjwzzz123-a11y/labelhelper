"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useStoredLicense } from "@/lib/client-license";
import { defaultLocale, safeLocalizedPath, type Locale } from "@/lib/i18n";

export function TemplateDownloadButton({
  slug,
  children,
  className,
  locale = defaultLocale,
  filename,
}: {
  slug: string;
  children: ReactNode;
  className: string;
  locale?: Locale;
  filename?: string;
}) {
  const license = useStoredLicense();
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!license.verified || !license.token) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/templates/${encodeURIComponent(slug)}`, {
        headers: { Authorization: `Bearer ${license.token}` },
      });
      if (!response.ok) throw new Error("Template download failed.");
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const resolvedFilename = disposition.match(/filename="([^"]+)"/)?.[1] ?? filename ?? `slh-${slug}-shipping-label-template.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resolvedFilename;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  if (!license.verified) {
    return (
      <Link href={safeLocalizedPath("/pricing", locale)} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => void download()} disabled={busy} className={className}>
      {children}
    </button>
  );
}
