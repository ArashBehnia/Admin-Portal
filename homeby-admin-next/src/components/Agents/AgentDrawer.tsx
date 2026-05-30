"use client";

import { X } from "lucide-react";
import { Agent, DrawerTab } from "@/actions/agentsActions";

interface AgentDrawerProps {
    selectedAgent: Agent;
    activeDrawerTab: DrawerTab;
    onTabChange: (tab: DrawerTab) => void;
    onClose: () => void;
    getInitials: (name: string) => string;
    getStatusClasses: (status: Agent["status"]) => string;
}

const AgentDrawer = ({
    selectedAgent,
    activeDrawerTab,
    onTabChange,
    onClose,
    getInitials,
    getStatusClasses,
}: AgentDrawerProps) => {
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
                                {selectedAgent.agency}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                                <span className="hidden md:inline-block px-2 py-0.5 bg-page border border-border rounded text-[11px] font-semibold text-muted">
                                    {selectedAgent.role}
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
                            {[
                                {
                                    label: "Email",
                                    value: selectedAgent.email,
                                    extra: "break-all select-all",
                                },
                                { label: "Phone", value: selectedAgent.phone },
                                {
                                    label: "Agency",
                                    value: selectedAgent.agency,
                                    accent: true,
                                },
                                { label: "Role", value: selectedAgent.role },
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
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeDrawerTab === "activity" && (
                        <div className="relative pl-6 border-l-2 border-border/70 space-y-8 py-2">
                            {selectedAgent.activities.map((act, index) => {
                                const isRating = act.event.includes("★");
                                return (
                                    <div key={index} className="relative">
                                        <span className="absolute left-[-31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-card shadow-sm" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm text-text">
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
