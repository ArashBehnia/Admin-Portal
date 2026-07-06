import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchIntegrationErrors } from "@/lib/integration-service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? "20";

        const data = await fetchIntegrationErrors(id, Number(limit));
        return NextResponse.json(data);
    } catch (error) {
        return handleBffError(error, "integrations/[id]/errors");
    }
}
