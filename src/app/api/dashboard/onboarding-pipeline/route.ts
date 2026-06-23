import { NextResponse } from "next/server";
import { fetchOnboardingPipeline } from "@/lib/dashboard-service";

export async function GET() {
    try {
        const data = await fetchOnboardingPipeline();
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
