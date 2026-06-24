import { NextResponse } from "next/server";
import { fetchApplicationsPage } from "@/lib/application-service";

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
        const status = searchParams.get("status") ?? undefined;

        // console.log("[API /applications/page] GET request:", { offset, limit, status });

        const result = await fetchApplicationsPage(
            Number(offset),
            Number(limit),
            status,
        );

        // console.log("[API /applications/page] raw result:", JSON.stringify(result).slice(0, 500));

        const items = toArray(result.data);
        const total = findTotal(result) || items.length;

        // console.log("[API /applications/page] items count:", items.length, "total:", total);
        // if (items.length > 0 && items[0] && typeof items[0] === "object") {
        //     const first = items[0] as Record<string, unknown>;
        //     console.log("[API /applications/page] first item keys:", Object.keys(first));
        //     console.log("[API /applications/page] first item:", JSON.stringify(items[0]).slice(0, 300));
        // }

        return NextResponse.json({ data: items, total, offset: Number(offset), limit: Number(limit) });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        // console.error("[API /applications/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
