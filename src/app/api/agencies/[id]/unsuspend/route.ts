import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        try {
            const raw = await backendFetch<{ id?: string; status?: string }>(
                `/admin/agencies/${id}/unsuspend`,
                {
                    method: "POST",
                },
            );

            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
        return handleBffError(backendError, "agencies/[id]/unsuspend");
    }
    } catch (error) {
        return handleBffError(error, "agencies/[id]/unsuspend");
    }
}
