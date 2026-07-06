import { NextResponse } from "next/server";
import { fetchOverview } from "@/lib/dashboard-service";
import { BackendError, handleBffError } from "@/lib/api";

export async function GET() {
    try {
        const data = await fetchOverview();
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "dashboard/overview");
    }
}
