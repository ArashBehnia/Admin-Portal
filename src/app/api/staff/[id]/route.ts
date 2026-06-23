import { NextResponse } from "next/server";
import { updateStaffMember, deleteStaffMember } from "@/lib/staff-service";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = await updateStaffMember(id, body);
        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/[id]] PUT error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        await deleteStaffMember(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/[id]] DELETE error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
