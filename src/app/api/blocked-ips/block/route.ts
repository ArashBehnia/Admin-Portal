import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { createBlock } from "@/lib/blocked-ip-service";
import type { CreateBlockPayload } from "@/types/blockedIpTypes";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const ip = body?.ip?.trim();
        const reason = body?.reason?.trim();
        const ttlSeconds = body?.ttlSeconds;

        if (!ip) {
            return NextResponse.json(
                { success: false, error: "IP address is required" },
                { status: 400 },
            );
        }

        if (!reason) {
            return NextResponse.json(
                { success: false, error: "Reason is required" },
                { status: 400 },
            );
        }

        const payload: CreateBlockPayload = {
            ip: ip.trim(),
            reason,
        };

        if (ttlSeconds != null && ttlSeconds !== "" && ttlSeconds !== undefined) {
            const parsed = Number(ttlSeconds);
            if (!Number.isNaN(parsed) && parsed > 0) {
                payload.ttlSeconds = parsed;
            }
        }

        try {
            const result = await createBlock(payload);
            return NextResponse.json({ success: true, data: result });
        } catch (backendError) {
        return handleBffError(backendError, "blocked-ips/block");
    }
    } catch (error) {
        return handleBffError(error, "blocked-ips/block");
    }
}
