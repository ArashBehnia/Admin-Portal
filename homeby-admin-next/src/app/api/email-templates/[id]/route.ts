import { NextResponse } from "next/server";
import { fetchEmailTemplateById, updateTemplate, deleteTemplate } from "@/lib/email-templates-service";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        console.log("[API /email-templates/[id]] GET id:", id);
        const data = await fetchEmailTemplateById(id);
        if (!data) {
            console.log("[API /email-templates/[id]] GET not found for id:", id);
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }
        console.log("[API /email-templates/[id]] GET response:", JSON.stringify(data, null, 2));
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates/[id]] GET error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log("[API /email-templates/[id]] PUT id:", id, "body:", JSON.stringify(body, null, 2));
        const data = await updateTemplate(id, body);
        console.log("[API /email-templates/[id]] PUT response:", JSON.stringify(data, null, 2));
        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates/[id]] PUT error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        console.log("[API /email-templates/[id]] DELETE id:", id);
        await deleteTemplate(id);
        console.log("[API /email-templates/[id]] DELETE completed for id:", id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates/[id]] DELETE error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
