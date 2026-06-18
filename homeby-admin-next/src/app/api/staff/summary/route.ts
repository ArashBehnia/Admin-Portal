import { NextResponse } from "next/server";
import { fetchStaffSummary } from "@/lib/staff-service";

export async function GET() {
    try {
        const summary = await fetchStaffSummary();
        return NextResponse.json(summary);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/summary] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
