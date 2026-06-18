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
            `/admin/agency-staff/page?${params.toString()}`,
        );

        const items = toArray(raw);
        const total = findTotal(raw) || items.length;

        return NextResponse.json({ data: items, total, offset: Number(offset), limit: Number(limit) });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
