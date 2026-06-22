import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { input, algorithm } = await request.json();
    if (!input) {
      return NextResponse.json({ error: "input string is required" }, { status: 400 });
    }

    const algo = (algorithm || "sha256").toLowerCase();
    const supported = ["sha256", "md5", "sha512", "sha1", "sha384"];
    if (!supported.includes(algo)) {
      return NextResponse.json(
        { error: `Unsupported algorithm: ${algo}. Supported: ${supported.join(", ")}` },
        { status: 400 }
      );
    }

    const hash = createHash(algo).update(input).digest("hex");

    return NextResponse.json({
      input: input.substring(0, 200) + (input.length > 200 ? "..." : ""),
      algorithm: algo,
      hash,
      inputLength: input.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
