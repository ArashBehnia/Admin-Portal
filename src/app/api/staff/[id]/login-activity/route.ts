import { handleBffError } from "@/lib/api";
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
        return handleBffError(error, "staff/[id]/login-activity");
    }
}
