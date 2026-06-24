"use client";

import { Plus } from "lucide-react";
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
        currentPage,
        totalPages,
        totalCount,
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
    } = useAgencies({ initialData });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-text leading-snug">
                        Agencies
                    </h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        Manage agency accounts, onboarding status and CRM
                        connections.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent hover:bg-accent/90 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors self-start shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Create
                </button>
            </div>

            <AgenciesStats stats={stats} />

            <AgenciesTable
                filteredAgencies={filteredAgencies}
                isLoading={isLoading}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                openMenuId={openMenuId}
                onSearchChange={setSearchQuery}
                onFilterChange={setActiveFilter}
                onToggleMenu={toggleMenu}
                onCloseMenu={closeMenu}
            />

            <AgenciesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
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
