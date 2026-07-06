import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { fetchRoles } from "@/lib/staff-service";

export async function GET() {
    try {
        const roles = await fetchRoles();
        return NextResponse.json(roles);
    } catch (error) {
        return handleBffError(error, "staff/roles");
    }
}
