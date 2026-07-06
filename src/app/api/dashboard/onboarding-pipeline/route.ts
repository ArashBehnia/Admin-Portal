import { NextResponse } from "next/server";
import { fetchOnboardingPipeline } from "@/lib/dashboard-service";
import { BackendError, handleBffError } from "@/lib/api";

export async function GET() {
    try {
        const data = await fetchOnboardingPipeline();
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "dashboard/onboarding-pipeline");
    }
}
