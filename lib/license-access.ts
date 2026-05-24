import { NextResponse } from "next/server";
import { verifyLicenseToken } from "@/lib/license-token";

export function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization");
  return auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
}

export function hasValidLicenseToken(request: Request) {
  const token = getBearerToken(request);
  return Boolean(token && verifyLicenseToken(token));
}

export function paidToolRequiredResponse() {
  return NextResponse.json(
    { error: "A paid Pro Toolkit license is required to use this tool." },
    { status: 402 },
  );
}
