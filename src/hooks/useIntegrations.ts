import { useState, useEffect, useCallback, useRef } from "react";
import {
    Feed,
    FeedStats,
    IntegrationsData,
    StatusFilter,
} from "@/types/integrationTypes";
import api from "@/lib/axios";

interface UseIntegrationsProps {
    initialData: IntegrationsData;
}

type ApiSummary = {
    totalAgencies: number;
    connected: number;
    feedErrors24h: number;
    syncingFeeds: number;
};

type ApiListItem = {
    agencyId: string;
    agencyName: string;
    agencyStatus?: string;
    crmType?: string;
    webhookUrl?: string;
    connectionStatus: string;
    totalFeeds: number;
    errorFeeds: number;
    lastSyncAt?: string;
};

type ApiPage = {
    data: ApiListItem[];
    total: number;
    offset: number;
    limit: number;
};

function inferMethod(crmType?: string, webhookUrl?: string): Feed["method"] {
    const url = webhookUrl?.toLowerCase() ?? "";
    if (url.includes("ftp") || url.includes("sftp")) return "FTP";
    if (crmType?.toLowerCase() === "homeby internal") return "Internal";
    return "API";
}

function mapConnectionStatus(status: string): Feed["status"] {
    const s = status.toLowerCase();
    if (s === "healthy") return "Healthy";
    if (s === "failing" || s === "error") return "Failing";
    if (s === "warning" || s === "stale") return "Warning";
    if (s === "pending" || s === "pending_setup" || s === "not configured")
        return "Pending setup";
    return "Healthy";
}

function formatLastSync(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

function mapAgencyStatus(status?: string): string {
    if (!status) return "Live";
    const s = status.toLowerCase();
    if (s === "active" || s === "live") return "Live";
    if (s === "onboarding") return "CRM Connected";
    if (s === "approved") return "Approved";
    if (s === "trial") return "Approved";
    return status;
}

function mapPageData(
    summary: ApiSummary,
    page: ApiPage,
): IntegrationsData {
    const stats: FeedStats = {
        total: summary.totalAgencies,
        healthy: summary.connected,
        warning: Math.max(
            0,
            summary.totalAgencies - summary.connected - summary.feedErrors24h,
        ),
        failing: summary.feedErrors24h,
    };

    const feeds: Feed[] = page.data.map((item) => ({
        id: item.agencyId,
        agencyName: item.agencyName,
        crm: item.crmType ?? "—",
        method: inferMethod(item.crmType, item.webhookUrl),
        status: mapConnectionStatus(item.connectionStatus),
        lastSync: formatLastSync(item.lastSyncAt),
        listings24h: item.totalFeeds,
        errors24h: item.errorFeeds,
        distribution: "—",
        onboarding: mapAgencyStatus(item.agencyStatus),
    }));

    return { stats, feeds, total: page.total };
}

const useIntegrations = ({ initialData }: UseIntegrationsProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const [stats, setStats] = useState<FeedStats>(
        initialData?.stats ?? { total: 0, healthy: 0, warning: 0, failing: 0 },
    );
    const [feeds, setFeeds] = useState<Feed[]>(initialData?.feeds ?? []);
    const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // ─── Tab & UI State ───────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"inbound" | "distribution">(
        "inbound",
    );
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);

    // ─── Filter & Pagination State ────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;
    const [filterStatus, setFilterStatus] = useState<StatusFilter>("All");
    const filterStatusRef = useRef(filterStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;

    // ─── Client-side fetch via axios ──────────────────────────────────
    const loadPage = useCallback(
        async (page: number, keywords?: string, status?: string) => {
            setIsLoading(true);
            try {
                const offset = (page - 1) * pageSizeRef.current;
                const params = new URLSearchParams({
                    offset: String(offset),
                    limit: String(pageSizeRef.current),
                });
                if (keywords) params.set("keywords", keywords);
                if (status && status !== "All") params.set("status", status);

                const [summaryRes, pageRes] = await Promise.all([
                    api.get("/api/integrations/summary"),
                    api.get(`/api/integrations/page?${params.toString()}`),
                ]);

                // Axios .data = JSON body from API route
                const summary: ApiSummary =
                    summaryRes.data?.data ?? summaryRes.data;
                // Page route returns { data: [...], total, offset, limit }
                const pageData: ApiPage = pageRes.data;
                const result = mapPageData(summary, pageData);

                // Use summary stats for total count (page API total is unreliable)
                let filteredTotal = summary.totalAgencies;
                const s = (status ?? "All").toLowerCase();
                if (s === "healthy") filteredTotal = summary.connected;
                else if (s === "failing") filteredTotal = summary.feedErrors24h;
                else if (s === "warning")
                    filteredTotal = Math.max(
                        0,
                        summary.totalAgencies - summary.connected - summary.feedErrors24h,
                    );

                setStats(result.stats);
                setFeeds(result.feeds);
                setTotalCount(filteredTotal);
            } catch (err) {
                console.error("Failed to load integrations:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    // ─── Search with debounce ─────────────────────────────────────────
    useEffect(() => {
        if (!searchQuery) {
            loadPage(1, undefined, filterStatusRef.current);
            return;
        }
        setIsSearching(true);
        const timer = setTimeout(() => {
            loadPage(1, searchQuery, filterStatusRef.current).finally(() => setIsSearching(false));
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, loadPage]);

    // ─── Derived / Computed ───────────────────────────────────────────
    const filteredFeeds = feeds;

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // ─── Effects ──────────────────────────────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
        loadPage(1, searchQueryRef.current, filterStatus);
    }, [filterStatus, loadPage]);

    useEffect(() => {
        setCurrentPage(1);
        loadPage(1, searchQuery || undefined, filterStatusRef.current);
    }, [pageSize, loadPage]);

    // ─── Page change ──────────────────────────────────────────────────
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            loadPage(page, searchQuery || undefined, filterStatusRef.current);
        },
        [loadPage, searchQuery],
    );

    // ─── Handlers ─────────────────────────────────────────────────────
    const openDetails = (feed: Feed) => setSelectedFeed(feed);
    const closeDetails = () => setSelectedFeed(null);

    return {
        // Data
        stats,
        filteredFeeds,
        paginatedFeeds: filteredFeeds,
        totalPages,
        totalCount,
        isLoading: isLoading || isSearching,

        // Tab
        activeTab,
        setActiveTab,

        // Modal
        isAddModalOpen,
        setIsAddModalOpen,

        // Details panel
        selectedFeed,
        openDetails,
        closeDetails,

        // Filters
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,

        // Pagination
        currentPage,
        pageSize,
        setPageSize,
        setCurrentPage: handlePageChange,
    };
};

export default useIntegrations;
