import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const raw = await backendFetch<unknown>(`/admin/agencies/${id}/overview`);
        return NextResponse.json(raw);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/overview] GET error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
