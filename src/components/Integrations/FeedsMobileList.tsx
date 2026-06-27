"use client";

import { RefreshCw } from "lucide-react";
import { Feed } from "@/types/integrationTypes";
import { StatusBadge, MethodBadge, OnboardingBadge } from "@/components/Integrations/StatusBadge";

interface FeedsMobileListProps {
    paginatedFeeds: Feed[];
    isLoading?: boolean;
    onViewDetails: (feed: Feed) => void;
}

const FeedsMobileList = ({
    paginatedFeeds,
    isLoading,
    onViewDetails,
}: FeedsMobileListProps) => {
    if (isLoading)
        return (
            <div className="flex md:hidden flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card rounded border border-border shadow-sm p-3 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="h-4 bg-border/60 rounded animate-pulse w-32" />
                            <div className="h-5 bg-border/60 rounded animate-pulse w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 bg-border/60 rounded animate-pulse w-16" />
                            <div className="h-5 bg-border/60 rounded animate-pulse w-14" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                                <div className="h-2 bg-border/60 rounded animate-pulse w-12" />
                                <div className="h-3 bg-border/60 rounded animate-pulse w-16" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="h-2 bg-border/60 rounded animate-pulse w-16" />
                                <div className="h-3 bg-border/60 rounded animate-pulse w-8" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="h-2 bg-border/60 rounded animate-pulse w-14" />
                                <div className="h-3 bg-border/60 rounded animate-pulse w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );

    if (paginatedFeeds.length === 0)
        return (
            <div className="flex md:hidden py-10 text-center text-muted text-[13px] justify-center">
                No feeds found.
            </div>
        );

    return (
        <div className="flex md:hidden flex-col gap-2">
            {paginatedFeeds.map((feed) => (
                <div
                    key={feed?.id}
                    className={`bg-card rounded border border-border shadow-sm p-3 flex flex-col gap-2 ${
                        feed?.status === "Failing"
                            ? "border-l-[3px] border-l-red-500"
                            : ""
                    }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-text text-[13px] leading-snug">
                            {feed?.agencyName}
                        </span>
                        <StatusBadge status={feed?.status ?? ""} />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted text-[12px]">
                            {feed?.crm}
                        </span>
                        <MethodBadge method={feed?.method ?? ""} />
                        <OnboardingBadge value={feed?.onboarding ?? ""} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[12px]">
                        <div>
                            <p className="text-muted text-[11px]">Last sync</p>
                            <p className="text-text truncate">
                                {feed?.lastSync}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted text-[11px]">
                                Listings (24h)
                            </p>
                            <p className="text-text">
                                {feed?.listings24h === 0
                                    ? "0"
                                    : (feed?.listings24h ?? "—")}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted text-[11px]">
                                Errors (24h)
                            </p>
                            <div className="flex items-center gap-1">
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
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-border/60">
                        <span className="text-muted text-[12px]">
                            {feed?.distribution ?? "—"}
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onViewDetails(feed)}
                                className="text-accent hover:underline font-medium text-[12px] cursor-pointer"
                            >
                                View details
                            </button>
                            {feed?.status === "Pending setup" ? (
                                <button
                                    disabled
                                    className="text-muted/50 font-medium text-[12px] cursor-not-allowed"
                                >
                                    Send setup
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="text-muted/50 flex items-center gap-1 font-medium text-[12px] cursor-not-allowed"
                                >
                                    <RefreshCw className="w-3 h-3" /> Retry sync
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedsMobileList;
