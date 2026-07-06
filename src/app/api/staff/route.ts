import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import {
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
} from "@/lib/staff-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createStaffMember(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return handleBffError(error, "staff");
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) {
            return NextResponse.json(
                { error: "Staff member ID is required" },
                { status: 400 },
            );
        }
        const result = await updateStaffMember(String(id), data);
        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "staff");
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { error: "Staff member ID is required" },
                { status: 400 },
            );
        }
        await deleteStaffMember(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleBffError(error, "staff");
    }
}
