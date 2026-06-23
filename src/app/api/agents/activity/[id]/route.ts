import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? "20";

        const raw = await backendFetch<unknown>(
            `/admin/agents/${id}/activity?limit=${limit}`,
        );
        return NextResponse.json(raw);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/activity/[id]] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
