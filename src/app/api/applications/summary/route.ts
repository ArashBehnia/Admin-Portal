import { NextResponse } from "next/server";
import { fetchApplicationsSummary } from "@/lib/application-service";

function toNum(v: unknown): number {
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v) || 0;
    return 0;
}

export async function GET() {
    try {
        // console.log("[API /applications/summary] GET request");
        const raw = await fetchApplicationsSummary();
        // console.log("[API /applications/summary] raw response:", JSON.stringify(raw));
        const data = {
            total: toNum(raw.total),
            pending: toNum(raw.pending),
            approved: toNum(raw.approved),
            rejected: toNum(raw.rejected),
            newToday: toNum(raw.newToday),
        };
        // console.log("[API /applications/summary] mapped data:", JSON.stringify(data));
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        // console.error("[API /applications/summary] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
