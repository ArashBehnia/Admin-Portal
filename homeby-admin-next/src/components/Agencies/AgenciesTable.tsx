"use client";

import Link from "next/link";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
    Agency,
    AGENCY_FILTERS,
    AgencyFilter,
} from "@/types/agencyTypes";
import {
    SubscriptionBadge,
    OnboardingBadge,
    FeedStatusBadge,
} from "./AgencyBadges";

interface AgenciesTableProps {
    filteredAgencies: Agency[];
    isLoading?: boolean;
    searchQuery: string;
    activeFilter: AgencyFilter;
    openMenuId: string | null;
    onSearchChange: (val: string) => void;
    onFilterChange: (filter: AgencyFilter) => void;
    onToggleMenu: (id: string) => void;
    onCloseMenu: () => void;
    onInviteClick: () => void;
}

const AgenciesTable = ({
    filteredAgencies,
    isLoading,
    searchQuery,
    activeFilter,
    openMenuId,
    onSearchChange,
    onFilterChange,
    onToggleMenu,
    onCloseMenu,
    onInviteClick,
}: AgenciesTableProps) => {
    return (
        <div className="flex flex-col gap-5">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search agency name, ABN, contact email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-border rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                    {AGENCY_FILTERS.map((filter) => (
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
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-[12px] whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-border bg-card text-muted">
                                <th className="font-medium py-3 px-4">
                                    Agency
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Subscription
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Onboarding
                                </th>
                                <th className="font-medium py-3 px-3 text-right">
                                    Listings
                                </th>
                                <th className="font-medium py-3 px-3 text-right">
                                    Agents
                                </th>
                                <th className="font-medium py-3 px-3">Feed</th>
                                <th className="font-medium py-3 px-3 text-right">
                                    MRR
                                </th>
                                <th className="font-medium py-3 px-4 text-left">
                                    Last activity
                                </th>
                                <th className="font-medium py-3 px-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-10 text-center text-muted"
                                    >
                                        Loading…
                                    </td>
                                </tr>
                            ) : filteredAgencies.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-muted"
                                    >
                                        No agencies found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAgencies.map((agency) => (
                                    <tr
                                        key={agency?.id}
                                        className={`border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors group ${
                                            agency?.highlight === "orange"
                                                ? "border-l-[3px] border-l-orange-400"
                                                : agency?.highlight === "red"
                                                  ? "border-l-[3px] border-l-red-500"
                                                  : ""
                                        }`}
                                    >
                                        <td className="py-2.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text leading-tight">
                                                    {agency?.name}
                                                </span>
                                                <span className="text-[11px] text-muted">
                                                    {agency?.location}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <SubscriptionBadge
                                                type={
                                                    agency?.subscription ?? ""
                                                }
                                            />
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <OnboardingBadge
                                                status={
                                                    agency?.onboarding ?? ""
                                                }
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-text font-medium">
                                            {agency?.listings}
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-text font-medium">
                                            {agency?.agents}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <FeedStatusBadge
                                                status={agency?.feed ?? ""}
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-text font-medium">
                                            {agency?.mrr}
                                        </td>
                                        <td className="py-2.5 px-3 text-left text-muted font-medium">
                                            {agency?.lastActivity}
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-3 relative">
                                                <Link
                                                    href={`/agencies/${agency?.id}`}
                                                    className="text-accent hover:underline font-medium"
                                                >
                                                    View
                                                </Link>

                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            onToggleMenu(
                                                                agency?.id ??
                                                                    "",
                                                            )
                                                        }
                                                        className="text-muted hover:text-text p-1 rounded transition-colors focus:outline-none cursor-pointer"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    {openMenuId ===
                                                        agency?.id && (
                                                        <div
                                                            className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded shadow-lg z-10 py-1 overflow-hidden"
                                                            onMouseLeave={
                                                                onCloseMenu
                                                            }
                                                        >
                                                            <Link
                                                                href={`/agencies/${agency?.id}`}
                                                                className="block px-4 py-2 text-[12px] text-text hover:bg-page"
                                                            >
                                                                View details
                                                            </Link>
                                                            <button className="w-full text-left px-4 py-2 text-[12px] text-text hover:bg-page cursor-pointer">
                                                                Edit
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-[12px] text-orange-600 hover:bg-orange-50 cursor-pointer">
                                                                Suspend
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 cursor-pointer">
                                                                Archive
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
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

export default AgenciesTable;
