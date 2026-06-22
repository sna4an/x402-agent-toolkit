import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { data, operation, params } = await request.json();
    if (!data || !operation) {
      return NextResponse.json({ error: "data and operation required" }, { status: 400 });
    }

    let result: any;

    switch (operation) {
      case "filter": {
        const { key, value } = params || {};
        if (!key) return NextResponse.json({ error: "params.key required for filter" }, { status: 400 });
        result = Array.isArray(data)
          ? data.filter((item: any) => item[key] === value)
          : Object.fromEntries(Object.entries(data).filter(([k]) => k === key));
        break;
      }
      case "pick": {
        const { keys } = params || {};
        if (!keys || !Array.isArray(keys)) return NextResponse.json({ error: "params.keys array required for pick" }, { status: 400 });
        const pick = (obj: any) => Object.fromEntries(keys.filter((k: string) => k in obj).map((k: string) => [k, obj[k]]));
        result = Array.isArray(data) ? data.map(pick) : pick(data);
        break;
      }
      case "flatten": {
        const flatten = (obj: any, prefix = ""): any =>
          Object.entries(obj).reduce((acc: any, [k, v]) => {
            const key = prefix ? `${prefix}.${k}` : k;
            if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(acc, flatten(v, key));
            else acc[key] = v;
            return acc;
          }, {});
        result = Array.isArray(data) ? data.map((item) => flatten(item)) : flatten(data);
        break;
      }
      case "keys": {
        result = Array.isArray(data) ? [...new Set(data.flatMap(Object.keys))] : Object.keys(data);
        break;
      }
      case "count": {
        result = Array.isArray(data) ? { count: data.length } : { count: Object.keys(data).length };
        break;
      }
      default:
        return NextResponse.json({ error: `Unknown operation: ${operation}. Use: filter, pick, flatten, keys, count` }, { status: 400 });
    }

    return NextResponse.json({ operation, params, result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
