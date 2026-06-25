import { NextResponse } from "next/server";
import { fetchFtpRequestsPage } from "@/lib/ftp-request-service";
import type { FtpRequestFilters } from "@/types/ftpRequestTypes";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") ?? "1";
        const limit = searchParams.get("limit") ?? "20";

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

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /ftp-requests/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
