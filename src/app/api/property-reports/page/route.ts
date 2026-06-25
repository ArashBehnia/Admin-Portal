import { NextResponse } from "next/server";
import { fetchPropertyReportsPage } from "@/lib/property-report-service";
import type { PropertyReportFilters } from "@/types/propertyReportTypes";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";

        const filters: PropertyReportFilters = {};
        const type = searchParams.get("type");
        const createdAtGte = searchParams.get("createdAtGte");
        const createdAtLte = searchParams.get("createdAtLte");
        const filter = searchParams.get("filter");

        if (type) filters.type = type;
        if (createdAtGte) filters.createdAtGte = createdAtGte;
        if (createdAtLte) filters.createdAtLte = createdAtLte;
        if (filter) filters.filter = filter;

        const result = await fetchPropertyReportsPage(
            Number(offset),
            Number(limit),
            Object.keys(filters).length > 0 ? filters : undefined,
        );

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /property-reports/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
