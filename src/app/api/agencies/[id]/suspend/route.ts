import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

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
                { success: false, error: "Suspension reason is required" },
                { status: 400 },
            );
        }

        try {
            const raw = await backendFetch<{ id?: string; status?: string }>(
                `/admin/agencies/${id}/suspend`,
                {
                    method: "POST",
                    body: JSON.stringify({ reason: reason.trim() }),
                },
            );

            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
            const status =
                backendError instanceof Error &&
                "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const message =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);
            console.error(
                `[API /agencies/suspend] Backend error ${status}:`,
                message,
            );
            return NextResponse.json(
                { success: false, error: message },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/suspend] POST error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
