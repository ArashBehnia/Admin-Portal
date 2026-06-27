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
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /ftp-requests/[id]/approve] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
