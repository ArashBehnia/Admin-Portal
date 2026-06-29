"use client";

import { Plus, RefreshCw } from "lucide-react";
import { AgenciesData } from "@/types/agencyTypes";
import useAgencies from "@/hooks/useAgencies";
import AgenciesStats from "./AgenciesStats";
import AgenciesTable from "./AgenciesTable";
import AgenciesPagination from "./AgenciesPagination";
import CreateAgencySidebar from "./CreateAgencySidebar";

interface AgenciesPageClientProps {
    initialData: AgenciesData;
}

const AgenciesPageClient = ({ initialData }: AgenciesPageClientProps) => {
    const {
        stats,
        filteredAgencies,
        isLoading,
        isSearching,
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        setPageSize,
        handlePageChange,
        isModalOpen,
        setIsModalOpen,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        openMenuId,
        toggleMenu,
        closeMenu,
        refreshPage,
    } = useAgencies({ initialData });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Agencies
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                        Manage agency accounts, onboarding status and CRM
                        connections.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start shrink-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-accent hover:bg-accent/90 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Create
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <AgenciesStats stats={stats} />

            <AgenciesTable
                filteredAgencies={filteredAgencies}
                isLoading={isLoading}
                isSearching={isSearching}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                openMenuId={openMenuId}
                onSearchChange={setSearchQuery}
                onFilterChange={setActiveFilter}
                onToggleMenu={toggleMenu}
                onCloseMenu={closeMenu}
                onRefresh={refreshPage}
            />

            <AgenciesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                rowsPerPage={pageSize}
                onPageChange={handlePageChange}
                onRowsPerPageChange={setPageSize}
            />

            <CreateAgencySidebar
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
};

export default AgenciesPageClient;
