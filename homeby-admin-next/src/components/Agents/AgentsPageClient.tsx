"use client";

import { Agent } from "@/actions/agentsActions";
import useAgents from "@/hooks/useAgents"
import AgentsTable from "./AgentsTable";
import AgentDrawer from "./AgentDrawer";

interface AgentsPageClientProps {
    initialAgents: Agent[];
}

const AgentsPageClient = ({ initialAgents }: AgentsPageClientProps) => {
    const {
        filteredAgents,
        selectedAgent,
        searchQuery,
        setSearchQuery,
        activeDrawerTab,
        setActiveDrawerTab,
        getInitials,
        getStatusClasses,
        openDrawer,
        closeDrawer,
    } = useAgents({ initialAgents });

    return (
        <div className="w-full max-w-content mx-auto">
            <div className="my-6">
                <h1 className="text-2xl font-bold text-text">Agents</h1>
                <p className="text-sm text-muted">
                    Search and manage all agents across all agencies.
                </p>
            </div>

            <AgentsTable
                filteredAgents={filteredAgents}
                searchQuery={searchQuery}
                selectedAgentId={selectedAgent?.id}
                onSearchChange={setSearchQuery}
                onViewClick={openDrawer}
                getStatusClasses={getStatusClasses}
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
