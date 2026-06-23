import { NextResponse } from "next/server";
import { fetchIntegrationDetail } from "@/lib/integration-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await fetchIntegrationDetail(id);
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /integrations/[id]] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
