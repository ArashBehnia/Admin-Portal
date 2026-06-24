"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

interface SuspendAgencyModalProps {
    isOpen: boolean;
    agencyId: string;
    agencyName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const SuspendAgencyModal = ({
    isOpen,
    agencyId,
    agencyName,
    onClose,
    onSuccess,
}: SuspendAgencyModalProps) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setReason("");
        setError("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError("Please provide a reason for suspension.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await api.post(`/api/agencies/${agencyId}/suspend`, {
                reason: reason.trim(),
            });

            if (res.data?.success) {
                handleClose();
                onSuccess();
            } else {
                setError(res.data?.error ?? "Failed to suspend agency.");
            }
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "response" in err
            ) {
                const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
                const status = axiosErr.response?.status;
                const errorMsg = axiosErr.response?.data?.error;
                setError(
                    errorMsg ?? `Request failed with status code ${status}`,
                );
            } else {
                const message =
                    err instanceof Error ? err.message : "Failed to suspend agency.";
                setError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4 select-none animate-fade-in">
            <div
                className="bg-card rounded-lg shadow-xl w-full max-w-[440px] flex flex-col overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-[16px] font-bold text-text">
                        Suspend agency
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    <p className="text-[13px] text-muted leading-relaxed">
                        You are about to suspend{" "}
                        <span className="font-semibold text-text">
                            {agencyName}
                        </span>
                        . This will deactivate the agency and prevent agents
                        from accessing the platform.
                    </p>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Reason for suspension
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Enter the reason for suspending this agency..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none bg-card text-text placeholder:text-muted/60"
                        />
                        {error && (
                            <p className="text-[12px] text-red-500 mt-1">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-page/30">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-[13px] font-semibold text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Suspending..." : "Suspend agency"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendAgencyModal;
