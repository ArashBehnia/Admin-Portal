import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const raw = await backendFetch<unknown>(`/admin/agents/${id}/overview`);
        return NextResponse.json(raw);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/overview/[id]] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
