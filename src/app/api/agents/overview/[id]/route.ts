import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const raw = await backendFetch<unknown>(`/admin/agents/${id}/overview`);
        return NextResponse.json(raw);
    } catch (error) {
        return handleBffError(error, "agents/overview/[id]");
    }
}
