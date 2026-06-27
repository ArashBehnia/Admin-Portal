"use client";

import { RefreshCw } from "lucide-react";
import { Agent } from "@/types/agentTypes";
import useAgents from "@/hooks/useAgents"
import AgentsTable from "./AgentsTable";
import AgentDrawer from "./AgentDrawer";

interface AgentsPageClientProps {
    initialAgents: Agent[];
    initialTotal: number;
}

const AgentsPageClient = ({ initialAgents, initialTotal }: AgentsPageClientProps) => {
    const {
        agents,
        selectedAgent,
        totalCount,
        summary,
        isLoading,
        searchQuery,
        setSearchQuery,
        activeDrawerTab,
        setActiveDrawerTab,
        getInitials,
        getStatusClasses,
        openDrawer,
        closeDrawer,
    } = useAgents({ initialAgents, initialTotal });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-text leading-snug">Agents</h1>
                    <p className="text-[13px] text-muted mt-0.5">
                        Search and manage all agents across all agencies.
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors self-start shrink-0 cursor-pointer"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                    { label: "Total agents", value: summary.total, dot: null, warning: false },
                    { label: "Active", value: summary.active, dot: "bg-green-500", warning: false },
                    { label: "Inactive", value: summary.inactive, dot: "bg-red-500", warning: false },
                    { label: "FTP enabled", value: summary.ftp_enabled, dot: "bg-blue-500", warning: false },
                    { label: "Active listings", value: summary.active_listings, dot: "bg-accent", warning: false },
                ].map(({ label, value, dot, warning }) => (
                    <div
                        key={label}
                        className={`bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-1.5 ${
                            warning ? "border-l-[3px] border-l-red-500" : ""
                        }`}
                    >
                        <div className="flex items-center gap-1.5">
                            {dot && (
                                <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                            )}
                            <span className="text-[12px] text-muted">{label}</span>
                        </div>
                        <span className="text-[24px] font-bold text-text">{value}</span>
                    </div>
                ))}
            </div>

            <AgentsTable
                filteredAgents={agents}
                searchQuery={searchQuery}
                selectedAgentId={selectedAgent?.id}
                onSearchChange={setSearchQuery}
                onViewClick={openDrawer}
                getStatusClasses={getStatusClasses}
                isLoading={isLoading}
                totalCount={totalCount}
            />

            {selectedAgent && (
                <AgentDrawer
                    selectedAgent={selectedAgent}
                    activeDrawerTab={activeDrawerTab}
                    onTabChange={setActiveDrawerTab}
                    onClose={closeDrawer}
                    getInitials={getInitials}
                    getStatusClasses={getStatusClasses}
                />
            )}
        </div>
    );
};

export default AgentsPageClient;
