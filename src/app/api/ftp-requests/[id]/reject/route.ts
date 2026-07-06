import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { rejectFtpRequest } from "@/lib/ftp-request-service";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const reason = body?.reason ?? "";

        if (!reason.trim()) {
            return NextResponse.json(
                { success: false, error: "Rejection reason is required" },
                { status: 400 },
            );
        }

        const result = await rejectFtpRequest(id, reason.trim());
        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "ftp-requests/[id]/reject");
    }
}
