"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Application } from "@/types/applicationTypes";

const REJECT_REASONS = [
    "Incomplete information",
    "Invalid licence",
    "ABN mismatch",
    "Duplicate application",
    "Other",
];

interface RejectModalProps {
    app: Application;
    isRejecting: boolean;
    onConfirm: (id: string, reason: string) => void;
    onCancel: () => void;
}

const RejectModal = ({
    app,
    isRejecting,
    onConfirm,
    onCancel,
}: RejectModalProps) => {
    const [reason, setReason] = useState(REJECT_REASONS[0]);
    const [notes, setNotes] = useState("");

    const handleConfirm = () => {
        const fullReason = notes.trim()
            ? `${reason}. ${notes.trim()}`
            : reason;
        onConfirm(app.id, fullReason);
    };

    return (
        <div className="overlay z-modal flex items-center justify-center">
            <div
                className="absolute inset-0"
                onClick={onCancel}
            />
            <div className="relative bg-card rounded-lg shadow-2xl border border-border w-[460px] max-w-[90vw] p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[18px] font-bold text-text">
                        Reject {app.name}&apos;s application
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-text">
                            Reason
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-border rounded text-[14px] text-text focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                        >
                            {REJECT_REASONS.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-text">
                            Notes <span className="text-muted font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional details..."
                            rows={3}
                            className="w-full px-3 py-2 bg-card border border-border rounded text-[14px] text-text focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder-muted"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isRejecting}
                        className="px-4 py-2 text-[14px] font-medium text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isRejecting}
                        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRejecting && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isRejecting ? "Rejecting..." : "Reject"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;
