import { NextResponse } from "next/server";
import { fetchBlockedIpsPage } from "@/lib/blocked-ip-service";
import type { BlockedIpFilters } from "@/types/blockedIpTypes";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get("limit") ?? "20");
        const offset = Number(searchParams.get("offset") ?? "0");
        const page = Math.floor(offset / limit) + 1;

        const filters: BlockedIpFilters = {};
        const strategy = searchParams.get("strategy");
        const reason = searchParams.get("reason");
        const filter = searchParams.get("filter");

        if (strategy) filters.strategy = strategy;
        if (reason) filters.reason = reason;
        if (filter) filters.filter = filter;

        const result = await fetchBlockedIpsPage(
            page,
            limit,
            Object.keys(filters).length > 0 ? filters : undefined,
        );

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /blocked-ips/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
