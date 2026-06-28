"use client";

import { Search, Eye, SlidersHorizontal, X } from "lucide-react";
import {
    PropertyReport,
    REPORT_TYPE_OPTIONS,
    ReportTypeValue,
} from "@/types/propertyReportTypes";
import PropertyReportsPagination from "./PropertyReportsPagination";

interface PropertyReportsTableProps {
    reports: PropertyReport[];
    isLoading?: boolean;
    searchQuery: string;
    reportType: ReportTypeValue;
    startDate: string;
    endDate: string;
    showFilters: boolean;
    hasActiveFilters: boolean;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    rowsPerPage: number;
    onSearchChange: (val: string) => void;
    onReportTypeChange: (val: ReportTypeValue) => void;
    onStartDateChange: (val: string) => void;
    onEndDateChange: (val: string) => void;
    onToggleFilters: () => void;
    onResetFilters: () => void;
    onViewReport: (report: PropertyReport) => void;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}

function ReportTypeBadge({ type }: { type: string }) {
    const t = type.toLowerCase();
    if (t === "pest") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                Pest
            </span>
        );
    }
    if (t === "building") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Building
            </span>
        );
    }
    if (t === "both") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                Both
            </span>
        );
    }
    return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            {type}
        </span>
    );
}

function formatDate(iso: string): string {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const PropertyReportsTable = ({
    reports,
    isLoading,
    searchQuery,
    reportType,
    startDate,
    endDate,
    showFilters,
    hasActiveFilters,
    currentPage,
    totalPages,
    totalCount,
    rowsPerPage,
    onSearchChange,
    onReportTypeChange,
    onStartDateChange,
    onEndDateChange,
    onToggleFilters,
    onResetFilters,
    onViewReport,
    onPageChange,
    onRowsPerPageChange,
}: PropertyReportsTableProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Search + Filter Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search property, reporter..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-border rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={onResetFilters}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-muted hover:text-text border border-border rounded hover:bg-page transition-colors cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                            Clear filters
                        </button>
                    )}
                    <button
                        onClick={onToggleFilters}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                            showFilters
                                ? "bg-text text-card border-text"
                                : hasActiveFilters
                                  ? "bg-accent/10 text-accent border-accent/30"
                                  : "bg-card text-muted border-border hover:bg-page hover:text-text"
                        }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                        {hasActiveFilters && !showFilters && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 p-3 bg-page/50 border border-border rounded-lg">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            Report type
                        </label>
                        <div className="relative">
                            <select
                                value={reportType}
                                onChange={(e) =>
                                    onReportTypeChange(
                                        e.target.value as ReportTypeValue,
                                    )
                                }
                                className="appearance-none pl-3 pr-8 py-1.5 border border-border rounded text-[12px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                            >
                                {REPORT_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
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

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            Start date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="px-3 py-1.5 border border-border rounded text-[12px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            End date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="px-3 py-1.5 border border-border rounded text-[12px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[12px]">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Reporter</th>
                                <th className="px-6 py-4">Report type</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Created at</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {isLoading ? (
                                <TableSkeleton colSpan={6} />
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-muted"
                                    >
                                        No property reports found.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                    >
                                        <td className="py-2.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text leading-tight">
                                                    {report.propertyName}
                                                </span>
                                                {/* <span className="text-[11px] text-muted">
                                                    {report.propertyAddress}
                                                </span> */}
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex items-center gap-2">
                                                {/* {report.reporterAvatar ? (
                                                    <img
                                                        src={
                                                            report.reporterAvatar
                                                        }
                                                        alt={
                                                            report.reporterName
                                                        }
                                                        className="w-6 h-6 rounded-full object-cover"
                                                        onError={(e) => {
                                                            (
                                                                e.target as HTMLImageElement
                                                            ).style.display =
                                                                "none";
                                                        }}
                                                    />
                                                ) : null} */}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-text leading-tight">
                                                        {report.reporterName}
                                                    </span>
                                                    <span className="text-[11px] text-muted">
                                                        {report.reporterEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <ReportTypeBadge
                                                type={report.type}
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-text max-w-[200px] truncate">
                                            {report.message || "—"}
                                        </td>
                                        <td className="py-2.5 px-3 text-muted font-medium">
                                            {formatDate(report.createdAt)}
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <button
                                                onClick={() =>
                                                    onViewReport(report)
                                                }
                                                className="text-accent hover:underline font-medium flex items-center gap-1 ml-auto cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading && reports.length > 0 && (
                <PropertyReportsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}
        </div>
    );
};

function TableSkeleton({ colSpan }: { colSpan: number }) {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                    {Array.from({ length: colSpan }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-border/60 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default PropertyReportsTable;
