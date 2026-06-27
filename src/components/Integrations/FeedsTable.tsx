"use client";

import { RefreshCw } from "lucide-react";
import { Feed } from "@/types/integrationTypes";
import { StatusBadge, MethodBadge, OnboardingBadge } from "./StatusBadge";

interface FeedsTableProps {
    paginatedFeeds: Feed[];
    isLoading?: boolean;
    onViewDetails: (feed: Feed) => void;
}

const FeedsTable = ({
    paginatedFeeds,
    isLoading,
    onViewDetails,
}: FeedsTableProps) => {
    return (
        <div className="hidden md:block bg-card rounded border border-border shadow-sm w-full overflow-hidden">
            <table className="table-fixed w-full text-left text-[12px]">
                <colgroup>
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "19%" }} />
                </colgroup>
                <thead>
                    <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                        <th className="px-6 py-4">Agency</th>
                        <th className="px-6 py-4">CRM</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last sync</th>
                        <th className="px-6 py-4 text-center">Listings (24h)</th>
                        <th className="px-6 py-4 text-center">Errors (24h)</th>
                        <th className="px-6 py-4">Distrib.</th>
                        <th className="px-6 py-4">Onboarding</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {isLoading ? (
                        <>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i} className="border-b border-border/60 last:border-0">
                                    <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-28" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-16" /></td>
                                    <td className="px-6 py-4"><div className="h-5 bg-border/60 rounded animate-pulse w-14" /></td>
                                    <td className="px-6 py-4"><div className="h-5 bg-border/60 rounded animate-pulse w-16" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-20" /></td>
                                    <td className="px-6 py-4 text-center"><div className="h-4 bg-border/60 rounded animate-pulse w-8 mx-auto" /></td>
                                    <td className="px-6 py-4 text-center"><div className="h-4 bg-border/60 rounded animate-pulse w-8 mx-auto" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-border/60 rounded animate-pulse w-16" /></td>
                                    <td className="px-6 py-4"><div className="h-5 bg-border/60 rounded animate-pulse w-16" /></td>
                                    <td className="px-6 py-4 text-right"><div className="h-4 bg-border/60 rounded animate-pulse w-20 ml-auto" /></td>
                                </tr>
                            ))}
                        </>
                    ) : paginatedFeeds.length === 0 ? (
                        <tr>
                            <td
                                colSpan={10}
                                className="py-10 text-center text-muted"
                            >
                                No feeds found.
                            </td>
                        </tr>
                    ) : (
                        paginatedFeeds.map((feed) => (
                            <tr
                                key={feed?.id}
                                className={`border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors ${
                                    feed?.status === "Failing"
                                        ? "border-l-[3px] border-l-red-500"
                                        : ""
                                }`}
                            >
                                <td className="py-2.5 px-3 font-semibold text-text">
                                    <span
                                        className="block truncate"
                                        title={feed?.agencyName}
                                    >
                                        {feed?.agencyName}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2 text-muted">
                                    <span className="block truncate">
                                        {feed?.crm}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2">
                                    <MethodBadge method={feed?.method ?? ""} />
                                </td>
                                <td className="py-2.5 px-2">
                                    <StatusBadge status={feed?.status ?? ""} />
                                </td>
                                <td className="py-2.5 px-2 text-muted">
                                    <span className="block truncate">
                                        {feed?.lastSync}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-text">
                                    {feed?.listings24h === 0
                                        ? "0"
                                        : (feed?.listings24h ?? "—")}
                                </td>
                                <td className="py-2.5 px-2">
                                    <div className="flex items-center justify-center gap-1">
                                        {feed?.errors24h !== null && (
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${(feed?.errors24h ?? 0) > 0 ? "bg-red-500" : "bg-green-500"}`}
                                            />
                                        )}
                                        <span
                                            className={
                                                (feed?.errors24h ?? 0) > 0
                                                    ? "text-red-600 font-semibold"
                                                    : "text-text"
                                            }
                                        >
                                            {feed?.errors24h !== null
                                                ? feed?.errors24h
                                                : "—"}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2.5 px-2 text-text">
                                    <span className="block truncate">
                                        {feed?.distribution ?? "—"}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2">
                                    <OnboardingBadge
                                        value={feed?.onboarding ?? ""}
                                    />
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewDetails(feed)}
                                            className="text-accent hover:underline font-medium text-[11px] whitespace-nowrap cursor-pointer"
                                        >
                                            View details
                                        </button>
                                        {feed?.status === "Pending setup" ? (
                                            <button
                                                disabled
                                                className="text-muted/50 font-medium text-[11px] whitespace-nowrap cursor-not-allowed"
                                            >
                                                Send setup
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="text-muted/50 flex items-center gap-0.5 font-medium text-[11px] whitespace-nowrap cursor-not-allowed"
                                            >
                                                <RefreshCw className="w-2.5 h-2.5" />{" "}
                                                Retry sync
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FeedsTable;
