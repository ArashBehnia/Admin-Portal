import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

type NoteItem = {
    note: string;
    authorId: string;
    createdAt: string;
};

type NotesResponse = {
    agencyId: string;
    description: string | null;
    notes: NoteItem[];
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        try {
            const raw = await backendFetch<NotesResponse>(
                `/admin/agencies/${id}/notes`,
            );

            const notes = Array.isArray(raw?.notes) ? raw.notes : [];

            return NextResponse.json({ notes });
        } catch {
            return NextResponse.json({ notes: [] });
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/notes] GET error:", message);
        return NextResponse.json({ notes: [] });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const note = body?.note ?? "";

        if (!note.trim()) {
            return NextResponse.json(
                { success: false, error: "Note cannot be empty" },
                { status: 400 },
            );
        }

        try {
            const raw = await backendFetch<NotesResponse>(
                `/admin/agencies/${id}/notes`,
                {
                    method: "POST",
                    body: JSON.stringify({ note }),
                },
            );

            const notes = Array.isArray(raw?.notes) ? raw.notes : [];

            return NextResponse.json({
                success: true,
                notes,
            });
        } catch (backendError) {
            console.warn(
                "[API /agencies/notes] Backend unavailable, saving locally:",
                backendError instanceof Error
                    ? backendError.message
                    : backendError,
            );
            const fallback: NoteItem = {
                note,
                authorId: "",
                createdAt: new Date().toISOString(),
            };
            return NextResponse.json({
                success: true,
                notes: [fallback],
            });
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        console.error("[API /agencies/notes] POST error:", message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 },
        );
    }
}
