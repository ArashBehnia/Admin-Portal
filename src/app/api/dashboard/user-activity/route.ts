import { NextRequest, NextResponse } from "next/server";
import { fetchUserActivity } from "@/lib/dashboard-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = Number(searchParams.get("days")) || 30;
        const data = await fetchUserActivity(days);
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
