"use client";

import { RefreshCw } from "lucide-react";
import { PropertyReportsData } from "@/types/propertyReportTypes";
import usePropertyReports from "@/hooks/usePropertyReports";
import PropertyReportsTable from "./PropertyReportsTable";
import PropertyReportsPagination from "./PropertyReportsPagination";

interface PropertyReportsPageClientProps {
    initialData: PropertyReportsData;
}

const PropertyReportsPageClient = ({
    initialData,
}: PropertyReportsPageClientProps) => {
    const {
        filteredReports,
        isLoading,
        currentPage,
        totalPages,
        totalCount,
        handlePageChange,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
    } = usePropertyReports({ initialData });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-text leading-snug">
                        Property reports
                    </h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        Building and pest report orders submitted from the
                        website
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

            <PropertyReportsTable
                filteredReports={filteredReports}
                isLoading={isLoading}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onSearchChange={setSearchQuery}
                onFilterChange={setActiveFilter}
            />

            <PropertyReportsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PropertyReportsPageClient;
