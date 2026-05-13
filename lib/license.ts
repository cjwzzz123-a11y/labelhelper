import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type LicenseTier = "free" | "pro_lifetime";

type PaidLicenseTier = Exclude<LicenseTier, "free">;

export interface LicenseRecord {
  key: string;
  email?: string;
  sku: LicenseTier;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
  checkoutSessionId?: string;
  instanceId?: string;
  source?: "test" | "creem" | "manual";
}

export interface LicenseCheckResult {
  configured: boolean;
  active: boolean;
  message: string;
  record?: LicenseRecord;
}

export interface LicenseIssueResult {
  configured: boolean;
  issued: boolean;
  message: string;
  nextAction: "use_free_tools" | "enter_license" | "contact_support";
  record?: LicenseRecord;
  delivery?: "returned_in_test_mode" | "email_pending" | "not_available";
}

export interface LicenseServiceStatus {
  checkoutConfigured: boolean;
  licenseConfigured: boolean;
  webhookConfigured: boolean;
  emailConfigured: boolean;
  testMode: boolean;
  canVerifyRealLicenses: boolean;
  message: string;
}

export interface LicenseStorage {
  getByKey(key: string): Promise<LicenseRecord | undefined>;
  getByCheckoutSessionId(checkoutSessionId: string): Promise<LicenseRecord | undefined>;
  getByEmail(email: string): Promise<LicenseRecord | undefined>;
  upsert(record: LicenseRecord): Promise<void>;
}

export interface CreemWebhookResult {
  configured: boolean;
  received: boolean;
  reason: string;
  status: number;
  record?: LicenseRecord;
}

const LICENSE_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]*(?:-[a-z0-9][a-z0-9_-]*)*$/i;
const TEST_LICENSE_KEY = "0".repeat(64);
const CHECKOUT_ENV_KEYS: Record<PaidLicenseTier, string> = {
  pro_lifetime: "NEXT_PUBLIC_CREEM_PRO_URL",
};
const CREEM_PRODUCTION_API_URL = "https://api.creem.io";
const CREEM_TEST_API_URL = "https://test-api.creem.io";
const DEFAULT_CREEM_CACHE_MS = 7 * 24 * 60 * 60 * 1000;
const LIFETIME_CACHE_MS = 10 * 365 * 24 * 60 * 60 * 1000;
const SIGNED_ACTIVATION_CODE_PATTERN = /^SLH-([A-F0-9]{16})-([A-F0-9]{16})-([A-F0-9]{32})$/i;

interface CreemLicenseInstance {
  id?: string;
  name?: string;
  status?: string;
  created_at?: string;
}

interface CreemLicenseResponse {
  id?: string;
  status?: "inactive" | "active" | "expired" | "disabled" | string;
  key?: string;
  product_id?: string;
  expires_at?: string | null;
  created_at?: string;
  instance?: CreemLicenseInstance | CreemLicenseInstance[];
}

const memoryStore = globalThis as typeof globalThis & { __slhLicenses?: Map<string, LicenseRecord> };

function getMemoryLicenses() {
  memoryStore.__slhLicenses ??= new Map<string, LicenseRecord>();
  return memoryStore.__slhLicenses;
}

function getMemoryLicenseStorage(): LicenseStorage {
  return {
    async getByKey(key) {
      return getMemoryLicenses().get(key.trim().toLowerCase());
    },
    async getByCheckoutSessionId(checkoutSessionId) {
      const normalized = checkoutSessionId.trim();
      return Array.from(getMemoryLicenses().values()).find((record) => record.checkoutSessionId === normalized);
    },
    async getByEmail(email) {
      const normalized = email.trim().toLowerCase();
      return Array.from(getMemoryLicenses().values()).find((record) => record.email?.toLowerCase() === normalized);
    },
    async upsert(record) {
      getMemoryLicenses().set(record.key.toLowerCase(), record);
    },
  };
}

export function resetInMemoryLicensesForTests() {
  getMemoryLicenses().clear();
}

export function isValidLicenseKeyFormat(key: string) {
  const trimmed = key.trim();
  if (SIGNED_ACTIVATION_CODE_PATTERN.test(trimmed)) return true;
  return trimmed.length >= 6 && trimmed.length <= 160 && LICENSE_KEY_PATTERN.test(trimmed);
}

export function createLicenseKey(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createRandomLicenseKey() {
  return createLicenseKey(randomBytes(32));
}

function getActivationCodeSecret() {
  return process.env.SLH_ACTIVATION_CODE_SECRET || process.env.LICENSE_SIGNING_SECRET;
}

function createActivationCodeSignature(codePrefix: string, secret: string) {
  return createHmac("sha256", secret).update(codePrefix.toUpperCase()).digest("hex").slice(0, 32).toUpperCase();
}

export function createSignedActivationCode(bytes = randomBytes(16), secret = getActivationCodeSecret()) {
  if (!secret) throw new Error("SLH_ACTIVATION_CODE_SECRET or LICENSE_SIGNING_SECRET is required to generate activation codes.");
  const id = Buffer.from(bytes).toString("hex").toUpperCase();
  const prefix = `SLH-${id.slice(0, 16)}-${id.slice(16, 32)}`;
  return `${prefix}-${createActivationCodeSignature(prefix, secret)}`;
}

export function verifySignedActivationCode(key: string, secret = getActivationCodeSecret()) {
  if (!secret) return false;
  const normalized = key.trim().toUpperCase();
  const match = normalized.match(SIGNED_ACTIVATION_CODE_PATTERN);
  if (!match) return false;

  const prefix = `SLH-${match[1]}-${match[2]}`;
  const expected = createActivationCodeSignature(prefix, secret);
  const actual = match[3].toUpperCase();
  const expectedBytes = Buffer.from(expected, "hex");
  const actualBytes = Buffer.from(actual, "hex");
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function isLicenseActive(record: LicenseRecord, now = new Date()) {
  if (record.revokedAt) return false;
  if (!record.expiresAt) return true;
  return new Date(record.expiresAt).getTime() > now.getTime();
}

export function getCheckoutUrl(sku: PaidLicenseTier) {
  return process.env[CHECKOUT_ENV_KEYS[sku]] ?? "/pricing#checkout-not-configured";
}

export function isCheckoutConfigured(sku: PaidLicenseTier) {
  return !getCheckoutUrl(sku).startsWith("/pricing#");
}

export function isLicenseTestModeEnabled() {
  return process.env.SLH_ENABLE_TEST_LICENSE === "true";
}

export function isMemoryLicenseStorageEnabled() {
  return process.env.LICENSE_STORAGE_DRIVER === "memory" || isLicenseTestModeEnabled();
}

export function getLicenseStorage(): LicenseStorage | undefined {
  if (isMemoryLicenseStorageEnabled()) return getMemoryLicenseStorage();
  return undefined;
}

export function isLicenseServiceConfigured() {
  return Boolean(process.env.CREEM_API_KEY) || Boolean(getActivationCodeSecret()) || Boolean(process.env.LICENSE_SIGNING_SECRET && getLicenseStorage());
}

export function isCreemWebhookConfigured() {
  return Boolean(process.env.CREEM_WEBHOOK_SECRET && getLicenseStorage());
}

export function getLicenseServiceStatus(): LicenseServiceStatus {
  const checkoutConfigured = isCheckoutConfigured("pro_lifetime");
  const licenseConfigured = isLicenseServiceConfigured();
  const webhookConfigured = isCreemWebhookConfigured();
  const emailConfigured = Boolean(process.env.CREEM_API_KEY) || Boolean(getActivationCodeSecret());
  const testMode = isLicenseTestModeEnabled();
  const canVerifyRealLicenses = Boolean(process.env.CREEM_API_KEY) && !testMode;

  return {
    checkoutConfigured,
    licenseConfigured,
    webhookConfigured,
    emailConfigured,
    testMode,
    canVerifyRealLicenses,
    message: canVerifyRealLicenses
      ? "Creem license verification is configured for real purchases."
      : testMode
        ? "License verification is in local test mode. Real Creem purchase lookup is not connected yet."
        : licenseConfigured
          ? "License verification is partially configured."
          : "Creem license verification is not connected yet. Free tools and watermarked previews are still available.",
  };
}

export function verifyLicensePlaceholder(key: string): LicenseCheckResult {
  if (!isValidLicenseKeyFormat(key)) {
    return { configured: isLicenseServiceConfigured(), active: false, message: "Enter the license key from your Creem receipt or customer portal." };
  }

  if (isLicenseTestModeEnabled() && key.trim().toLowerCase() === TEST_LICENSE_KEY) {
    return {
      configured: false,
      active: true,
      message: "Local test license accepted. Real purchase verification is still not connected.",
      record: {
        key: key.trim().toLowerCase(),
        sku: "pro_lifetime",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        source: "test",
      },
    };
  }

  if (verifySignedActivationCode(key)) {
    const now = new Date();
    return {
      configured: true,
      active: true,
      message: "Activation code verified and cached locally on this browser.",
      record: {
        key: key.trim().toUpperCase(),
        sku: "pro_lifetime",
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + LIFETIME_CACHE_MS).toISOString(),
        source: "manual",
      },
    };
  }

  if (!isLicenseServiceConfigured()) {
    return { configured: false, active: false, message: "Creem license verification is not connected yet. Free tools and watermarked previews are still available." };
  }

  return { configured: true, active: false, message: "Creem license verification is configured, but this key has not been accepted yet." };
}

function getCreemApiBaseUrl() {
  if (process.env.CREEM_API_BASE_URL) return process.env.CREEM_API_BASE_URL.replace(/\/$/, "");
  return process.env.CREEM_TEST_MODE === "true" ? CREEM_TEST_API_URL : CREEM_PRODUCTION_API_URL;
}

function getCreemInstance(response: CreemLicenseResponse): CreemLicenseInstance | undefined {
  return Array.isArray(response.instance) ? response.instance[0] : response.instance;
}

function createCreemRecord(key: string, response: CreemLicenseResponse): LicenseRecord {
  const instance = getCreemInstance(response);
  return {
    key: response.key ?? key.trim(),
    sku: "pro_lifetime",
    createdAt: response.created_at ?? new Date().toISOString(),
    expiresAt: response.expires_at ?? new Date(Date.now() + DEFAULT_CREEM_CACHE_MS).toISOString(),
    instanceId: instance?.id,
    source: "creem",
  };
}

async function requestCreemLicense(endpoint: "activate" | "validate", payload: Record<string, string>): Promise<LicenseCheckResult> {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    return { configured: false, active: false, message: "Creem API key is not configured. Free tools and watermarked previews are still available." };
  }

  const response = await fetch(`${getCreemApiBaseUrl()}/v1/licenses/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({})) as CreemLicenseResponse & { message?: string; error?: string };
  if (!response.ok) {
    const fallback = response.status === 403
      ? "This license has reached its activation limit. In Creem, set the product license activation limit high enough or unlimited if one key should be reusable."
      : response.status === 404
        ? "Creem could not find this license key or browser instance."
        : response.status === 410
          ? "This Creem license is expired or revoked."
          : "Creem license verification failed. Check the key and try again.";
    return { configured: true, active: false, message: data.message ?? data.error ?? fallback };
  }

  if (data.status !== "active") {
    return { configured: true, active: false, message: `Creem returned license status: ${data.status ?? "unknown"}.`, record: createCreemRecord(payload.key, data) };
  }

  return {
    configured: true,
    active: true,
    message: "License verified by Creem and cached locally on this browser.",
    record: createCreemRecord(payload.key, data),
  };
}

export async function verifyLicense(key: string, input?: { instanceId?: string; instanceName?: string }): Promise<LicenseCheckResult> {
  const placeholder = verifyLicensePlaceholder(key);
  if (placeholder.active || !placeholder.configured || !isValidLicenseKeyFormat(key)) return placeholder;

  if (process.env.CREEM_API_KEY) {
    const trimmedKey = key.trim();
    const instanceId = input?.instanceId?.trim();
    if (instanceId) return requestCreemLicense("validate", { key: trimmedKey, instance_id: instanceId });
    return requestCreemLicense("activate", { key: trimmedKey, instance_name: input?.instanceName?.trim() || "Shipping Label Helper browser" });
  }

  const record = await getLicenseStorage()?.getByKey(key.trim().toLowerCase());
  if (!record) return placeholder;
  if (!isLicenseActive(record)) {
    return { configured: true, active: false, message: "This license exists but is expired or revoked.", record };
  }

  return { configured: true, active: true, message: "License verified and cached locally on this device.", record };
}

export async function issueLicense(input: { checkoutSessionId?: string; email?: string; sku?: LicenseTier }): Promise<LicenseIssueResult> {
  const checkoutSessionId = input.checkoutSessionId?.trim();
  const email = input.email?.trim().toLowerCase();
  const storage = getLicenseStorage();

  if (!storage || !isLicenseServiceConfigured()) {
    return {
      configured: false,
      issued: false,
      message: "Checkout/license delivery is not connected yet. Use the free tools for now; paid unlock will appear here when credentials are added.",
      nextAction: "use_free_tools",
      delivery: "not_available",
    };
  }

  if (!checkoutSessionId && !email) {
    return {
      configured: true,
      issued: false,
      message: "Enter the checkout session or purchase email so we can look up the order.",
      nextAction: "enter_license",
      delivery: "not_available",
    };
  }

  const existing = checkoutSessionId ? await storage.getByCheckoutSessionId(checkoutSessionId) : email ? await storage.getByEmail(email) : undefined;
  if (existing) {
    return {
      configured: true,
      issued: true,
      message: isLicenseTestModeEnabled()
        ? "Local test license found. Copy the key into the unlock page."
        : "License found. Email delivery should send the key when Resend is connected.",
      nextAction: "enter_license",
      record: existing,
      delivery: isLicenseTestModeEnabled() ? "returned_in_test_mode" : "email_pending",
    };
  }

  if (!isLicenseTestModeEnabled()) {
    return {
      configured: true,
      issued: false,
      message: "Checkout lookup storage is ready, but automatic Creem order verification and email delivery are not fully connected yet.",
      nextAction: "contact_support",
      delivery: "email_pending",
    };
  }

  const now = new Date();
  const record: LicenseRecord = {
    key: createRandomLicenseKey(),
    email,
    sku: input.sku && input.sku !== "free" ? input.sku : "pro_lifetime",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    checkoutSessionId,
    source: "test",
  };
  await storage.upsert(record);

  return {
    configured: true,
    issued: true,
    message: "Local test license issued. Copy the key into the unlock page. Real email delivery is still not connected.",
    nextAction: "enter_license",
    record,
    delivery: "returned_in_test_mode",
  };
}

export function issueLicensePlaceholder(input: { checkoutSessionId?: string; email?: string }): LicenseIssueResult {
  if (!isLicenseServiceConfigured()) {
    return {
      configured: false,
      issued: false,
      message: "Checkout/license delivery is not connected yet. Use the free tools for now; paid unlock will appear here when credentials are added.",
      nextAction: "use_free_tools",
      delivery: "not_available",
    };
  }

  if (!input.checkoutSessionId && !input.email) {
    return {
      configured: true,
      issued: false,
      message: "Enter the checkout session or purchase email so we can look up the order.",
      nextAction: "enter_license",
      delivery: "not_available",
    };
  }

  return {
    configured: true,
    issued: false,
    message: "Checkout lookup is ready for integration, but Creem session verification and email delivery still need to be connected.",
    nextAction: "contact_support",
    delivery: "email_pending",
  };
}

function parseSignature(signature: string) {
  const trimmed = signature.trim();
  const match = trimmed.match(/(?:sha256=)?([a-f0-9]{64})/i);
  return match?.[1].toLowerCase();
}

export function verifyCreemSignature(body: string, signature: string, secret = process.env.CREEM_WEBHOOK_SECRET) {
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const actual = parseSignature(signature);
  if (!actual) return false;

  const expectedBytes = Buffer.from(expected, "hex");
  const actualBytes = Buffer.from(actual, "hex");
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function extractWebhookLicenseInput(event: unknown) {
  if (!event || typeof event !== "object") return {};
  const source = event as Record<string, unknown>;
  const data = source.data && typeof source.data === "object" ? source.data as Record<string, unknown> : source;
  const customer = data.customer && typeof data.customer === "object" ? data.customer as Record<string, unknown> : undefined;
  const checkoutSessionId = [data.checkout_session_id, data.checkoutSessionId, data.id, source.id].find((value): value is string => typeof value === "string");
  const email = [data.email, data.customer_email, customer?.email].find((value): value is string => typeof value === "string");

  return { checkoutSessionId, email };
}

export async function handleCreemWebhook(body: string, signature?: string | null): Promise<CreemWebhookResult> {
  if (!isCreemWebhookConfigured()) {
    return { configured: false, received: false, reason: "Creem webhook secret or license storage is not configured yet.", status: 503 };
  }

  if (!signature) {
    return { configured: true, received: false, reason: "Missing webhook signature.", status: 401 };
  }

  if (!verifyCreemSignature(body, signature)) {
    return { configured: true, received: false, reason: "Invalid webhook signature.", status: 401 };
  }

  const event = JSON.parse(body) as unknown;
  const input = extractWebhookLicenseInput(event);
  const result = await issueLicense(input);

  return {
    configured: true,
    received: result.issued,
    reason: result.message,
    status: result.issued ? 200 : 202,
    record: result.record,
  };
}
