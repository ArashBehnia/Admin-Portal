"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { Agent, DrawerTab } from "@/types/agentTypes";
import api from "@/lib/axios";

interface AgentOverview {
    email?: string;
    mobile?: string;
    role?: string;
    agencyName?: string;
    isActive: boolean;
    totalListings: number;
    activeListings: number;
    sales12m: number;
    performanceValue: number;
    totalViews: number;
}

interface AgentActivityItem {
    type: string;
    entityId: string;
    label?: string;
    createdAt?: string;
}

interface AgentDrawerProps {
    selectedAgent: Agent;
    activeDrawerTab: DrawerTab;
    onTabChange: (tab: DrawerTab) => void;
    onClose: () => void;
    getInitials: (name: string) => string;
    getStatusClasses: (status: Agent["status"]) => string;
}

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

const AgentDrawer = ({
    selectedAgent,
    activeDrawerTab,
    onTabChange,
    onClose,
    getInitials,
    getStatusClasses,
}: AgentDrawerProps) => {
    const [overview, setOverview] = useState<AgentOverview | null>(null);
    const [activities, setActivities] = useState<AgentActivityItem[]>([]);
    const [loadingOverview, setLoadingOverview] = useState(false);
    const [loadingActivity, setLoadingActivity] = useState(false);
    const fetchedOverviewRef = useRef<string | null>(null);
    const fetchedActivityRef = useRef<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadOverview() {
            if (activeDrawerTab !== "profile" || overview || fetchedOverviewRef.current === selectedAgent.id) return;
            fetchedOverviewRef.current = selectedAgent.id;
            setLoadingOverview(true);
            try {
                const res = await api.get(`/api/agents/overview/${selectedAgent.id}`);
                if (!cancelled) setOverview(res.data);
            } catch (err) {
                console.error("Failed to load agent overview:", err);
            } finally {
                if (!cancelled) setLoadingOverview(false);
            }
        }

        loadOverview();
        return () => { cancelled = true; };
    }, [activeDrawerTab, selectedAgent.id, overview]);

    useEffect(() => {
        let cancelled = false;

        async function loadActivity() {
            if (activeDrawerTab !== "activity" || fetchedActivityRef.current === selectedAgent.id) return;
            fetchedActivityRef.current = selectedAgent.id;
            setLoadingActivity(true);
            try {
                const res = await api.get(`/api/agents/activity/${selectedAgent.id}?limit=20`);
                if (!cancelled) {
                    const data = res.data;
                    setActivities(data.data ?? data ?? []);
                }
            } catch (err) {
                console.error("Failed to load agent activity:", err);
            } finally {
                if (!cancelled) setLoadingActivity(false);
            }
        }

        loadActivity();
        return () => { cancelled = true; };
    }, [activeDrawerTab, selectedAgent.id]);

    const displayName = overview
        ? [overview.role].filter(Boolean).join(" ") || selectedAgent.role
        : selectedAgent.role;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-text/40 backdrop-blur-[2px] z-99 transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-card border-l border-border shadow-2xl z-100 flex flex-col animate-slide-left">
                {/* Header */}
                <div className="p-6 border-b border-border/80 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-text/5 text-text flex items-center justify-center font-bold text-base border border-border/70">
                            {getInitials(selectedAgent.name)}
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-bold text-lg text-text leading-tight">
                                {selectedAgent.name}
                            </h2>
                            <p className="text-sm text-muted font-medium">
                                {overview?.agencyName ?? selectedAgent.agency}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                                <span className="hidden md:inline-block px-2 py-0.5 bg-page border border-border rounded text-[11px] font-semibold text-muted">
                                    {displayName}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getStatusClasses(selectedAgent.status)}`}
                                >
                                    {selectedAgent.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-muted hover:bg-page rounded-md transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-border/70 bg-page/10">
                    {(["profile", "activity", "actions"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize mr-6 relative mb-[-2px] ${
                                    activeDrawerTab === tab
                                        ? "border-accent text-accent font-semibold"
                                        : "border-transparent text-muted hover:text-text"
                                }`}
                            >
                                {tab}
                            </button>
                        ),
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {/* Profile Tab */}
                    {activeDrawerTab === "profile" && (
                        <div className="space-y-4 text-sm">
                            {loadingOverview ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="animate-spin text-muted" size={20} />
                                </div>
                            ) : (
                                <>
                                    {[
                                        {
                                            label: "Email",
                                            value: overview?.email ?? selectedAgent.email,
                                            extra: "break-all select-all",
                                        },
                                        { label: "Phone", value: overview?.mobile ?? selectedAgent.phone },
                                        {
                                            label: "Agency",
                                            value: overview?.agencyName ?? selectedAgent.agency,
                                            accent: true,
                                        },
                                        { label: "Role", value: overview?.role ?? selectedAgent.role },
                                        {
                                            label: "Licence",
                                            value: selectedAgent.licence,
                                            extra: "select-all",
                                        },
                                        {
                                            label: "Joined",
                                            value: selectedAgent.joined,
                                        },
                                        {
                                            label: "Last login",
                                            value: selectedAgent.lastLogin,
                                        },
                                    ].map(({ label, value, extra, accent }) => (
                                        <div
                                            key={label}
                                            className="flex py-2.5 border-b border-border/30"
                                        >
                                            <span className="w-1/3 text-muted">
                                                {label}
                                            </span>
                                            <span
                                                className={`w-2/3 font-medium ${accent ? "text-accent hover:underline cursor-pointer" : "text-text"} ${extra ?? ""}`}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Licence status as badge */}
                                    <div className="flex py-2.5 border-b border-border/30">
                                        <span className="w-1/3 text-muted">
                                            Licence status
                                        </span>
                                        <span className="w-2/3 flex items-center">
                                            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-semibold">
                                                {selectedAgent.licenceStatus}
                                            </span>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeDrawerTab === "activity" && (
                        <div className="relative pl-6 border-l-2 border-border/70 space-y-8 py-2">
                            {loadingActivity ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="animate-spin text-muted" size={20} />
                                </div>
                            ) : activities.length > 0 ? (
                                activities.map((act, index) => (
                                    <div key={index} className="relative">
                                        <span className="absolute left-[-31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-card shadow-sm" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm text-text">
                                                {act.label ?? act.type}
                                            </p>
                                            <p className="text-xs text-muted">
                                                {formatRelativeTime(act.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted text-center py-8">
                                    No recent activity found.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions Tab */}
                    {activeDrawerTab === "actions" && (
                        <div className="space-y-3">
                            {[
                                { label: "Reset password", danger: false },
                                { label: "Change role", danger: false },
                                {
                                    label: "Transfer to another agency",
                                    danger: false,
                                },
                            ].map(({ label }) => (
                                <div key={label}>
                                    <button className="w-full py-2.5 px-4 text-text font-medium rounded-md text-sm transition-all text-left hover:bg-page cursor-pointer">
                                        {label}
                                    </button>
                                    <div className="h-px w-full bg-border" />
                                </div>
                            ))}
                            <button className="w-full py-2.5 px-4 text-danger font-semibold rounded-md text-sm transition-all text-left hover:bg-page cursor-pointer">
                                Deactivate account
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AgentDrawer;
