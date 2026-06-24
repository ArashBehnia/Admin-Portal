/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Search, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Application } from "@/actions/applicationsActions";
import StatusBadge from "./StatusBadge";

const STATUS_FILTERS = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
] as const;

const ROWS_PER_PAGE = 10;

interface ApplicationsTableProps {
    applications: Application[];
    totalCount: number;
    currentPage: number;
    searchQuery: string;
    statusFilter: string;
    selectedAppId?: string;
    isLoading: boolean;
    onSearchChange: (val: string) => void;
    onStatusFilterChange: (val: "All" | Application["status"]) => void;
    onPageChange: (page: number) => void;
    onReviewClick: (app: Application) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const ApplicationsTable = ({
    applications,
    totalCount,
    currentPage,
    searchQuery,
    statusFilter,
    selectedAppId,
    isLoading,
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
    onReviewClick,
    onApprove,
    onReject,
}: ApplicationsTableProps) => {
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    return (
        <div className="flex flex-col gap-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search applicant name, agency, email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-[13px] bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-text placeholder-muted"
                    />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onStatusFilterChange(filter as any)}
                            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 cursor-pointer border ${
                                statusFilter === filter
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
            <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full text-left text-[13px] table-auto">
                        <thead>
                            <tr className="border-b border-border text-muted bg-card">
                                <th className="font-medium py-3 pl-4 pr-3">
                                    Applicant
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Agency
                                </th>
                                <th className="font-medium py-3 px-3">CRM</th>
                                <th className="font-medium py-3 px-3">
                                    Submitted
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Status
                                </th>
                                <th className="font-medium py-3 pl-3 pr-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-16 text-center text-sm text-muted"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className={`border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors ${
                                            selectedAppId === app.id
                                                ? "bg-page/40 border-l-2 border-l-accent"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-3 pl-4 pr-3 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text">
                                                    {app.name || "\u2014"}
                                                </span>
                                                <span className="text-muted text-[12px]">
                                                    {app.email || "\u2014"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-text whitespace-nowrap">
                                            {app.agency || "\u2014"}
                                        </td>
                                        <td className="py-3 px-3 whitespace-nowrap">
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-page text-muted border border-border">
                                                {app.crm || "\u2014"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-muted whitespace-nowrap">
                                            {app.submitted || "\u2014"}
                                        </td>
                                        <td className="py-3 px-3 whitespace-nowrap">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="py-3 pl-3 pr-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() =>
                                                        onReviewClick(app)
                                                    }
                                                    className="text-accent font-medium hover:underline text-[13px] cursor-pointer"
                                                >
                                                    Review
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onApprove(app.id)
                                                    }
                                                    className="text-green-500 hover:text-green-700 transition-colors cursor-pointer"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onReject(app.id)
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-16 text-center text-sm text-muted"
                                    >
                                        No applications match your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalCount > ROWS_PER_PAGE && (
                <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted">
                        Showing {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, totalCount)} to{" "}
                        {Math.min(currentPage * ROWS_PER_PAGE, totalCount)} of {totalCount}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="p-1.5 rounded border border-border text-muted hover:bg-page hover:text-text transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                if (totalPages <= 5) return true;
                                if (page === 1 || page === totalPages) return true;
                                if (Math.abs(page - currentPage) <= 1) return true;
                                return false;
                            })
                            .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                                if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                                    acc.push("ellipsis");
                                }
                                acc.push(page);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === "ellipsis" ? (
                                    <span key={`ellipsis-${idx}`} className="px-1 text-muted">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => onPageChange(item)}
                                        className={`min-w-[32px] h-8 px-2 text-[13px] font-medium rounded border transition-colors cursor-pointer ${
                                            currentPage === item
                                                ? "bg-text text-card border-text"
                                                : "bg-card text-muted border-border hover:bg-page hover:text-text"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ),
                            )}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-1.5 rounded border border-border text-muted hover:bg-page hover:text-text transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsTable;
