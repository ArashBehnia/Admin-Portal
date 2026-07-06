import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const keywords = searchParams.get("keywords") ?? undefined;
        const status = searchParams.get("status") ?? undefined;

        const params = new URLSearchParams({ offset, limit });
        if (keywords) params.set("keywords", keywords);
        if (status) params.set("status", status);

        const raw = await backendFetch<unknown>(
            `/admin/agencies/page?${params.toString()}`,
        );

        const page =
            raw && typeof raw === "object" && !Array.isArray(raw)
                ? (raw as Record<string, unknown>)
                : {};

        const content = Array.isArray(page.content) ? page.content : [];
        const total = typeof page.total === "number" ? page.total : 0;

        return NextResponse.json({
            content,
            total,
            offset: Number(offset),
            limit: Number(limit),
        });
    } catch (error) {
        return handleBffError(error, "agencies/page");
    }
}
