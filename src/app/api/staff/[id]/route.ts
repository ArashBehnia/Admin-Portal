import { handleBffError } from "@/lib/api";
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
        return handleBffError(error, "staff/[id]");
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
        return handleBffError(error, "staff/[id]");
    }
}
