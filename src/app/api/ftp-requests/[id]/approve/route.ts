import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { approveFtpRequest } from "@/lib/ftp-request-service";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const result = await approveFtpRequest(id);
        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "ftp-requests/[id]/approve");
    }
}
