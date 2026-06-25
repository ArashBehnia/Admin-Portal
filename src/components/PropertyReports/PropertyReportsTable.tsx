"use client";

import { Search, Eye } from "lucide-react";
import {
    PropertyReport,
    REPORT_TYPE_FILTERS,
    ReportTypeFilter,
} from "@/types/propertyReportTypes";

interface PropertyReportsTableProps {
    filteredReports: PropertyReport[];
    isLoading?: boolean;
    searchQuery: string;
    activeFilter: ReportTypeFilter;
    onSearchChange: (val: string) => void;
    onFilterChange: (filter: ReportTypeFilter) => void;
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
    filteredReports,
    isLoading,
    searchQuery,
    activeFilter,
    onSearchChange,
    onFilterChange,
}: PropertyReportsTableProps) => {
    return (
        <div className="flex flex-col gap-5">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search property, reporter..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-border rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                    {REPORT_TYPE_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onFilterChange(filter)}
                            className={`px-3 py-1.5 rounded text-[12px] font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                                activeFilter === filter
                                    ? "bg-text text-card border-text"
                                    : "bg-card text-muted border-border hover:bg-page hover:text-text"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded border border-border shadow-sm w-full overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left text-[12px] whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-border bg-card text-muted">
                                <th className="font-medium py-3 px-4">
                                    Property
                                </th>
                                <th className="font-medium py-3 px-4">
                                    Reporter
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Report type
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Message
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Created at
                                </th>
                                <th className="font-medium py-3 px-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-muted"
                                    >
                                        Loading…
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-muted"
                                    >
                                        No property reports found.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
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
                                                        src={report.reporterAvatar}
                                                        alt={report.reporterName}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center text-[10px] font-medium text-muted">
                                                        {report.reporterName
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()
                                                            .slice(0, 2)}
                                                    </div>
                                                )} */}
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
                                            <button className="text-accent hover:underline font-medium flex items-center gap-1 ml-auto cursor-pointer">
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
        </div>
    );
};

export default PropertyReportsTable;
