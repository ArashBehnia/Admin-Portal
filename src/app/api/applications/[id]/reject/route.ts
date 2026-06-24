import { NextResponse } from "next/server";
import { rejectApplication } from "@/lib/application-service";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log("[API /applications/[id]/reject] POST request:", { id, body });
        const result = await rejectApplication(id, body.reason ?? "");
        console.log("[API /applications/[id]/reject] result:", JSON.stringify(result).slice(0, 500));
        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /applications/[id]/reject] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
