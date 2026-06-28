import { NextResponse } from "next/server";
import { fetchFtpRequestsPage } from "@/lib/ftp-request-service";
import type { FtpRequestFilters } from "@/types/ftpRequestTypes";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const page = Math.floor(Number(offset) / Number(limit)) + 1;

        const filters: FtpRequestFilters = {};
        const status = searchParams.get("status");
        const filter = searchParams.get("filter");

        if (status) filters.status = status;
        if (filter) filters.filter = filter;

        const result = await fetchFtpRequestsPage(
            Number(page),
            Number(limit),
            Object.keys(filters).length > 0 ? filters : undefined,
        );

        console.log("[API /ftp-requests/page] result:", result.data.length, "items");

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /ftp-requests/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
