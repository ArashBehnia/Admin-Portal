import { NextResponse } from "next/server";
import { fetchAttentionAlerts } from "@/lib/dashboard-service";
import { BackendError, handleBffError } from "@/lib/api";

export async function GET() {
    try {
        const data = await fetchAttentionAlerts();
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "dashboard/attention-alerts");
    }
}
