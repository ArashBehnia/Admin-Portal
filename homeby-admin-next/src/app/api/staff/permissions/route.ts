import { NextResponse } from "next/server";
import { fetchPermissions } from "@/lib/staff-service";

export async function GET() {
    try {
        const permissions = await fetchPermissions();
        return NextResponse.json(permissions);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /staff/permissions] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
