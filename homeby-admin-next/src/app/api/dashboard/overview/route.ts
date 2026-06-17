import { NextResponse } from "next/server";
import { fetchOverview } from "@/lib/dashboard-service";

export async function GET() {
    try {
        const data = await fetchOverview();
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /dashboard/overview] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
