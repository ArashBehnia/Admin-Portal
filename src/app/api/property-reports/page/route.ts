import { NextResponse } from "next/server";
import { fetchPropertyReportsPage } from "@/lib/property-report-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const keywords = searchParams.get("keywords") ?? undefined;

        const result = await fetchPropertyReportsPage(
            Number(offset),
            Number(limit),
            keywords,
        );

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /property-reports/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
