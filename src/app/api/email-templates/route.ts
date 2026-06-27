import { NextResponse } from "next/server";
import { fetchEmailTemplatesPage } from "@/lib/email-templates-service";
import { backendFetch } from "@/lib/api";

export async function GET() {
    try {
        console.log("[API /email-templates] GET request received");
        const data = await fetchEmailTemplatesPage();
        console.log("[API /email-templates] GET response:", JSON.stringify(data, null, 2));
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates] GET error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[API /email-templates] POST request body:", JSON.stringify(body, null, 2));
        const data = await backendFetch("/admin/template", {
            method: "POST",
            body: JSON.stringify(body),
        });
        console.log("[API /email-templates] POST response:", JSON.stringify(data, null, 2));
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates] POST error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
