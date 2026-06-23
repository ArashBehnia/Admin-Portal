import { NextResponse } from "next/server";
import { createOtpForStaff } from "@/lib/staff-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createOtpForStaff(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/create-otp] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
