"use client";

import { useState, useEffect, useCallback } from "react";
import { Agent, DrawerTab } from "@/types/agentTypes";
import api from "@/lib/axios";

interface UseAgentsProps {
    initialAgents: Agent[];
    initialTotal: number;
}

const ROWS_PER_PAGE = 20;

const useAgents = ({ initialAgents, initialTotal }: UseAgentsProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [agents, setAgents] = useState<Agent[]>(initialAgents);
    const [totalCount, setTotalCount] = useState(initialTotal);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // ─── Search State ─────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Drawer State ─────────────────────────────────────────────────
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("profile");

    // ─── Derived / Computed ───────────────────────────────────────────
    const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (keywords?: string) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    offset: "0",
                    limit: String(ROWS_PER_PAGE),
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

    // ─── Search with debounce ─────────────────────────────────────────
    useEffect(() => {
        if (!searchQuery) {
            loadPage();
            return;
        }
        setIsSearching(true);
        const timer = setTimeout(() => {
            loadPage(searchQuery).finally(() => setIsSearching(false));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

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
        isLoading: isLoading || isSearching,

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
