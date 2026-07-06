import { handleBffError } from "@/lib/api";
import { NextResponse } from "next/server";
import { generateApplication } from "@/lib/application-service";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        // console.log("[API /applications/[id]/generate] POST request, id:", id);
        const result = await generateApplication(id);
        // console.log("[API /applications/[id]/generate] result:", JSON.stringify(result).slice(0, 500));
        return NextResponse.json(result);
    } catch (error) {
        return handleBffError(error, "applications/[id]/generate");
    }
}
