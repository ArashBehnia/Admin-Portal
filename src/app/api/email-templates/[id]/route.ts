import { NextResponse } from "next/server";
import { fetchEmailTemplateByName, fetchEmailTemplateById, updateTemplate, deleteTemplate } from "@/lib/email-templates-service";

interface RouteParams {
    params: Promise<{ id: string }>;
}

async function findTemplate(identifier: string) {
    // If it looks like a UUID, try by ID first
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)) {
        const byId = await fetchEmailTemplateById(identifier);
        if (byId) return byId;
    }
    // Fall back to name lookup
    return fetchEmailTemplateByName(identifier);
}

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        console.log("[API /email-templates/[id]] GET identifier:", id);
        const data = await findTemplate(id);
        if (!data) {
            console.log("[API /email-templates/[id]] GET not found for:", id);
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

        // Resolve the actual ID if we received a name
        let actualId = id;
        try {
            const existing = await findTemplate(id);
            if (existing?.id) {
                actualId = existing.id;
                console.log("[API /email-templates/[id]] PUT resolved id:", actualId);
            }
        } catch (findErr) {
            console.warn("[API /email-templates/[id]] PUT findTemplate failed, using raw id:", findErr);
        }

        const data = await updateTemplate(actualId, body as Record<string, unknown>);
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

        const existing = await findTemplate(id);
        const actualId = existing?.id || id;

        console.log("[API /email-templates/[id]] DELETE id:", actualId);
        await deleteTemplate(actualId);
        console.log("[API /email-templates/[id]] DELETE completed for id:", actualId);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /email-templates/[id]] DELETE error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
