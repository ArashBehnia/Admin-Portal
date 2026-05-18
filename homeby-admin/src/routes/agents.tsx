import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, X, Loader2 } from "lucide-react";

type Activity = {
    event: string;
    time: string;
};

type Agent = {
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

const RouteComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "activity" | "actions">("profile");

    // Fetch agents data using Axios & React Query
    const { data: agents = [], isLoading, isError } = useQuery<Agent[]>({
        queryKey: ["agentsData"],
        queryFn: async () => {
            const response = await axios.get("/data/agents.json");
            return response.data;
        },
    });

    const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

    // Filter agents based on search query
    const filteredAgents = agents.filter((agent) => {
        const query = searchQuery.toLowerCase();
        return (
            agent.name.toLowerCase().includes(query) ||
            agent.email.toLowerCase().includes(query) ||
            agent.agency.toLowerCase().includes(query) ||
            agent.licence.toLowerCase().includes(query)
        );
    });

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="max-w-content mx-auto">
            {/* Header */}
            <div className="my-6">
                <h1 className="text-2xl font-bold text-text">Agents</h1>
                <p className="text-sm text-muted">
                    Search and manage all agents across all agencies.
                </p>
            </div>

            {/* Search Input Card */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                <input
                    type="text"
                    placeholder="Search by name, email, licence number or agency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                />
            </div>
            <p className="text-xs text-muted my-6">
                Showing all agents. Use search to filter by name, email, licence or agency.
            </p>

            {/* Error State */}
            {isError && (
                <div className="bg-red-50 border border-red-200 text-danger rounded-lg p-4 text-sm text-center">
                    Failed to fetch agents data. Please refresh and try again.
                </div>
            )}

            {/* Table & List Card */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="h-8 w-8 text-accent animate-spin" />
                        <span className="text-sm text-muted">Loading directory...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-page/50 text-[13px] text-muted font-semibold">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Agency</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Role</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Last login</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredAgents.length > 0 ? (
                                    filteredAgents.map((agent) => (
                                        <tr
                                            key={agent.id}
                                            className="hover:bg-page/40 transition-colors text-sm text-text"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-text">
                                                    {agent.name}
                                                </div>
                                                <div className="text-xs text-muted">
                                                    {agent.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-muted font-medium">
                                                {agent.agency}
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="px-2.5 py-0.5 bg-page border border-border rounded text-xs font-semibold text-muted">
                                                    {agent.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell text-muted">
                                                {agent.lastLogin}
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${agent.status === "Active"
                                                        ? "bg-success/10 text-success "
                                                        : agent.status === "Inactive"
                                                            ? "bg-page text-muted"
                                                            : "bg-warning/10 text-warning"
                                                        }`}
                                                >
                                                    {agent.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAgentId(agent.id);
                                                        setActiveTab("profile");
                                                    }}
                                                    className="text-accent hover:underline text-sm font-semibold transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted">
                                            No agents match your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Side Drawer Detail Panel */}
            {selectedAgent && (
                <>
                    {/* Backdrop Overlay */}
                    <div
                        className="fixed inset-0 bg-[#0F1115]/40 backdrop-blur-[2px] z-[99] transition-opacity animate-fade-in"
                        onClick={() => setSelectedAgentId(null)}
                    />

                    {/* Drawer container */}
                    <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-card border-l border-border shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out animate-slide-left">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-border/80 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#0F1115]/5 text-text flex items-center justify-center font-bold text-base border border-border/70">
                                    {getInitials(selectedAgent.name)}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-bold text-lg text-text leading-tight">
                                        {selectedAgent.name}
                                    </h2>
                                    <p className="text-sm text-muted font-medium">
                                        {selectedAgent.agency}
                                    </p>
                                    <div className="flex items-center gap-2 pt-0.5">
                                        <span className="hidden md:inline-block px-2 py-0.5 bg-page border border-border rounded text-[11px] font-semibold text-muted">
                                            {selectedAgent.role}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${selectedAgent.status === "Active"
                                                ? "bg-success/10 text-success"
                                                : selectedAgent.status === "Inactive"
                                                    ? "bg-page text-muted"
                                                    : "bg-warning/10 text-warning"
                                                }`}
                                        >
                                            {selectedAgent.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAgentId(null)}
                                className="p-1 text-muted hover:bg-page rounded-md transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex px-6 border-b border-border/70 bg-page/10">
                            {(["profile", "activity", "actions"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize mr-6 relative -mb-[2px] ${activeTab === tab
                                        ? "border-accent text-accent font-semibold"
                                        : "border-transparent text-muted hover:text-text"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div className="space-y-4 text-sm">
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Email</span>
                                        <span className="w-2/3 text-text font-medium break-all select-all">
                                            {selectedAgent.email}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Phone</span>
                                        <span className="w-2/3 text-text font-medium">
                                            {selectedAgent.phone}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Agency</span>
                                        <span className="w-2/3 text-accent font-semibold hover:underline cursor-pointer">
                                            {selectedAgent.agency}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Role</span>
                                        <span className="w-2/3 text-text font-medium">
                                            {selectedAgent.role}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Licence</span>
                                        <span className="w-2/3 text-text font-medium select-all">
                                            {selectedAgent.licence}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Licence status</span>
                                        <span className="w-2/3 flex items-center">
                                            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-semibold">
                                                {selectedAgent.licenceStatus}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Joined</span>
                                        <span className="w-2/3 text-text font-medium">
                                            {selectedAgent.joined}
                                        </span>
                                    </div>
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">Last login</span>
                                        <span className="w-2/3 text-text font-medium">
                                            {selectedAgent.lastLogin}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === "activity" && (
                                <div className="relative pl-6 border-l-2 border-border/70 space-y-8 py-2">
                                    {selectedAgent.activities.map((act, index) => {
                                        const isRating = act.event.includes("★");
                                        return (
                                            <div key={index} className="relative">
                                                {/* Outer timeline indicator */}
                                                <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-card shadow-sm" />

                                                <div className="space-y-1">
                                                    <p className={`font-semibold text-sm ${isRating ? "text-amber-650" : "text-text"}`}>
                                                        {isRating ? (
                                                            <span className="flex items-center gap-1">
                                                                Review received
                                                                <span className="inline-flex items-center text-amber-500 font-bold tracking-tight">
                                                                    (★★★★★)
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            act.event
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted">
                                                        {act.time}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Actions Tab */}
                            {activeTab === "actions" && (
                                <div className="space-y-3">
                                    <button className="w-full py-2.5 px-4  text-text font-medium rounded-md text-sm transition-all text-left">
                                        Reset password
                                    </button>
                                    <div className="h-[1px] w-full bg-border" />
                                    <button className="w-full py-2.5 px-4  text-text font-medium rounded-md text-sm transition-all text-left">
                                        Change role
                                    </button>
                                    <div className="h-[1px] w-full bg-border" />
                                    <button className="w-full py-2.5 px-4  text-text font-medium rounded-md text-sm transition-all text-left">
                                        Transfer to another agency
                                    </button>
                                    <div className="h-[1px] w-full bg-border" />
                                    <button className="w-full py-2.5 px-4 text-danger font-semibold rounded-md text-sm transition-all text-left">
                                        Deactivate account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const Route = createFileRoute("/agents")({
    component: RouteComponent,
});
