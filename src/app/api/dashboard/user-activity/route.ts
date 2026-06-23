import { NextRequest, NextResponse } from "next/server";
import { fetchUserActivity } from "@/lib/dashboard-service";
import { BackendError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = Number(searchParams.get("days")) || 30;
        const data = await fetchUserActivity(days);
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        const status = error instanceof BackendError ? error.status : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
