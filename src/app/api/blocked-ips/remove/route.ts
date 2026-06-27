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
            const status =
                backendError instanceof Error &&
                "status" in backendError
                    ? (backendError as { status: number }).status
                    : 500;
            const message =
                backendError instanceof Error
                    ? backendError.message
                    : String(backendError);
            console.error(
                `[API /blocked-ips/remove] Backend error ${status}:`,
                message,
            );
            return NextResponse.json(
                { success: false, error: message },
                { status },
            );
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /blocked-ips/remove] POST error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
