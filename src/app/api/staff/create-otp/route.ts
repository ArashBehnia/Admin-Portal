import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { createOtpForStaff } from "@/lib/staff-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await createOtpForStaff(body);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return handleBffError(error, "staff/create-otp");
    }
}
