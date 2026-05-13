import { NextResponse } from "next/server";
import { handleCreemWebhook } from "@/lib/license";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("creem-signature") ?? request.headers.get("x-creem-signature");
  const body = await request.text();

  try {
    const result = await handleCreemWebhook(body, signature);
    return NextResponse.json(
      { received: result.received, configured: result.configured, reason: result.reason },
      { status: result.status },
    );
  } catch {
    return NextResponse.json({ received: false, configured: true, reason: "Webhook payload could not be processed." }, { status: 400 });
  }
}
