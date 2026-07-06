import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { removeBlock } from "@/lib/blocked-ip-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ip, identity, strategy, reason, blockedAt, meta, ttlSeconds, key } = body;

        if (!ip) {
            return NextResponse.json(
                { success: false, error: "IP address is required" },
                { status: 400 },
            );
        }

        if (!key) {
            return NextResponse.json(
                { success: false, error: "Block key is required" },
                { status: 400 },
            );
        }

        try {
            const result = await removeBlock({
                ip,
                identity: identity ?? ip,
                strategy: strategy ?? "ip",
                reason: reason ?? "manual",
                blockedAt: blockedAt ?? "",
                meta: meta ?? { source: "admin-api", reason: "manual" },
                ttlSeconds: ttlSeconds ?? null,
                key,
            });
            return NextResponse.json({ success: true, data: result });
        } catch (backendError) {
        return handleBffError(backendError, "blocked-ips/remove");
    }
    } catch (error) {
        return handleBffError(error, "blocked-ips/remove");
    }
}
