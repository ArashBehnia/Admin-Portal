import { useState } from "react";
import { Agent, DrawerTab } from "@/actions/agentsActions";

interface UseAgentsProps {
    initialAgents: Agent[];
}

const useAgents = ({ initialAgents }: UseAgentsProps) => {
    // ─── Data State ───────────────────────────────────────────────────
    const [agents] = useState<Agent[]>(initialAgents);

    // ─── Search State ─────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");

    // ─── Drawer State ─────────────────────────────────────────────────
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [activeDrawerTab, setActiveDrawerTab] =
        useState<DrawerTab>("profile");

    // ─── Derived / Computed ───────────────────────────────────────────
    const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

    const filteredAgents = agents.filter((agent) => {
        const query = searchQuery.toLowerCase();
        return (
            agent.name.toLowerCase().includes(query) ||
            agent.email.toLowerCase().includes(query) ||
            agent.agency.toLowerCase().includes(query) ||
            agent.licence.toLowerCase().includes(query)
        );
    });

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
        filteredAgents,
        selectedAgent,

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

export default useAgents;
