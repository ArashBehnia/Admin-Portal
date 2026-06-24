import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const agencyId = searchParams.get("agencyId");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "id query parameter is required" },
                { status: 400 },
            );
        }
        if (!agencyId) {
            return NextResponse.json(
                { success: false, error: "agencyId query parameter is required" },
                { status: 400 },
            );
        }

        const body = await request.json();

        const payload: Record<string, unknown> = {};
        if (body.password) payload.password = body.password;
        if (body.role) payload.role = body.role;
        if (typeof body.isActive === "boolean") payload.isActive = body.isActive;
        if (body.firstName) payload.contact = { firstName: body.firstName, lastName: body.lastName ?? "" };

        if (Object.keys(payload).length === 0) {
            return NextResponse.json(
                { success: false, error: "No fields to update" },
                { status: 400 },
            );
        }

        try {
            const raw = await backendFetch<unknown>(
                `/admin/agency-staff?id=${id}&agencyId=${agencyId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                },
            );
            return NextResponse.json({ success: true, data: raw });
        } catch (backendError) {
            const status =
                backendError instanceof Error && "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const message =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);
            console.error(`[API /agents/staff] Backend error ${status}:`, message);
            return NextResponse.json(
                { success: false, error: message },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/staff] PUT error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
