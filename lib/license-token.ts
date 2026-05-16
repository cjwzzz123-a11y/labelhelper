import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_VERSION = "slh1";
const TOKEN_TTL_SECONDS = 24 * 60 * 60;

interface LicenseTokenPayload {
  licenseKey: string;
  exp: number;
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getSigningSecret() {
  return process.env.LICENSE_SIGNING_SECRET;
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(`${TOKEN_VERSION}.${encodedPayload}`).digest("base64url");
}

export function issueLicenseToken(licenseKey: string, now = new Date()) {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload: LicenseTokenPayload = {
    licenseKey: licenseKey.trim(),
    exp: Math.floor(now.getTime() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);
  return `${TOKEN_VERSION}.${encodedPayload}.${signature}`;
}

export function verifyLicenseToken(token: string, now = new Date()) {
  const secret = getSigningSecret();
  if (!secret) return null;

  const [version, encodedPayload, signature, extra] = token.trim().split(".");
  if (version !== TOKEN_VERSION || !encodedPayload || !signature || extra) return null;

  const expected = signPayload(encodedPayload, secret);
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(signature);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return null;

  let payload: LicenseTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as LicenseTokenPayload;
  } catch {
    return null;
  }

  if (!payload.licenseKey || typeof payload.licenseKey !== "string") return null;
  if (!Number.isFinite(payload.exp) || payload.exp <= Math.floor(now.getTime() / 1000)) return null;

  return payload.licenseKey;
}
