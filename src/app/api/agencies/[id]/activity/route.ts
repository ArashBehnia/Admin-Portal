import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? "20";
        const raw = await backendFetch<unknown>(
            `/admin/agencies/${id}/activity?limit=${encodeURIComponent(limit)}`,
        );
        return NextResponse.json(raw);
    } catch (error) {
        return handleBffError(error, "agencies/[id]/activity");
    }
}
