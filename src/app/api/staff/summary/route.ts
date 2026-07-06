import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchStaffSummary } from "@/lib/staff-service";

export async function GET() {
    try {
        const summary = await fetchStaffSummary();
        return NextResponse.json(summary);
    } catch (error) {
        return handleBffError(error, "staff/summary");
    }
}
