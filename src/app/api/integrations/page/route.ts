import { NextResponse } from "next/server";
import { fetchIntegrationsPage } from "@/lib/integration-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "10";
        const keywords = searchParams.get("keywords") ?? undefined;
        const status = searchParams.get("status") ?? undefined;

        const result = await fetchIntegrationsPage(
            Number(offset),
            Number(limit),
            keywords,
            status,
        );
        // Return shape matching what the client expects:
        // { data: [...items], total, offset, limit }
        return NextResponse.json({
            data: result.data,
            total: result.total,
            offset: Number(offset),
            limit: Number(limit),
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /integrations/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
