"use client";

import { Search, SlidersHorizontal, X, Trash2, Plus } from "lucide-react";
import {
    BlockedIp,
    STRATEGY_OPTIONS,
    REASON_OPTIONS,
    StrategyValue,
    ReasonValue,
} from "@/types/blockedIpTypes";

interface BlockedIpsTableProps {
    entries: BlockedIp[];
    isLoading?: boolean;
    searchQuery: string;
    strategy: StrategyValue;
    reason: ReasonValue;
    showFilters: boolean;
    hasActiveFilters: boolean;
    onSearchChange: (val: string) => void;
    onStrategyChange: (val: StrategyValue) => void;
    onReasonChange: (val: ReasonValue) => void;
    onToggleFilters: () => void;
    onResetFilters: () => void;
    onCreateClick: () => void;
}

function StrategyBadge({ strategy }: { strategy: string }) {
    const s = strategy.toLowerCase();
    if (s === "ip") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                IP
            </span>
        );
    }
    if (s === "user") {
        return (
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                User
            </span>
        );
    }
    return (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            {strategy}
        </span>
    );
}

function ReasonBadge({ reason }: { reason: string }) {
    const r = reason.toLowerCase();
    let label = reason;
    let colorClass = "bg-gray-100 text-gray-600 border-gray-200";

    if (r === "manual") {
        label = "Manual";
        colorClass = "bg-green-50 text-green-700 border-green-200";
    } else if (r === "login-failure") {
        label = "Login failure";
        colorClass = "bg-orange-50 text-orange-700 border-orange-200";
    } else if (r === "2fa-failure") {
        label = "2FA failure";
        colorClass = "bg-red-50 text-red-700 border-red-200";
    } else if (r === "rate-limit-ip") {
        label = "Rate limit: IP";
        colorClass = "bg-blue-50 text-blue-700 border-blue-200";
    } else if (r === "rate-limit-user") {
        label = "Rate limit: User";
        colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
    } else if (r === "honeypot") {
        label = "Honeypot";
        colorClass = "bg-purple-50 text-purple-700 border-purple-200";
    }

    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${colorClass}`}>
            {label}
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
        hour: "2-digit",
        minute: "2-digit",
    });
}

const BlockedIpsTable = ({
    entries,
    isLoading,
    searchQuery,
    strategy,
    reason,
    showFilters,
    hasActiveFilters,
    onSearchChange,
    onStrategyChange,
    onReasonChange,
    onToggleFilters,
    onResetFilters,
    onCreateClick,
}: BlockedIpsTableProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Search + Filter Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search IP, user..."
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
                    <button
                        onClick={onCreateClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Create
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 p-3 bg-page/50 border border-border rounded-lg">
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            Strategy
                        </label>
                        <div className="relative">
                            <select
                                value={strategy}
                                onChange={(e) =>
                                    onStrategyChange(
                                        e.target.value as StrategyValue,
                                    )
                                }
                                className="appearance-none pl-3 pr-8 py-1.5 border border-border rounded text-[13px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                            >
                                {STRATEGY_OPTIONS.map((opt) => (
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
                            Reason
                        </label>
                        <div className="relative">
                            <select
                                value={reason}
                                onChange={(e) =>
                                    onReasonChange(
                                        e.target.value as ReasonValue,
                                    )
                                }
                                className="appearance-none pl-3 pr-8 py-1.5 border border-border rounded text-[13px] bg-card text-text focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                            >
                                {REASON_OPTIONS.map((opt) => (
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
            <div className="bg-card rounded border border-border shadow-sm w-full overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left text-[12px] whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-border bg-card text-muted">
                                <th className="font-semibold py-3 px-4 uppercase">
                                    IP / User
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase">
                                    Strategy
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase">
                                    Reason
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase">
                                    Blocked at
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase">
                                    TTL
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase">
                                    Meta
                                </th>
                                <th className="font-semibold py-3 px-4 uppercase text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10 text-center text-muted"
                                    >
                                        Loading…
                                    </td>
                                </tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10 text-center text-muted"
                                    >
                                        No blocked IPs found.
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry, index) => (
                                    <tr
                                        key={entry.id ? `${entry.id}-${index}` : index}
                                        className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                    >
                                        <td className="py-2.5 px-4 font-mono text-[11px] text-text">
                                            {entry.ipOrUser || "—"}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <StrategyBadge
                                                strategy={entry.strategy}
                                            />
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <ReasonBadge
                                                reason={entry.reason}
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-muted font-medium">
                                            {formatDate(entry.blockedAt)}
                                        </td>
                                        <td className="py-2.5 px-3 text-text">
                                            {entry.ttl || "No expiry"}
                                        </td>
                                        <td className="py-2.5 px-3 text-text font-mono text-[10px] max-w-[200px] truncate">
                                            {entry.meta ? (typeof entry.meta === 'object' ? JSON.stringify(entry.meta) : entry.meta) : "—"}
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <button
                                                className="text-red-500 hover:text-red-700 hover:underline font-medium flex items-center gap-1 ml-auto cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
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

export default BlockedIpsTable;
