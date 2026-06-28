import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 },
            );
        }

        const result = await backendFetch(
            `/admin/agency-staff-ftp-requests/${id}/change-password`,
            {
                method: "POST",
                body: JSON.stringify({ password }),
            },
        );

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /ftp-requests/[id]/change-password] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
