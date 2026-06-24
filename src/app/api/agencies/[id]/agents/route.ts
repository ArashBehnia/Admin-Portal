import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? "100";

        const raw = await backendFetch<unknown>(
            `/admin/agency-staff/page?agencyId=${encodeURIComponent(id)}&limit=${encodeURIComponent(limit)}`,
        );

        const items = toArray<{
            id?: string;
            name?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            mobile?: string;
            role?: string;
            status?: string;
            licence?: string;
            license?: string;
            lastLogin?: string;
            lastLoggedIn?: string;
        }>(raw);

        const agents = items.map((item) => ({
            name: String(item.name ?? [item.firstName, item.lastName].filter(Boolean).join(" ") ?? ""),
            role: String(item.role ?? ""),
            email: String(item.email ?? ""),
            phone: String(item.phone ?? item.mobile ?? ""),
            licence: String(item.licence ?? item.license ?? ""),
            lastLogin: String(item.lastLogin ?? item.lastLoggedIn ?? "Never"),
            status: mapStatus(item.status),
        }));

        return NextResponse.json({ agents });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/agents] GET error:", message);
        return NextResponse.json({ agents: [] });
    }
}

function mapStatus(status?: string): "Active" | "Inactive" | "Pending" {
    if (!status) return "Active";
    const s = status.toLowerCase();
    if (s === "active" || s === "live") return "Active";
    if (s === "inactive" || s === "disabled") return "Inactive";
    if (s === "pending") return "Pending";
    return "Active";
}
