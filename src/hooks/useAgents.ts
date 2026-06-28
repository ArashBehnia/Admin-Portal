"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Agent, DrawerTab } from "@/types/agentTypes";
import api from "@/lib/axios";

interface UseAgentsProps {
    initialAgents: Agent[];
    initialTotal: number;
}

interface AgentSummary {
    total: number;
    active: number;
    inactive: number;
    ftp_enabled: number;
    active_listings: number;
}

const useAgents = ({ initialAgents, initialTotal }: UseAgentsProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [agents, setAgents] = useState<Agent[]>(initialAgents);
    const [totalCount, setTotalCount] = useState(initialTotal);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [summary, setSummary] = useState<AgentSummary>({
        total: initialTotal,
        active: 0,
        inactive: 0,
        ftp_enabled: 0,
        active_listings: 0,
    });

    // ─── Pagination State ─────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // ─── Search State ─────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Drawer State ─────────────────────────────────────────────────
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("profile");

    // ─── Derived / Computed ───────────────────────────────────────────
    const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

    // ─── Fetch summary on mount ───────────────────────────────────────
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get("/api/agents/summary");
                const data = res.data;
                setSummary({
                    total: data?.total ?? initialTotal,
                    active: data?.active ?? 0,
                    inactive: data?.inactive ?? 0,
                    ftp_enabled: data?.ftp_enabled ?? 0,
                    active_listings: data?.active_listings ?? 0,
                });
            } catch (err) {
                console.error("Failed to load agents summary:", err);
            }
        };
        fetchSummary();
    }, [initialTotal]);

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (page?: number, keywords?: string) => {
            setIsLoading(true);
            try {
                const p = page ?? 1;
                const offset = (p - 1) * pageSizeRef.current;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(pageSizeRef.current),
                });
                if (keywords) params.set("keywords", keywords);

                const res = await api.get(`/api/agents/page?${params.toString()}`);
                const pageData = res.data;

                const items: Agent[] = (pageData.data ?? []).map(
                    (item: Record<string, unknown>) => ({
                        id: String(item.id ?? ""),
                        name: [item.firstName, item.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                            String(item.email ?? "Unknown"),
                        email: String(item.email ?? ""),
                        phone: String(item.mobile ?? ""),
                        agency: String(item.agencyName ?? ""),
                        role: String(item.role ?? "Agent"),
                        licence: String(item.licence ?? ""),
                        licenceStatus: String(item.licenceStatus ?? "N/A"),
                        joined: item.createdAt
                            ? new Date(String(item.createdAt)).toLocaleDateString("en-AU", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })
                            : "N/A",
                        lastLogin: formatRelativeTime(
                            item.lastLoggedIn as string | undefined,
                        ),
                        status: mapStatus(item.status as string | undefined),
                        activities: [],
                    }),
                );

                setAgents(items);
                setTotalCount(pageData.total ?? 0);
            } catch (err) {
                console.error("Failed to load agents:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // ─── Page change handler ──────────────────────────────────────────
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        loadPage(page, searchQueryRef.current);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [loadPage]);

    // ─── Search with debounce ─────────────────────────────────────────
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;

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

    useEffect(() => {
        setCurrentPage(1);
        loadPage(1, searchQueryRef.current);
    }, [pageSize, loadPage]);

    // ─── Helpers ──────────────────────────────────────────────────────
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    const getStatusClasses = (status: Agent["status"]) => {
        switch (status) {
            case "Active":
                return "bg-success/10 text-success";
            case "Inactive":
                return "bg-page text-muted";
            case "Pending":
                return "bg-warning/10 text-warning";
        }
    };

    // ─── Handlers ─────────────────────────────────────────────────────
    const openDrawer = (agentId: string) => {
        setSelectedAgentId(agentId);
        setActiveDrawerTab("profile");
    };

    const closeDrawer = () => {
        setSelectedAgentId(null);
    };

    return {
        // Data
        agents,
        selectedAgent,
        totalCount,
        summary,
        isLoading: isLoading || isSearching,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        handlePageChange,

        // Search
        searchQuery,
        setSearchQuery,

        // Drawer
        activeDrawerTab,
        setActiveDrawerTab,

        // Helpers
        getInitials,
        getStatusClasses,

        // Handlers
        openDrawer,
        closeDrawer,
    };
};

function formatRelativeTime(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

function mapStatus(status?: string): "Active" | "Inactive" | "Pending" {
    if (!status) return "Active";
    const s = status.toLowerCase();
    if (s === "active" || s === "enabled" || s === "live") return "Active";
    if (s === "inactive" || s === "disabled") return "Inactive";
    if (s === "pending") return "Pending";
    return "Active";
}

export default useAgents;
