import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

function findTotal(obj: unknown): number {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const o = obj as Record<string, unknown>;
        if (typeof o.total === "number") return o.total;
        if (typeof o.totalCount === "number") return o.totalCount;
        if (typeof o.count === "number") return o.count;
    }
    return 0;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const keywords = searchParams.get("keywords") ?? undefined;

        const params = new URLSearchParams({ offset, limit });
        if (keywords) params.set("keywords", keywords);

        const raw = await backendFetch<unknown>(
            `/admin/agency/page?${params.toString()}`,
        );

        console.log("[API /agencies/page] raw type:", typeof raw, Array.isArray(raw) ? "array" : "");
        console.log("[API /agencies/page] raw:", JSON.stringify(raw).slice(0, 500));

        const items = toArray(raw);
        const total = findTotal(raw) || items.length;

        console.log("[API /agencies/page] items count:", items.length, "total:", total);
        if (items.length > 0 && items[0] && typeof items[0] === "object") {
            const first = items[0] as Record<string, unknown>;
            console.log("[API /agencies/page] first item keys:", Object.keys(first));
            console.log("[API /agencies/page] first item:", JSON.stringify(items[0]).slice(0, 300));
        }

        return NextResponse.json({ data: items, total, offset: Number(offset), limit: Number(limit) });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
