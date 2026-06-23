import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v) || 0;
    return 0;
}

export async function GET() {
    try {
        const raw = await backendFetch<unknown>("/admin/agencies/summary");
        const obj =
            raw && typeof raw === "object" && !Array.isArray(raw)
                ? (raw as Record<string, unknown>)
                : {};

        const data = {
            total: toNum(obj.total),
            active: toNum(obj.active),
            inactive: toNum(obj.inactive),
            pending: toNum(obj.pending),
            with_listings: toNum(obj.with_listings),
        };

        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/summary] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
