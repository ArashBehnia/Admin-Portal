import { NextResponse } from "next/server";
import {
    fetchStaffPage,
    fetchStaffSummary,
} from "@/lib/staff-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const keywords = searchParams.get("keywords") ?? undefined;

        const [pageResult, summary] = await Promise.all([
            fetchStaffPage(Number(offset), Number(limit), keywords),
            fetchStaffSummary(),
        ]);

        return NextResponse.json({
            data: pageResult.data,
            total: pageResult.total,
            summary,
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
