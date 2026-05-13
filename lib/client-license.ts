"use client";

import { useEffect, useState } from "react";

export const LICENSE_STORAGE_KEY = "slh_license";
export const VERIFIED_UNTIL_STORAGE_KEY = "slh_verified_until";
export const LICENSE_INSTANCE_STORAGE_KEY = "slh_license_instance";

export interface StoredLicenseState {
  key: string;
  instanceId: string;
  verifiedUntil: string;
  verified: boolean;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const LICENSE_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]*(?:-[a-z0-9][a-z0-9_-]*)*$/i;
const SIGNED_ACTIVATION_CODE_PATTERN = /^SLH-[A-F0-9]{16}-[A-F0-9]{16}-[A-F0-9]{32}$/i;

export function isPlausibleLicenseKey(key: string) {
  const trimmed = key.trim();
  if (SIGNED_ACTIVATION_CODE_PATTERN.test(trimmed)) return true;
  return trimmed.length >= 6 && trimmed.length <= 160 && LICENSE_KEY_PATTERN.test(trimmed);
}

export function getStoredLicenseState(now = new Date()): StoredLicenseState {
  if (typeof window === "undefined") return { key: "", instanceId: "", verifiedUntil: "", verified: false };

  const key = window.localStorage.getItem(LICENSE_STORAGE_KEY)?.trim() ?? "";
  const instanceId = window.localStorage.getItem(LICENSE_INSTANCE_STORAGE_KEY)?.trim() ?? "";
  const verifiedUntil = window.localStorage.getItem(VERIFIED_UNTIL_STORAGE_KEY) ?? "";
  const verifiedTime = Date.parse(verifiedUntil);

  return {
    key,
    instanceId,
    verifiedUntil,
    verified: isPlausibleLicenseKey(key) && Number.isFinite(verifiedTime) && verifiedTime > now.getTime(),
  };
}

export function saveVerifiedLicense(key: string, verifiedUntil = new Date(Date.now() + ONE_DAY_MS).toISOString(), instanceId?: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LICENSE_STORAGE_KEY, key.trim());
  if (instanceId) window.localStorage.setItem(LICENSE_INSTANCE_STORAGE_KEY, instanceId.trim());
  window.localStorage.setItem(VERIFIED_UNTIL_STORAGE_KEY, verifiedUntil);
  window.dispatchEvent(new Event("slh-license-change"));
}

export function clearStoredLicense() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(LICENSE_STORAGE_KEY);
  window.localStorage.removeItem(LICENSE_INSTANCE_STORAGE_KEY);
  window.localStorage.removeItem(VERIFIED_UNTIL_STORAGE_KEY);
  window.dispatchEvent(new Event("slh-license-change"));
}

export function useStoredLicense() {
  const [state, setState] = useState<StoredLicenseState>({ key: "", instanceId: "", verifiedUntil: "", verified: false });

  useEffect(() => {
    const sync = () => setState(getStoredLicenseState());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("slh-license-change", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("slh-license-change", sync);
    };
  }, []);

  return state;
}
