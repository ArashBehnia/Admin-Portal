'use client';

import type { NoteItem } from "@/hooks/useAgencyDetail";

interface NotesTabProps {
    notes: NoteItem[];
    isLoading: boolean;
    isSaving: boolean;
    newNoteText: string;
    onNewNoteChange: (val: string) => void;
    onAddNote: () => void;
}

function formatNoteDate(iso: string): string {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

const NotesTab = ({
    notes,
    isLoading,
    isSaving,
    newNoteText,
    onNewNoteChange,
    onAddNote,
}: NotesTabProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[14px] font-bold text-text">
                    Internal notes
                </h2>
            </div>

            {/* Notes list */}
            <div className="p-5 flex flex-col gap-3">
                {isLoading ? (
                    <div className="w-full min-h-[120px] border border-border rounded p-4 flex items-center justify-center text-[13px] text-muted">
                        Loading notes...
                    </div>
                ) : notes.length === 0 ? (
                    <div className="w-full min-h-[120px] border border-border rounded p-4 flex items-center justify-center text-[13px] text-muted">
                        No internal notes yet.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-thumb]:rounded">
                        {[...notes].reverse().map((item, i) => (
                            <div
                                key={i}
                                className="border border-border rounded p-4 flex flex-col gap-2"
                            >
                                <p className="text-[13px] text-text leading-relaxed whitespace-pre-wrap">
                                    {item.note}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-muted">
                                    {item.authorId && (
                                        <span className="font-medium">
                                            {item.authorId}
                                        </span>
                                    )}
                                    {item.authorId && item.createdAt && (
                                        <span>·</span>
                                    )}
                                    {item.createdAt && (
                                        <span>{formatNoteDate(item.createdAt)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add new note */}
            <div className="px-5 pb-5 flex flex-col gap-3">
                <textarea
                    value={newNoteText}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    placeholder="Add an internal note..."
                    rows={3}
                    className="w-full border border-border rounded p-4 text-[13px] text-text bg-card focus:outline-none focus:ring-1 focus:ring-accent resize-y placeholder:text-muted/60"
                />
                <div className="flex justify-end">
                    <button
                        onClick={onAddNote}
                        disabled={!newNoteText.trim() || isSaving}
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Adding..." : "Add note"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesTab;
