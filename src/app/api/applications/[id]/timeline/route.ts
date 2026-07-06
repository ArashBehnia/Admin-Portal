import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchApplicationTimeline } from "@/lib/application-service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        // console.log("[API /applications/[id]/timeline] GET request, id:", id);
        const result = await fetchApplicationTimeline(id);
        // console.log("[API /applications/[id]/timeline] result:", JSON.stringify(result).slice(0, 500));
        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "applications/[id]/timeline");
    }
}
