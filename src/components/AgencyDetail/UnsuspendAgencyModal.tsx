"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

interface UnsuspendAgencyModalProps {
    isOpen: boolean;
    agencyId: string;
    agencyName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const UnsuspendAgencyModal = ({
    isOpen,
    agencyId,
    agencyName,
    onClose,
    onSuccess,
}: UnsuspendAgencyModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setError("");
        onClose();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const res = await api.post(`/api/agencies/${agencyId}/unsuspend`);

            if (res.data?.success) {
                handleClose();
                onSuccess();
            } else {
                setError(res.data?.error ?? "Failed to unsuspend agency.");
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
                    err instanceof Error ? err.message : "Failed to unsuspend agency.";
                setError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="overlay z-modal flex items-center justify-center p-4 select-none">
            <div
                className="bg-card rounded-lg shadow-xl w-full max-w-[440px] flex flex-col overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-[16px] font-bold text-text">
                        Unsuspend agency
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
                        You are about to unsuspend{" "}
                        <span className="font-semibold text-text">
                            {agencyName}
                        </span>
                        . This will reactivate the agency and restore platform access for the agency and its agents.
                    </p>
                    {error && (
                        <p className="text-[12px] text-red-500">
                            {error}
                        </p>
                    )}
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
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Unsuspending..." : "Unsuspend agency"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnsuspendAgencyModal;
