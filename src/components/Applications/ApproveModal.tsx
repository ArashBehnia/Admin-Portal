"use client";

import { X } from "lucide-react";
import type { Application } from "@/types/applicationTypes";

interface ApproveModalProps {
    app: Application;
    isApproving: boolean;
    onConfirm: (id: string) => void;
    onCancel: () => void;
}

const ApproveModal = ({
    app,
    isApproving,
    onConfirm,
    onCancel,
}: ApproveModalProps) => {
    return (
        <div className="overlay z-modal flex items-center justify-center">
            <div
                className="absolute inset-0"
                onClick={onCancel}
            />
            <div className="relative bg-card rounded-lg shadow-2xl border border-border w-[460px] max-w-[90vw] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-text">
                        Approve {app.name}?
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <ul className="flex flex-col gap-1.5 text-[14px] text-text list-disc pl-5 mb-6">
                    <li>Create their agent account</li>
                    <li>Send welcome email with temporary password</li>
                    <li>Add them to {app.agency}</li>
                </ul>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isApproving}
                        className="px-4 py-2 text-[14px] font-medium text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(app.id)}
                        disabled={isApproving}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {isApproving && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isApproving ? "Approving..." : "Confirm approve"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveModal;
