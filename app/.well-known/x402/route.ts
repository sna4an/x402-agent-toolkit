import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/openapi.json", "https://x402-agent-toolkit.vercel.app"));
}
