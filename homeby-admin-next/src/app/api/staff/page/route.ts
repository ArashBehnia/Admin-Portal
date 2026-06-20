import { NextResponse } from "next/server";
import { fetchStaffPage } from "@/lib/staff-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const keywords = searchParams.get("keywords") ?? undefined;
        const role = searchParams.get("role") ?? undefined;

        const pageResult = await fetchStaffPage(
            Number(offset),
            Number(limit),
            keywords,
            role,
        );

        return NextResponse.json({
            data: pageResult.data,
            total: pageResult.total,
            offset: Number(offset),
            limit: Number(limit),
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/page] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
