import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        console.log("[API /agents/overview/[id]] Fetching overview for id:", id);
        const raw = await backendFetch<unknown>(`/admin/agents/${id}/overview`);
        console.log("[API /agents/overview/[id]] Response:", JSON.stringify(raw).slice(0, 300));
        return NextResponse.json(raw);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/overview/[id]] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
