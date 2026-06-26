"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
    BlockedIp,
    BlockedIpsData,
} from "@/types/blockedIpTypes";
import useBlockedIps from "@/hooks/useBlockedIps";
import BlockedIpsTable from "./BlockedIpsTable";
import BlockedIpsPagination from "./BlockedIpsPagination";

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
    } = useBlockedIps({ initialData });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-text leading-snug">
                        Blocked IPs &amp; user restrictions
                    </h1>
                    <p className="text-[13px] text-muted mt-0.5">
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
            />

            <BlockedIpsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default BlockedIpsPageClient;
