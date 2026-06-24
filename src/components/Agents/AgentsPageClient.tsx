"use client";

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
        <div className="w-full max-w-content mx-auto">
            <div className="my-6">
                <h1 className="text-2xl font-bold text-text">Agents</h1>
                <p className="text-sm text-muted">
                    Search and manage all agents across all agencies.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
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
