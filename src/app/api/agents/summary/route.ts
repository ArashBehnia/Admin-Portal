import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET() {
    try {
        const raw = await backendFetch<unknown>("/admin/agents/summary");
        const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
            ? raw as Record<string, unknown>
            : {};

        return NextResponse.json({
            total: typeof obj.total === "number" ? obj.total : 0,
            active: typeof obj.active === "number" ? obj.active : 0,
            inactive: typeof obj.inactive === "number" ? obj.inactive : 0,
            ftp_enabled: typeof obj.ftp_enabled === "number" ? obj.ftp_enabled : 0,
            active_listings: typeof obj.active_listings === "number" ? obj.active_listings : 0,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agents/summary] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
