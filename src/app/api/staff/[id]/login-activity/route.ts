import { NextResponse } from "next/server";
import { fetchStaffLoginActivity } from "@/lib/staff-service";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const activity = await fetchStaffLoginActivity(id);
        return NextResponse.json(activity);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/[id]/login-activity] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
