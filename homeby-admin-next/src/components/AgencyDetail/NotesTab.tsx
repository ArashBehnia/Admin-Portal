'use client';

interface NotesTabProps {
    notes: string;
    onNotesChange: (val: string) => void;
}

const NotesTab = ({ notes, onNotesChange }: NotesTabProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="text-[14px] font-bold text-text">Internal notes</h2>
            </div>
            <div className="p-5">
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    className="w-full min-h-62.5 border border-border rounded p-4 text-[13px] text-text bg-card focus:outline-none focus:ring-1 focus:ring-accent resize-y"
                />
            </div>
            <div className="px-5 py-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-page/30">
                <span className="text-[12px] text-muted">Last edited: Arash · 2 May 2026 14:32</span>
                <button className="px-4 py-2 bg-page text-text hover:bg-border/40 rounded text-[13px] font-medium transition-colors cursor-pointer self-start sm:self-auto">
                    Save changes
                </button>
            </div>
        </div>
    );
};

export default NotesTab;