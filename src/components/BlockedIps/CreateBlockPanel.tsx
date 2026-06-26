"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
    REASON_OPTIONS,
    ReasonValue,
} from "@/types/blockedIpTypes";

interface CreateBlockPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: Record<string, unknown>) => void;
}

const CreateBlockPanel = ({
    isOpen,
    onClose,
    onSubmit,
}: CreateBlockPanelProps) => {
    const [ip, setIp] = useState("");
    const [ttlSeconds, setTtlSeconds] = useState("");
    const [reason, setReason] = useState<ReasonValue>("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const resetForm = () => {
        setIp("");
        setTtlSeconds("");
        setReason("");
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        setError("");

        if (!ip.trim()) {
            setError("IP address is required.");
            return;
        }
        if (!reason) {
            setError("Reason is required.");
            return;
        }

        const payload: Record<string, unknown> = {
            ip: ip.trim(),
            reason,
        };

        if (ttlSeconds.trim() !== "") {
            const parsed = Number(ttlSeconds);
            if (Number.isNaN(parsed) || parsed <= 0) {
                setError("TTL must be a positive number.");
                return;
            }
            payload.ttlSeconds = parsed;
        }

        onSubmit(payload);
    };

    const reasonOptions = REASON_OPTIONS.filter((opt) => opt.value !== "");

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />
            <div className="relative w-full max-w-[480px] bg-card shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <div>
                        <h2 className="text-[16px] font-bold text-text">
                            Block IP Address
                        </h2>
                        <p className="text-[12px] text-muted mt-0.5">
                            Add a new IP to the blocklist.
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            IP Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 192.168.0.1"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                        <p className="text-[11px] text-muted">
                            The IP address to block from accessing the platform.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            TTL (Seconds)
                        </label>
                        <input
                            type="number"
                            placeholder="Leave empty for no expiry"
                            min={1}
                            value={ttlSeconds}
                            onChange={(e) => setTtlSeconds(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                        <p className="text-[11px] text-muted">
                            Time-to-live in seconds. If left empty, the block will not expire.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value as ReasonValue)
                                }
                                className="w-full appearance-none border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text cursor-pointer"
                            >
                                <option value="">Select a reason</option>
                                {reasonOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-3 h-3 text-muted"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-[12px] text-red-500">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-page/30 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-[13px] font-semibold text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-[13px] font-medium transition-colors cursor-pointer"
                    >
                        Block IP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBlockPanel;
