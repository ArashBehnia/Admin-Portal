import { NextResponse } from "next/server";
import { backendFetch, handleBffError } from "@/lib/api";

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
        } catch (error) {
        return handleBffError(error, "agencies/[id]/notes");
    }
    } catch (error) {
        return handleBffError(error, "agencies/[id]/notes");
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
        return handleBffError(backendError, "agencies/[id]/notes");
    }
    } catch (error) {
        return handleBffError(error, "agencies/[id]/notes");
    }
}
