/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Search, Check, X } from "lucide-react";
import { Application } from "@/actions/applicationsActions";
import StatusBadge from "./StatusBadge";
import ApplicationsPagination from "./ApplicationsPagination";

const STATUS_FILTERS = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
] as const;

interface ApplicationsTableProps {
    applications: Application[];
    totalCount: number;
    currentPage: number;
    rowsPerPage: number;
    searchQuery: string;
    statusFilter: string;
    selectedAppId?: string;
    isLoading: boolean;
    onSearchChange: (val: string) => void;
    onStatusFilterChange: (val: "All" | Application["status"]) => void;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    onReviewClick: (app: Application) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const ApplicationsTable = ({
    applications,
    totalCount,
    currentPage,
    rowsPerPage,
    searchQuery,
    statusFilter,
    selectedAppId,
    isLoading,
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
    onRowsPerPageChange,
    onReviewClick,
    onApprove,
    onReject,
}: ApplicationsTableProps) => {
    const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

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
                        className="w-full pl-9 pr-4 py-2 text-[12px] bg-card border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent text-text placeholder-muted"
                    />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onStatusFilterChange(filter as any)}
                            className={`px-4 py-1.5 text-[12px] font-medium rounded-md transition-all duration-150 cursor-pointer border ${
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
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[12px]">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4">Agency</th>
                                <th className="px-6 py-4">CRM</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {isLoading ? (
                                <>
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border/60 last:border-0">
                                            <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-32" /><div className="h-3 bg-border/60 rounded animate-pulse w-24 mt-1" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-28" /></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-border/60 rounded animate-pulse w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-border/60 rounded animate-pulse w-16" /></td>
                                            <td className="px-6 py-4 text-right"><div className="h-4 bg-border/60 rounded animate-pulse w-16 ml-auto" /></td>
                                        </tr>
                                    ))}
                                </>
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
            {!isLoading && applications.length > 0 && (
                <ApplicationsPagination
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

export default ApplicationsTable;
