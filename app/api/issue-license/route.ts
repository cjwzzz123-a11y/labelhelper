import { NextResponse } from "next/server";
import { issueLicense } from "@/lib/license";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { checkoutSessionId?: string; email?: string } | null;
  const result = await issueLicense({ checkoutSessionId: body?.checkoutSessionId, email: body?.email });

  return NextResponse.json({
    issued: result.issued,
    configured: result.configured,
    reason: result.message,
    nextAction: result.nextAction,
    licenseKey: result.delivery === "returned_in_test_mode" ? result.record?.key : undefined,
    verifiedUntil: result.record?.expiresAt,
  });
}
