"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
    FtpRequest,
    FtpRequestsData,
} from "@/types/ftpRequestTypes";
import useFtpRequests from "@/hooks/useFtpRequests";
import FtpRequestsTable from "./FtpRequestsTable";
import FtpRequestDrawer from "./FtpRequestDrawer";

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
                onPageChange={handlePageChange}
                onRowsPerPageChange={setPageSize}
            />

            {/* Request Detail Drawer */}
            {selectedRequest && (
                <FtpRequestDrawer
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={approveRequest}
                    onReject={rejectRequest}
                />
            )}
        </div>
    );
};

export default FtpRequestsPageClient;
