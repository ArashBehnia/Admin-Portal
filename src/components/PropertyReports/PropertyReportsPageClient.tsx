"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
    PropertyReport,
    PropertyReportsData,
} from "@/types/propertyReportTypes";
import usePropertyReports from "@/hooks/usePropertyReports";
import PropertyReportsTable from "./PropertyReportsTable";
import PropertyReportDrawer from "./PropertyReportDrawer";

interface PropertyReportsPageClientProps {
    initialData: PropertyReportsData;
}

const PropertyReportsPageClient = ({
    initialData,
}: PropertyReportsPageClientProps) => {
    const {
        reports,
        isLoading,
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        setPageSize,
        handlePageChange,
        searchQuery,
        setSearchQuery,
        reportType,
        setReportType,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        showFilters,
        setShowFilters,
        hasActiveFilters,
        resetFilters,
    } = usePropertyReports({ initialData });

    const [selectedReport, setSelectedReport] =
        useState<PropertyReport | null>(null);

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Property reports
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
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
                reports={reports}
                isLoading={isLoading}
                searchQuery={searchQuery}
                reportType={reportType}
                startDate={startDate}
                endDate={endDate}
                showFilters={showFilters}
                hasActiveFilters={hasActiveFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                rowsPerPage={pageSize}
                onSearchChange={setSearchQuery}
                onReportTypeChange={setReportType}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onResetFilters={resetFilters}
                onViewReport={setSelectedReport}
                onPageChange={handlePageChange}
                onRowsPerPageChange={setPageSize}
            />

            {/* Report Detail Drawer */}
            {selectedReport && (
                <PropertyReportDrawer
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
};

export default PropertyReportsPageClient;
