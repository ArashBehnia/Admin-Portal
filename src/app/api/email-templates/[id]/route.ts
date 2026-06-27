import { NextResponse } from "next/server";
import { fetchEmailTemplateByName, fetchEmailTemplateById, updateTemplate, deleteTemplate } from "@/lib/email-templates-service";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveId(identifier: string): Promise<string> {
    if (UUID_RE.test(identifier)) return identifier;

    const template = await fetchEmailTemplateByName(identifier);
    if (template?.id && UUID_RE.test(template.id)) return template.id;

    throw new Error(`Could not resolve "${identifier}" to a valid template UUID`);
}

export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        let data = null;

        if (UUID_RE.test(id)) {
            data = await fetchEmailTemplateById(id);
        } else {
            data = await fetchEmailTemplateByName(id);
        }

        if (!data) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const actualId = await resolveId(id);

        const { id: _id, ...payload } = body as Record<string, unknown>;
        const data = await updateTemplate(actualId, payload);
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const actualId = await resolveId(id);

        await deleteTemplate(actualId);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
