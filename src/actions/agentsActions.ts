import { fetchAgentsSummary, fetchAgentsPage } from "@/lib/agent-service";
import type { AgentListItemDto } from "@/types/agentTypes";

export type Activity = {
    event: string;
    time: string;
};

export type Agent = {
    id: string;
    name: string;
    email: string;
    phone: string;
    agency: string;
    role: string;
    licence: string;
    licenceStatus: string;
    joined: string;
    lastLogin: string;
    status: "Active" | "Inactive" | "Pending";
    activities: Activity[];
};

export type DrawerTab = "profile" | "activity" | "actions";

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

function formatDate(iso?: string): string {
    if (!iso) return "N/A";
    try {
        return new Date(iso).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}

function mapStatus(status?: string): "Active" | "Inactive" | "Pending" {
    if (!status) return "Active";
    const s = status.toLowerCase();
    if (s === "active" || s === "enabled" || s === "live") return "Active";
    if (s === "inactive" || s === "disabled") return "Inactive";
    if (s === "pending") return "Pending";
    return "Active";
}

function mapAgentFromDto(item: AgentListItemDto): Agent {
    const firstName = item.firstName ?? "";
    const lastName = item.lastName ?? "";
    const name = [firstName, lastName].filter(Boolean).join(" ") || item.email || "Unknown";

    return {
        id: String(item.id),
        name,
        email: item.email ?? "",
        phone: item.mobile ?? "",
        agency: item.agencyName ?? "",
        role: item.role ?? "Agent",
        licence: item.licence ?? "",
        licenceStatus: item.licenceStatus ?? "N/A",
        joined: formatDate(item.createdAt),
        lastLogin: formatRelativeTime(item.lastLoggedIn),
        status: mapStatus(item.status),
        activities: [],
    };
}

export const fetchAgents = async (
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<{ agents: Agent[]; total: number }> => {
    try {
        const { data, total } = await fetchAgentsPage(offset, limit, keywords);
        const agents = data.map(mapAgentFromDto);
        return { agents, total };
    } catch (error) {
        console.error("Failed to fetch agents:", error);
        return { agents: [], total: 0 };
    }
};

export const fetchAgentsSummaryData = async () => {
    try {
        return await fetchAgentsSummary();
    } catch (error) {
        console.error("Failed to fetch agents summary:", error);
        return { total: 0, active: 0, inactive: 0, ftp_enabled: 0, active_listings: 0 };
    }
};
