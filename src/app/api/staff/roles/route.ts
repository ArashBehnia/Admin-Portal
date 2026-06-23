import { NextResponse } from "next/server";
import { fetchRoles } from "@/lib/staff-service";

export async function GET() {
    try {
        const roles = await fetchRoles();
        return NextResponse.json(roles);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/roles] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
