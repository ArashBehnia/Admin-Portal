"use client";

import { useState, useCallback, useRef } from "react";
import { RefreshCw } from "lucide-react";
import {
    BlockedIp,
    BlockedIpsData,
} from "@/types/blockedIpTypes";
import useBlockedIps from "@/hooks/useBlockedIps";
import api from "@/lib/axios";
import Toast from "@/components/Shared/Toast";
import type { ToastState } from "@/hooks/useStaffAndRoles";
import BlockedIpsTable from "./BlockedIpsTable";
import BlockedIpsPagination from "./BlockedIpsPagination";
import CreateBlockPanel from "./CreateBlockPanel";
import ConfirmBlockModal from "./ConfirmBlockModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface BlockedIpsPageClientProps {
    initialData: BlockedIpsData;
}

const BlockedIpsPageClient = ({
    initialData,
}: BlockedIpsPageClientProps) => {
    const {
        entries,
        isLoading,
        currentPage,
        totalPages,
        totalCount,
        handlePageChange,
        searchQuery,
        setSearchQuery,
        strategy,
        setStrategy,
        reason,
        setReason,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
        refreshClean,
    } = useBlockedIps({ initialData });

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<BlockedIp | null>(null);
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        title: "",
        message: "",
        type: "success",
    });
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback(
        (title: string, message: string, type: ToastState["type"] = "success") => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            setToast({ visible: true, title, message, type });
            toastTimerRef.current = setTimeout(
                () => setToast((prev) => ({ ...prev, visible: false })),
                3000,
            );
        },
        [],
    );

    const handleCreateClick = () => {
        setIsPanelOpen(true);
    };

    const handlePanelSubmit = (payload: Record<string, unknown>) => {
        setPendingPayload(payload);
        setShowConfirm(true);
    };

    const handleConfirmBlock = async () => {
        if (!pendingPayload) return;

        try {
            const res = await api.post("/api/blocked-ips/block", pendingPayload);

            if (res.data?.success) {
                const data = res.data.data;
                setShowConfirm(false);
                setPendingPayload(null);
                setIsPanelOpen(false);

                if (data?.blocked === false) {
                    showToast(
                        "Already Blocked",
                        `${pendingPayload.ip} is already in the blocklist.`,
                        "info",
                    );
                } else {
                    showToast(
                        "IP Blocked",
                        `${pendingPayload.ip} has been added to the blocklist.`,
                        "success",
                    );
                }

                refreshClean();
            } else {
                showToast(
                    "Block Failed",
                    res.data?.error ?? "Failed to block IP.",
                    "error",
                );
            }
        } catch (err: unknown) {
            let message = "Failed to block IP.";
            if (
                err &&
                typeof err === "object" &&
                "response" in err
            ) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                message = axiosErr.response?.data?.error ?? message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            showToast("Block Failed", message, "error");
        }
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
        setPendingPayload(null);
    };

    const handleDeleteClick = (entry: BlockedIp) => {
        setSelectedEntry(entry);
        setShowDeleteConfirm(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setSelectedEntry(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedEntry) return;

        try {
            const res = await api.post("/api/blocked-ips/remove", {
                ip: selectedEntry.ipOrUser,
                identity: selectedEntry.ipOrUser,
                strategy: selectedEntry.strategy,
                reason: selectedEntry.reason,
                blockedAt: selectedEntry.blockedAt,
                meta: selectedEntry.meta,
                ttlSeconds: selectedEntry.ttl ? Number(selectedEntry.ttl) : null,
                key: selectedEntry.key,
            });

            if (res.data?.success) {
                setShowDeleteConfirm(false);
                setSelectedEntry(null);
                showToast(
                    "IP Removed",
                    `${selectedEntry.ipOrUser} has been removed from the blocklist.`,
                    "success",
                );
                refreshClean();
            } else {
                showToast(
                    "Remove Failed",
                    res.data?.error ?? "Failed to remove blocked IP.",
                    "error",
                );
            }
        } catch (err: unknown) {
            let message = "Failed to remove blocked IP.";
            if (
                err &&
                typeof err === "object" &&
                "response" in err
            ) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                message = axiosErr.response?.data?.error ?? message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            showToast("Remove Failed", message, "error");
        }
    };

    const handlePanelClose = () => {
        setIsPanelOpen(false);
    };

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Blocked IPs &amp; user restrictions
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                        Temporary and manual restrictions. Removing an entry
                        immediately allows that IP or user again.
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors self-start shrink-0 cursor-pointer"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <BlockedIpsTable
                entries={entries}
                isLoading={isLoading}
                searchQuery={searchQuery}
                strategy={strategy}
                reason={reason}
                showFilters={showFilters}
                hasActiveFilters={hasActiveFilters}
                onSearchChange={setSearchQuery}
                onStrategyChange={setStrategy}
                onReasonChange={setReason}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onResetFilters={resetFilters}
                onCreateClick={handleCreateClick}
                onDelete={handleDeleteClick}
            />

            <BlockedIpsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />

            {/* Create Block Panel */}
            <CreateBlockPanel
                isOpen={isPanelOpen}
                onClose={handlePanelClose}
                onSubmit={handlePanelSubmit}
            />

            {/* Confirm Block Modal */}
            <ConfirmBlockModal
                isOpen={showConfirm}
                ip={String(pendingPayload?.ip ?? "")}
                onCancel={handleConfirmCancel}
                onConfirm={handleConfirmBlock}
            />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteConfirm}
                ip={selectedEntry?.ipOrUser ?? ""}
                onCancel={handleDeleteCancel}
                onConfirm={handleConfirmDelete}
            />

            {/* Toast */}
            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default BlockedIpsPageClient;
