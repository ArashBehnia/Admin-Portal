import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchPermissions } from "@/lib/staff-service";

export async function GET() {
    try {
        const permissions = await fetchPermissions();
        return NextResponse.json(permissions);
    } catch (error) {
        return handleBffError(error, "staff/permissions");
    }
}
