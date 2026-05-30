import { useState, useEffect } from "react";
import {
    Feed,
    FeedStats,
    IntegrationsData,
    StatusFilter,
    ROWS_PER_PAGE,
} from "@/actions/integrationsActions";

interface UseIntegrationsProps {
    initialData: IntegrationsData;
}

const useIntegrations = ({ initialData }: UseIntegrationsProps) => {
    // ─── Data ─────────────────────────────────────────────────────────
    const stats: FeedStats = initialData?.stats ?? {
        total: 0,
        healthy: 0,
        warning: 0,
        failing: 0,
    };
    const feeds: Feed[] = initialData?.feeds ?? [];

    // ─── Tab & UI State ───────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"inbound" | "distribution">(
        "inbound",
    );
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);

    // ─── Filter & Pagination State ────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<StatusFilter>("All");
    const [currentPage, setCurrentPage] = useState(1);

    // ─── Derived / Computed ───────────────────────────────────────────
    const filteredFeeds = feeds.filter((feed) => {
        const matchesSearch =
            feed?.agencyName
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            feed?.crm?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "All" || feed?.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredFeeds.length / ROWS_PER_PAGE),
    );

    const paginatedFeeds = filteredFeeds.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE,
    );

    // ─── Effects ──────────────────────────────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    // ─── Handlers ─────────────────────────────────────────────────────
    const openDetails = (feed: Feed) => setSelectedFeed(feed);
    const closeDetails = () => setSelectedFeed(null);

    return {
        // Data
        stats,
        filteredFeeds,
        paginatedFeeds,
        totalPages,

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
        setCurrentPage,
    };
};

export default useIntegrations;
