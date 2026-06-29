"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Agency,
    AgenciesData,
    AgencyFilter,
    AgencyStats,
    AgencyListItemDto,
} from "@/types/agencyTypes";
import api from "@/lib/axios";

interface UseAgenciesProps {
    initialData: AgenciesData;
}

type ApiPage = {
    content: AgencyListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

function formatLastActivity(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
}

function mapHighlight(status?: string): "orange" | "red" | null {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === "suspended") return "red";
    if (s === "warning" || s === "onboarding") return "orange";
    return null;
}

type ApiSummary = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    with_listings: number;
    suspended: number;
    onboarding: number;
    trial: number;
};

function mapPageData(
    summary: ApiSummary,
    page: ApiPage,
): AgenciesData {
    const stats: AgencyStats = {
        total: String(summary.total),
        active: String(summary.active),
        onboarding: String(summary.onboarding),
        suspended: String(summary.suspended),
        trial: String(summary.trial),
    };

    const items = Array.isArray(page.content) ? page.content : [];
    const agencies: Agency[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        location: [item.agencyAddress, item.state, item.postcode]
            .filter(Boolean)
            .join(", "),
        subscription: item.subscription?.label ?? "Trial",
        onboarding: item.onboardingLabel ?? item.onboardingStatus ?? "",
        listings: item.activeListings ?? item.totalListings ?? 0,
        agents: item.activeAgents ?? item.totalAgents ?? 0,
        feed: item.feed?.label ?? "Not configured",
        mrr: item.mrrLabel ?? "$0/mo",
        lastActivity: formatLastActivity(item.lastActivityAt),
        highlight: mapHighlight(item.status),
    }));

    return { stats, agencies, total: page.total };
}

const useAgencies = ({ initialData }: UseAgenciesProps) => {
    const [stats, setStats] = useState(initialData?.stats ?? {
        total: "0",
        active: "0",
        onboarding: "0",
        suspended: "0",
    });
    const [agencies, setAgencies] = useState<Agency[]>(
        initialData?.agencies ?? [],
    );
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;
    const [activeFilter, setActiveFilter] = useState<AgencyFilter>("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const loadPage = useCallback(
        async (page: number, keywords?: string, isSearch = false) => {
            if (isSearch) setIsSearching(true);
            else setIsLoading(true);
            try {
                const offset = (page - 1) * pageSizeRef.current;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(pageSizeRef.current),
                });
                if (keywords) params.set("keywords", keywords);

                const [summaryRes, pageRes] = await Promise.all([
                    api.get("/api/agencies/summary"),
                    api.get(`/api/agencies/page?${params.toString()}`),
                ]);

                const summary: ApiSummary =
                    summaryRes.data?.data ?? summaryRes.data;
                const rawPage: ApiPage = pageRes.data?.data ?? pageRes.data;
                const result = mapPageData(summary, rawPage);

                setStats(result.stats);
                setAgencies(result.agencies);
                setTotalCount(result.total);
            } catch (err) {
                console.error("Failed to load agencies:", err);
            } finally {
                if (isSearch) setIsSearching(false);
                else setIsLoading(false);
            }
        },
        [],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, searchQuery || undefined);
        },
        [loadPage, searchQuery],
    );

    useEffect(() => {
        setCurrentPage(1);
        const trimmed = searchQuery.trim();
        if (!trimmed) {
            loadPage(1);
            return;
        }
        const timer = setTimeout(() => {
            loadPage(1, trimmed, true);
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    useEffect(() => {
        setCurrentPage(1);
        loadPage(1, searchQueryRef.current || undefined);
    }, [pageSize, loadPage]);

    const filteredAgencies = agencies.filter((agency) => {
        const matchesFilter = (() => {
            if (activeFilter === "All") return true;
            if (activeFilter === "Active") return agency.onboarding === "Live";
            if (activeFilter === "Onboarding")
                return (
                    agency.onboarding !== "Live" &&
                    agency.subscription !== "Trial"
                );
            if (activeFilter === "Trial")
                return agency.subscription === "Trial";
            if (activeFilter === "Suspended")
                return agency.highlight === "red";
            if (activeFilter === "Pending")
                return agency.onboarding === "Pending";
            return true;
        })();
        return matchesFilter;
    });

    const toggleMenu = (id: string) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    const refreshPage = useCallback(() => {
        loadPage(currentPage, searchQuery || undefined);
    }, [loadPage, currentPage, searchQuery]);

    const closeMenu = () => setOpenMenuId(null);

    return {
        stats,
        filteredAgencies,
        totalCount,
        isLoading,
        isSearching,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        handlePageChange,
        isModalOpen,
        setIsModalOpen,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        openMenuId,
        toggleMenu,
        closeMenu,
        refreshPage,
    };
};

export default useAgencies;
