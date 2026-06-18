import { NextResponse } from "next/server";
import { fetchIntegrationsSummary } from "@/lib/integration-service";

export async function GET(request: Request) {
    try {
        const data = await fetchIntegrationsSummary();
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /integrations/summary] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
