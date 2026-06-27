"use client";

import { Search, Eye, SlidersHorizontal, X } from "lucide-react";
import {
    FtpRequest,
    STATUS_OPTIONS,
    StatusValue,
} from "@/types/ftpRequestTypes";

interface FtpRequestsTableProps {
    requests: FtpRequest[];
    isLoading?: boolean;
    searchQuery: string;
    status: StatusValue;
    showFilters: boolean;
    hasActiveFilters: boolean;
    onSearchChange: (val: string) => void;
    onStatusChange: (val: StatusValue) => void;
    onToggleFilters: () => void;
    onResetFilters: () => void;
    onViewRequest: (request: FtpRequest) => void;
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === "pending") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                Pending
            </span>
        );
    }
    if (s === "approved") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                Approved
            </span>
        );
    }
    if (s === "rejected") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                Rejected
            </span>
        );
    }
    return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            {status}
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

const FtpRequestsTable = ({
    requests,
    isLoading,
    searchQuery,
    status,
    showFilters,
    hasActiveFilters,
    onSearchChange,
    onStatusChange,
    onToggleFilters,
    onResetFilters,
    onViewRequest,
}: FtpRequestsTableProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Search + Filter Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search agency, agent, email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-border rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text shadow-sm"
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
                            Status
                        </label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) =>
                                    onStatusChange(
                                        e.target.value as StatusValue,
                                    )
                                }
                                className="appearance-none pl-3 pr-8 py-1.5 border border-border rounded text-[13px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                            >
                                {STATUS_OPTIONS.map((opt) => (
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
                </div>
            )}

            {/* Table */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">Agency</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Allowed IP</th>
                                <th className="px-6 py-4">FTP Username</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Requested At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {isLoading ? (
                                <TableSkeleton colSpan={8} />
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-muted"
                                    >
                                        No FTP requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                    >
                                        <td className="py-2.5 px-4">
                                            <span className="font-bold text-text leading-tight">
                                                {req.agencyName}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-text leading-tight">
                                                    {req.agentName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-text">
                                            {req.email || "—"}
                                        </td>
                                        <td className="py-2.5 px-4 text-text font-mono text-[11px]">
                                            {req.allowedIp || "—"}
                                        </td>
                                        <td className="py-2.5 px-4 text-text">
                                            {req.ftpUsername || "—"}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="py-2.5 px-3 text-muted font-medium">
                                            {formatDate(req.requestedAt)}
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <button
                                                onClick={() =>
                                                    onViewRequest(req)
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

export default FtpRequestsTable;
