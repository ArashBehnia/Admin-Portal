"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Agency,
    AgenciesData,
    AgencyFilter,
    ROWS_PER_PAGE,
} from "@/types/agencyTypes";
import api from "@/lib/axios";

interface UseAgenciesProps {
    initialData: AgenciesData;
}

type ApiAgencyItem = {
    id: string;
    name: string;
    status?: string;
    email?: string;
    phone?: string;
    website?: string;
    totalStaff?: number;
    activeStaff?: number;
    totalListings?: number;
    activeListings?: number;
    sales12m?: number;
    lastActivityAt?: string;
    subscription?: string;
    feedStatus?: string;
    mrr?: string;
    location?: string;
};

type ApiSummary = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    with_listings: number;
};

type ApiPage = {
    data: ApiAgencyItem[];
    total: number;
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

function mapStatus(status?: string): string {
    if (!status) return "Approved";
    const s = status.toLowerCase();
    if (s === "active" || s === "live") return "Live";
    if (s === "trial") return "Trial";
    if (s === "onboarding") return "Onboarding";
    if (s === "suspended") return "Suspended";
    if (s === "pending") return "Pending";
    return status;
}

function mapHighlight(status?: string): "orange" | "red" | null {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === "suspended") return "red";
    if (s === "warning" || s === "onboarding") return "orange";
    return null;
}

function mapPageData(
    summary: ApiSummary,
    page: ApiPage,
): AgenciesData {
    const stats = {
        total: String(summary.total),
        active: String(summary.active),
        onboarding: String(summary.pending),
        suspended: String(summary.inactive),
    };

    const items = Array.isArray(page.data) ? page.data : [];
    const agencies: Agency[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        location: item.location ?? "",
        subscription: item.subscription ?? "Trial",
        onboarding: mapStatus(item.status),
        listings: item.totalListings ?? 0,
        agents: item.activeStaff ?? item.totalStaff ?? 0,
        feed: item.feedStatus ?? "Not configured",
        mrr: item.mrr ?? "$0/mo",
        lastActivity: formatLastActivity(item.lastActivityAt),
        highlight: mapHighlight(item.status),
    }));

    return { stats, agencies, total: page.total };
}

const useAgencies = ({ initialData }: UseAgenciesProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
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

    // ─── Pagination State ────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));

    // ─── UI State ─────────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<AgencyFilter>("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (page: number, keywords?: string) => {
            setIsLoading(true);
            try {
                const offset = (page - 1) * ROWS_PER_PAGE;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(ROWS_PER_PAGE),
                });
                if (keywords) params.set("keywords", keywords);

                const [summaryRes, pageRes] = await Promise.all([
                    api.get("/api/agencies/summary"),
                    api.get(`/api/agencies/page?${params.toString()}`),
                ]);

                const summary: ApiSummary =
                    summaryRes.data?.data ?? summaryRes.data;
                const rawPage = pageRes.data?.data ?? pageRes.data;
                const pageData: ApiPage = {
                    data: Array.isArray(rawPage?.data)
                        ? rawPage.data
                        : Array.isArray(rawPage)
                          ? rawPage
                          : [],
                    total: rawPage?.total ?? 0,
                };
                const result = mapPageData(summary, pageData);

                setStats(result.stats);
                setAgencies(result.agencies);
                setTotalCount(result.total);
            } catch (err) {
                console.error("Failed to load agencies:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // ─── Page change handler ─────────────────────────────────────────
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, searchQuery || undefined);
        },
        [loadPage, searchQuery],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
        if (!searchQuery) {
            loadPage(1);
            return;
        }
        setIsSearching(true);
        const timer = setTimeout(() => {
            loadPage(1, searchQuery).finally(() => setIsSearching(false));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // ─── Derived / Computed (client-side status filter) ───────────────
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

    // ─── Handlers ─────────────────────────────────────────────────────
    const toggleMenu = (id: string) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    const closeMenu = () => setOpenMenuId(null);

    return {
        // Data
        stats,
        filteredAgencies,
        totalCount,
        isLoading: isLoading || isSearching,

        // Pagination
        currentPage,
        totalPages,
        handlePageChange,

        // UI State
        isModalOpen,
        setIsModalOpen,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        openMenuId,

        // Handlers
        toggleMenu,
        closeMenu,
    };
};

export default useAgencies;
