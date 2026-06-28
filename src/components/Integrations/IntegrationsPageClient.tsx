"use client";

import { Plus, Search, RefreshCw } from "lucide-react";
import { IntegrationsData, STATUS_FILTERS, StatusFilter } from "@/types/integrationTypes";
import useIntegrations from "@/hooks/useIntegrations";
import FeedStats from "./FeedStats";
import FeedsTable from "./FeedsTable";
import FeedsMobileList from "./FeedsMobileList";
import FeedsPagination from "./FeedsPagination";
import DistributionTab from "./DistributionTab";
import IntegrationDetailsPanel from "./IntegrationDetailsPanel";
import AddIntegrationModal from "./AddIntegrationModal";

interface IntegrationsPageClientProps {
    initialData: IntegrationsData;
}

const IntegrationsPageClient = ({
    initialData,
}: IntegrationsPageClientProps) => {
    const {
        stats,
        filteredFeeds,
        paginatedFeeds,
        totalPages,
        totalCount,
        isLoading,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        selectedFeed,
        openDetails,
        closeDetails,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        currentPage,
        pageSize,
        setPageSize,
        setCurrentPage,
    } = useIntegrations({ initialData });

    return (
        <div className="w-full max-w-content mx-auto flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Integrations &amp; Feed Operations
                    </h1>
                    <p className="text-muted text-[12px] sm:text-[13px] mt-0.5 leading-relaxed">
                        Monitor agency CRM connections, inbound feed health, and
                        outbound listing distribution. Read-only — feed setup is
                        managed by agencies through the portal.
                    </p>
                </div>
                <div className="self-start sm:shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        Coming soon
                    </span>
                    <button
                        disabled
                        className="bg-accent/50 text-white/70 px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 whitespace-nowrap cursor-not-allowed"
                    >
                        <Plus className="w-3.5 h-3.5" />+ Add integration
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="border-b border-border">
                <div className="flex gap-5">
                    {(["inbound", "distribution"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => tab === "inbound" && setActiveTab(tab)}
                            className={`pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                                tab === "distribution"
                                    ? "border-transparent text-muted/50 cursor-not-allowed"
                                    : activeTab === tab
                                      ? "border-accent text-accent cursor-pointer"
                                      : "border-transparent text-muted hover:text-text cursor-pointer"
                            }`}
                        >
                            {tab === "inbound"
                                ? "Inbound feeds"
                                : "Distribution"}
                            {tab === "distribution" && (
                                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                    Coming soon
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inbound Tab */}
            {activeTab === "inbound" && (
                <>
                    <FeedStats stats={stats} />

                    <p className="text-muted text-[11px] sm:text-[12px] -mt-1">
                        Includes 1 HomeBy Internal connection (no external feed
                        required)
                    </p>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div className="relative w-full sm:w-[240px]">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                placeholder="Search agency or CRM provider..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 border border-border rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted bg-card text-text"
                            />
                        </div>
                        <div className="flex items-center overflow-x-auto border-b border-border pb-0 [&::-webkit-scrollbar]:hidden sm:overflow-visible">
                            {STATUS_FILTERS.map((status) => (
                                <button
                                    key={status}
                                    onClick={() =>
                                        setFilterStatus(status as StatusFilter)
                                    }
                                    className={`px-3 py-1.5 text-[12px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                        filterStatus === status
                                            ? "border-text text-text"
                                            : "border-transparent text-muted hover:text-text"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <FeedsTable
                        paginatedFeeds={paginatedFeeds}
                        isLoading={isLoading}
                        onViewDetails={openDetails}
                    />
                    <FeedsMobileList
                        paginatedFeeds={paginatedFeeds}
                        isLoading={isLoading}
                        onViewDetails={openDetails}
                    />

                    {totalCount > 0 && (
                        <FeedsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            rowsPerPage={pageSize}
                            onPageChange={setCurrentPage}
                            onRowsPerPageChange={setPageSize}
                        />
                    )}
                </>
            )}

            {activeTab === "distribution" && <DistributionTab />}

            <AddIntegrationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <IntegrationDetailsPanel
                feed={selectedFeed}
                onClose={closeDetails}
            />
        </div>
    );
};

export default IntegrationsPageClient;
