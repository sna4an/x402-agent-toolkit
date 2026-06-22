import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { csv, delimiter, hasHeader } = await request.json();
    if (!csv) {
      return NextResponse.json({ error: "csv text is required" }, { status: 400 });
    }

    const autoDetect = !delimiter;
    const sep = delimiter || ",";
    const useHeader = hasHeader !== false;

    const lines = csv.trim().split("\n").map((l: string) => l.replace(/\r$/, ""));
    if (lines.length === 0) {
      return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
    }

    // Auto-detect delimiter from first line
    const actualSep = autoDetect
      ? [",", "\t", ";", "|"].reduce((best, d) => {
          const count = (lines[0].match(new RegExp(`\\${d}`, "g")) || []).length;
          const bestCount = (lines[0].match(new RegExp(`\\${best}`, "g")) || []).length;
          return count > bestCount ? d : best;
        }, ",")
      : sep;

    const parseRow = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (ch === actualSep && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      result.push(current.trim());
      return result;
    };

    const rows = lines.map(parseRow);
    const headers = useHeader ? rows[0] : rows[0].map((_: string, i: number) => `col_${i}`);
    const dataRows = useHeader ? rows.slice(1) : rows;

    const records = dataRows.map((row) =>
      Object.fromEntries(headers.map((h: string, i: number) => [h, row[i] || ""]))
    );

    return NextResponse.json({
      delimiter: actualSep,
      headers,
      rows: records.length,
      data: records,
      autoDetected: autoDetect,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
