import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchIntegrationsSummary } from "@/lib/integration-service";

export async function GET(request: Request) {
    try {
        const data = await fetchIntegrationsSummary();
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "integrations/summary");
    }
}
