import { NextRequest, NextResponse } from "next/server";
import { fetchDemandHotspots } from "@/lib/dashboard-service";
import { BackendError, handleBffError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = Number(searchParams.get("days")) || 7;
        const limit = Number(searchParams.get("limit")) || 10;
        const data = await fetchDemandHotspots(days, limit);
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "dashboard/demand-hotspots");
    }
}
