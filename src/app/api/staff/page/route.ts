import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchStaffPage } from "@/lib/staff-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset") ?? "0";
        const limit = searchParams.get("limit") ?? "20";
        const filter = searchParams.get("filter") ?? undefined;
        const role = searchParams.get("role") ?? undefined;

        const pageResult = await fetchStaffPage(
            Number(offset),
            Number(limit),
            filter,
            role,
        );

        return NextResponse.json({
            data: pageResult.data,
            total: pageResult.total,
            offset: Number(offset),
            limit: Number(limit),
        });
    } catch (error) {
        return handleBffError(error, "staff/page");
    }
}
