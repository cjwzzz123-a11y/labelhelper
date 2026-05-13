import { NextResponse } from "next/server";
import { getLicenseServiceStatus } from "@/lib/license";

export function GET() {
  return NextResponse.json(getLicenseServiceStatus());
}
