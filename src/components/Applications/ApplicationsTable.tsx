/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Search, Check, X } from "lucide-react";
import { Application } from "@/actions/applicationsActions";
import StatusBadge from "./StatusBadge";

const STATUS_FILTERS = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Awaiting info",
] as const;

interface ApplicationsTableProps {
    filteredApplications: Application[];
    searchQuery: string;
    statusFilter: string;
    selectedAppId?: string;
    onSearchChange: (val: string) => void;
    onStatusFilterChange: (val: "All" | Application["status"]) => void;
    onReviewClick: (app: Application) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const ApplicationsTable = ({
    filteredApplications,
    searchQuery,
    statusFilter,
    selectedAppId,
    onSearchChange,
    onStatusFilterChange,
    onReviewClick,
    onApprove,
    onReject,
}: ApplicationsTableProps) => {
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
                <div className="flex items-center gap-2 flex-wrap">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => onStatusFilterChange(filter as any)}
                            className={`px-3 py-1.5 text-[12px] font-medium rounded transition-colors ${
                                statusFilter === filter
                                    ? "bg-text text-card"
                                    : "text-muted hover:bg-page"
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
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
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
        </div>
    );
};

export default ApplicationsTable;
