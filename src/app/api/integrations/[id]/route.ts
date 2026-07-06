import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchIntegrationDetail } from "@/lib/integration-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const data = await fetchIntegrationDetail(id);
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "integrations/[id]");
    }
}
