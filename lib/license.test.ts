import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "crypto";
import { createSignedActivationCode, getLicenseServiceStatus, handleCreemWebhook, issueLicense, resetInMemoryLicensesForTests, verifyLicense, verifyLicensePlaceholder } from "./license";
import { issueLicenseToken, verifyLicenseToken } from "./license-token";

describe("license placeholders", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetInMemoryLicensesForTests();
  });

  it("reports an honest unconfigured status by default", () => {
    const status = getLicenseServiceStatus();

    expect(status.canVerifyRealLicenses).toBe(false);
    expect(status.testMode).toBe(false);
    expect(status.message).toContain("not connected yet");
  });

  it("accepts a local test key only when test mode is enabled", () => {
    const testKey = "0".repeat(64);

    expect(verifyLicensePlaceholder(testKey).active).toBe(false);

    vi.stubEnv("SLH_ENABLE_TEST_LICENSE", "true");
    const result = verifyLicensePlaceholder(testKey);

    expect(result.active).toBe(true);
    expect(result.record?.sku).toBe("pro_lifetime");
    expect(result.record?.expiresAt).toBeTruthy();
  });

  it("rejects malformed keys before checking service configuration", () => {
    vi.stubEnv("SLH_ENABLE_TEST_LICENSE", "true");

    const result = verifyLicensePlaceholder("bad key!");

    expect(result.active).toBe(false);
    expect(result.message).toContain("license key");
  });

  it("accepts stateless signed activation codes when the signing secret is configured", async () => {
    vi.stubEnv("SLH_ACTIVATION_CODE_SECRET", "activation-secret");
    const code = createSignedActivationCode(new Uint8Array(16).fill(1), "activation-secret");

    const result = await verifyLicense(code);

    expect(result.active).toBe(true);
    expect(result.record?.key).toBe(code);
    expect(result.record?.source).toBe("manual");
  });

  it("signs short-lived license tokens with the license signing secret", () => {
    vi.stubEnv("LICENSE_SIGNING_SECRET", "token-secret");
    const token = issueLicenseToken("license_123", new Date("2026-05-16T00:00:00.000Z"));

    expect(token).toBeTruthy();
    expect(verifyLicenseToken(token ?? "", new Date("2026-05-16T00:00:01.000Z"))).toBe("license_123");
    expect(verifyLicenseToken(token ?? "", new Date("2026-05-17T00:00:01.000Z"))).toBeNull();
  });

  it("issues and verifies a local test license by checkout session", async () => {
    vi.stubEnv("SLH_ENABLE_TEST_LICENSE", "true");
    vi.stubEnv("LICENSE_SIGNING_SECRET", "local-secret");

    const issued = await issueLicense({ checkoutSessionId: "cs_test_123", email: "buyer@example.com" });

    expect(issued.issued).toBe(true);
    expect(issued.record?.key).toMatch(/^[a-f0-9]{64}$/);

    const lookup = await issueLicense({ checkoutSessionId: "cs_test_123" });
    expect(lookup.record?.key).toBe(issued.record?.key);

    const verified = await verifyLicense(issued.record?.key ?? "");
    expect(verified.active).toBe(true);
    expect(verified.record?.email).toBe("buyer@example.com");
  });

  it("rejects unsigned Creem webhooks when webhook storage is configured", async () => {
    vi.stubEnv("SLH_ENABLE_TEST_LICENSE", "true");
    vi.stubEnv("LICENSE_SIGNING_SECRET", "local-secret");
    vi.stubEnv("CREEM_WEBHOOK_SECRET", "webhook-secret");

    const result = await handleCreemWebhook(JSON.stringify({ id: "evt_1" }), undefined);

    expect(result.status).toBe(401);
    expect(result.received).toBe(false);
  });

  it("accepts a signed Creem webhook and creates an idempotent local license", async () => {
    vi.stubEnv("SLH_ENABLE_TEST_LICENSE", "true");
    vi.stubEnv("LICENSE_SIGNING_SECRET", "local-secret");
    vi.stubEnv("CREEM_WEBHOOK_SECRET", "webhook-secret");
    const body = JSON.stringify({ data: { id: "cs_test_456", customer: { email: "buyer@example.com" } } });
    const signature = createHmac("sha256", "webhook-secret").update(body).digest("hex");

    const first = await handleCreemWebhook(body, `sha256=${signature}`);
    const second = await handleCreemWebhook(body, `sha256=${signature}`);

    expect(first.status).toBe(200);
    expect(first.record?.key).toMatch(/^[a-f0-9]{64}$/);
    expect(second.record?.key).toBe(first.record?.key);
  });
});
