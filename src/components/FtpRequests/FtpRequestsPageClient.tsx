"use client";

import { useState, useCallback, useRef } from "react";
import { RefreshCw } from "lucide-react";
import {
    FtpRequest,
    FtpRequestsData,
} from "@/types/ftpRequestTypes";
import useFtpRequests from "@/hooks/useFtpRequests";
import FtpRequestsTable from "./FtpRequestsTable";
import FtpRequestDrawer from "./FtpRequestDrawer";
import ChangePasswordDrawer from "./ChangePasswordDrawer";
import Toast from "@/components/Shared/Toast";

interface ToastState {
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
}

interface FtpRequestsPageClientProps {
    initialData: FtpRequestsData;
}

const FtpRequestsPageClient = ({
    initialData,
}: FtpRequestsPageClientProps) => {
    const {
        requests,
        isLoading,
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        setPageSize,
        handlePageChange,
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
        approveRequest,
        rejectRequest,
    } = useFtpRequests({ initialData });

    const [selectedRequest, setSelectedRequest] =
        useState<FtpRequest | null>(null);
    const [passwordRequest, setPasswordRequest] =
        useState<FtpRequest | null>(null);

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
                4000,
            );
        },
        [],
    );

    const handleApprove = useCallback(
        async (id: string) => {
            try {
                await approveRequest(id);
                showToast("Approved", "FTP request has been approved successfully.");
            } catch (err: unknown) {
                const message =
                    (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
                    (err instanceof Error ? err.message : "Failed to approve FTP request.");
                showToast("Approve Failed", message, "error");
            }
        },
        [approveRequest, showToast],
    );

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        FTP Requests
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                        Agency staff FTP access requests
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

            <FtpRequestsTable
                requests={requests}
                isLoading={isLoading}
                searchQuery={searchQuery}
                status={status}
                showFilters={showFilters}
                hasActiveFilters={hasActiveFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                rowsPerPage={pageSize}
                onSearchChange={setSearchQuery}
                onStatusChange={setStatus}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onResetFilters={resetFilters}
                onViewRequest={setSelectedRequest}
                onChangePassword={setPasswordRequest}
                onApprove={handleApprove}
                onPageChange={handlePageChange}
                onRowsPerPageChange={setPageSize}
            />

            {/* Request Detail Drawer */}
            {selectedRequest && (
                <FtpRequestDrawer
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={handleApprove}
                    onReject={rejectRequest}
                />
            )}

            {/* Change Password Drawer */}
            {passwordRequest && (
                <ChangePasswordDrawer
                    request={passwordRequest}
                    onClose={() => setPasswordRequest(null)}
                    onSuccess={() =>
                        showToast(
                            "Password Updated",
                            "FTP password has been changed successfully.",
                        )
                    }
                />
            )}

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

export default FtpRequestsPageClient;
