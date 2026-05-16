import { NextResponse } from "next/server";
import { getLicenseServiceStatus, verifyLicense } from "@/lib/license";
import { issueLicenseToken } from "@/lib/license-token";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { key?: string; instanceId?: string } | null;
  const key = body?.key?.trim() ?? "";
  const result = await verifyLicense(key, { instanceId: body?.instanceId });

  return NextResponse.json({
    valid: result.active,
    token: result.active ? issueLicenseToken(key) : undefined,
    configured: result.configured,
    reason: result.message,
    nextAction: result.active ? "continue" : result.configured ? "check_key" : "use_free_tools",
    verifiedUntil: result.record?.expiresAt,
    instanceId: result.record?.instanceId,
    status: getLicenseServiceStatus(),
  });
}
