import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: "x402 Agent Toolkit",
    version: "1.0.0",
    endpoints: ["/api/url-to-text", "/api/json-transform", "/api/csv-parse", "/api/text-stats", "/api/hash-generate"],
    networks: ["eip155:8453", "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"],
    docs: "https://x402-agent-toolkit.vercel.app/openapi.json",
  });
}
