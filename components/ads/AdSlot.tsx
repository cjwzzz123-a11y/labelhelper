"use client";

import { useStoredLicense } from "@/lib/client-license";

export function AdSlot({ slot }: { slot: string }) {
  const license = useStoredLicense();

  if (process.env.NEXT_PUBLIC_ENABLE_ADSENSE !== "true" || license.verified) return null;

  return (
    <div className="my-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500" data-slot={slot} data-paid-hide="true">
      Advertisement
    </div>
  );
}
