import { NextResponse } from "next/server";
import { fetchEmailTemplatesPage } from "@/lib/email-templates-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit") ?? undefined;
        const offset = searchParams.get("offset") ?? undefined;
        const filter = searchParams.get("filter") ?? undefined;

        const result = await fetchEmailTemplatesPage({
            ...(limit && { limit: Number(limit) }),
            ...(offset && { offset: Number(offset) }),
            ...(filter && { filter }),
        });

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates] GET error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { backendFetch } = await import("@/lib/api");
        const body = await request.json();
        const data = await backendFetch("/admin/template", {
            method: "POST",
            body: JSON.stringify(body),
        });
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        // console.error("[API /email-templates] POST error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
