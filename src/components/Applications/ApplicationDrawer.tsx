"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Application, DrawerTab, ApplicationTimeline } from "@/types/applicationTypes";
import StatusBadge from "./StatusBadge";

interface ApplicationDrawerProps {
    selectedApp: Application;
    activeDrawerTab: DrawerTab;
    notes: string;
    isSavingNote: boolean;
    isApproving: boolean;
    isRejecting: boolean;
    timeline: ApplicationTimeline;
    isTimelineLoading: boolean;
    onTabChange: (tab: DrawerTab) => void;
    onClose: () => void;
    onNotesChange: (val: string) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onRequestInfo: (id: string) => void;
    onSaveNote: (id: string, note: string) => void;
    onLoadTimeline: (id: string) => void;
}

const ApplicationDrawer = ({
    selectedApp,
    activeDrawerTab,
    notes,
    isSavingNote,
    isApproving,
    isRejecting,
    timeline,
    isTimelineLoading,
    onTabChange,
    onClose,
    onNotesChange,
    onApprove,
    onReject,
    onRequestInfo,
    onSaveNote,
    onLoadTimeline,
}: ApplicationDrawerProps) => {
    const timelineLoadedForApp = useRef<string | null>(null);

    useEffect(() => {
        if (activeDrawerTab === "Notes" && timelineLoadedForApp.current !== selectedApp.id) {
            timelineLoadedForApp.current = selectedApp.id;
            onLoadTimeline(selectedApp.id);
        }
    }, [activeDrawerTab, onLoadTimeline, selectedApp.id]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="overlay z-drawer transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-card shadow-2xl z-[101] flex flex-col border-l border-border overflow-hidden animate-slide-left">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-[18px] font-bold text-text mb-1">
                        {selectedApp.name}
                    </h2>
                    <div className="text-[13px] text-muted flex flex-col gap-0.5 mb-3">
                        <span>{selectedApp.email}</span>
                        {selectedApp.phone && <span>{selectedApp.phone}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[12px]">
                        <StatusBadge status={selectedApp.status} />
                        <span className="text-muted">
                            Submitted {selectedApp.submitted}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-border bg-card shrink-0">
                    <div className="flex gap-6">
                        {(
                            ["Application", "Verification", "Notes"] as const
                        ).map((tab) => {
                            const isVerification = tab === "Verification";
                            return (
                                <button
                                    key={tab}
                                    onClick={() => !isVerification && onTabChange(tab)}
                                    disabled={isVerification}
                                    className={`py-3 text-[14px] font-medium border-b-2 transition-colors ${
                                        isVerification
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                    } ${
                                        activeDrawerTab === tab
                                            ? "border-accent text-text"
                                            : "border-transparent text-muted hover:text-text"
                                    }`}
                                    title={isVerification ? "Coming soon" : undefined}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Application Tab */}
                    {activeDrawerTab === "Application" && (() => {
                        const d = (selectedApp.rawData?.data ?? {}) as Record<string, unknown>;
                        return (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
                                    Agency Details
                                </h3>
                                <div className="flex flex-col gap-3 text-[14px]">
                                    {[
                                        ["Legal name", (d.agencyLegalName ?? selectedApp.agency) as string],
                                        [
                                            "Address",
                                            (d.agencyAddress ?? "\u2014") as string,
                                        ],
                                        ["State", (d.state ?? "\u2014") as string],
                                        ["Postcode", (d.postcode ?? "\u2014") as string],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="grid grid-cols-[130px_1fr] gap-x-2"
                                        >
                                            <span className="text-muted">
                                                {label}
                                            </span>
                                            <span className="text-text">
                                                {value || "\u2014"}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-[130px_1fr] gap-x-2 items-center">
                                        <span className="text-muted">CRM</span>
                                        <span className="inline-block px-2 py-0.5 rounded text-[12px] font-medium bg-page text-muted border border-border w-fit">
                                            {(d.crmSelection ?? selectedApp.crm) as string}
                                        </span>
                                    </div>
                                    {[
                                        ["Licence number", (d.licenceNumber ?? d.agencyLicence ?? d.licenseNumber ?? "\u2014") as string],
                                        ["ABN (optional)", (d.abn ?? d.ABN ?? "\u2014") as string],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="grid grid-cols-[130px_1fr] gap-x-2"
                                        >
                                            <span className="text-muted">
                                                {label}
                                            </span>
                                            <span className="text-text">
                                                {value || "\u2014"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
                                    Agent Details
                                </h3>
                                <div className="flex flex-col gap-3 text-[14px]">
                                    {[
                                        ["Name", (d.agentFullName ?? selectedApp.name) as string],
                                        ["Email", (d.agentEmail ?? selectedApp.email) as string],
                                        ["Phone", (d.agentPhone ?? selectedApp.phone ?? "\u2014") as string],
                                        ["Interested in", (d.interest ?? "\u2014") as string],
                                        [
                                            "Message",
                                            (d.message ?? "\u2014") as string,
                                        ],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="grid grid-cols-[130px_1fr] gap-x-2"
                                        >
                                            <span className="text-muted">
                                                {label}
                                            </span>
                                            <span className="text-text">
                                                {value || "\u2014"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        );
                    })()}

                    {/* Verification Tab */}
                    {activeDrawerTab === "Verification" && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[14px] font-bold text-text mb-2">
                                Verification checks
                            </h3>

                            <div className="bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-bold text-text">
                                        ABN Lookup
                                    </h4>
                                    <span className="text-green-600 text-[12px] font-bold bg-green-50 px-2 py-0.5 rounded">
                                        Verified
                                    </span>
                                </div>
                                <div className="text-[14px] text-text mt-1">
                                    45 123 456 789
                                </div>
                                <div className="text-[13px] text-muted">
                                    Entity: {selectedApp.agency} Pty Ltd · GST
                                    registered: Yes
                                </div>
                                <button className="px-3 py-1.5 bg-card border border-border rounded text-[13px] font-medium hover:bg-page self-start mt-2 transition-colors cursor-pointer">
                                    Re-check ABN
                                </button>
                            </div>

                            <div className="bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[14px] font-bold text-text">
                                        Agent Licence
                                    </h4>
                                    <span className="text-orange-600 text-[12px] font-bold bg-orange-50 px-2 py-0.5 rounded">
                                        Manual check required
                                    </span>
                                </div>
                                <div className="text-[14px] text-text mt-1">
                                    LIC-NSW-28441
                                </div>
                                <div className="text-[13px] text-muted leading-relaxed">
                                    Auto-verification unavailable for NSW.
                                    Please verify manually at NSW Fair Trading.
                                </div>
                                <button className="text-accent text-[13px] font-medium hover:underline self-start cursor-pointer">
                                    NSW Fair Trading →
                                </button>
                                <button className="px-3 py-1.5 bg-card border border-border rounded text-[13px] font-medium hover:bg-page self-start mt-2 transition-colors cursor-pointer">
                                    Mark as verified
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notes Tab */}
                    {activeDrawerTab === "Notes" && (
                        <div className="flex flex-col gap-4">
                            <textarea
                                placeholder="Add internal notes about this application..."
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                className="w-full h-[200px] bg-card border border-border rounded p-3 text-[14px] text-text focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder-muted"
                            />
                            <button
                                onClick={() => onSaveNote(selectedApp.id, notes)}
                                disabled={isSavingNote || !notes.trim()}
                                className="px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded text-[14px] font-medium self-end transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSavingNote && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {isSavingNote ? "Saving..." : "Save"}
                            </button>

                            {/* Timeline */}
                            <div className="flex flex-col gap-3 mt-4">
                                <h4 className="text-[12px] font-bold text-muted uppercase tracking-wider">
                                    Activity Timeline
                                </h4>
                                {isTimelineLoading ? (
                                    <p className="text-[13px] text-muted">Loading timeline...</p>
                                ) : timeline.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {[...timeline].sort((a, b) => {
                                            const rawA = a as unknown as Record<string, unknown>;
                                            const rawB = b as unknown as Record<string, unknown>;
                                            const tsA = (rawA.timestamp ?? rawA.createdAt ?? rawA.date ?? "") as string;
                                            const tsB = (rawB.timestamp ?? rawB.createdAt ?? rawB.date ?? "") as string;
                                            return new Date(tsB).getTime() - new Date(tsA).getTime();
                                        }).map((item) => {
                                            const raw = item as unknown as Record<string, unknown>;
                                            const action = (raw.action ?? raw.type ?? raw.event ?? raw.title ?? raw.actionType ?? "") as string;
                                            const performedBy = (raw.performedBy ?? raw.user ?? raw.actor ?? raw.author ?? raw.performedByUser ?? raw.userName ?? "") as string;
                                            const description = (raw.description ?? raw.message ?? raw.details ?? raw.text ?? raw.content ?? raw.note ?? "") as string;
                                            const timestamp = (raw.timestamp ?? raw.createdAt ?? raw.date ?? raw.time ?? raw.occurredAt ?? "") as string;
                                            const isNote = action.toLowerCase() === "note" || (raw.type as string)?.toLowerCase() === "note";
                                            const displayAction = isNote ? "Note" : action;

                                            const formatTimestamp = (ts: string): string => {
                                                if (!ts) return "";
                                                try {
                                                    const date = new Date(ts);
                                                    if (isNaN(date.getTime())) return ts;
                                                    const now = Date.now();
                                                    const diff = now - date.getTime();
                                                    const mins = Math.floor(diff / 60000);
                                                    if (mins < 1) return "Just now";
                                                    if (mins < 60) return `${mins} min ago`;
                                                    const hours = Math.floor(mins / 60);
                                                    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
                                                    const days = Math.floor(hours / 24);
                                                    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
                                                    return date.toLocaleDateString("en-AU", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    });
                                                } catch {
                                                    return ts;
                                                }
                                            };

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="border-l-2 border-border pl-3 py-1"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[13px] font-medium text-text">
                                                            {displayAction || "\u2014"}
                                                        </span>
                                                        {performedBy && (
                                                            <span className="text-[11px] text-muted">
                                                                by {performedBy}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {description && (
                                                        <p className="text-[12px] text-muted mt-1">
                                                            {description}
                                                        </p>
                                                    )}
                                                    <span className="text-[11px] text-muted">
                                                        {formatTimestamp(timestamp)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-[13px] text-muted">No activity recorded yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-card border-t border-border flex flex-col gap-2 shrink-0">
                    <button
                        onClick={() => onApprove(selectedApp.id)}
                        disabled={isApproving || isRejecting}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isApproving && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isApproving ? "Approving..." : "Approve application"}
                    </button>
                    <button
                        onClick={() => onRequestInfo(selectedApp.id)}
                        disabled={true}
                        className="w-full py-2.5 bg-card border border-border hover:bg-page text-muted rounded text-[13px] font-medium transition-colors cursor-not-allowed opacity-50"
                        title="Coming soon"
                    >
                        Request more information (coming soon)
                    </button>
                    <button
                        onClick={() => onReject(selectedApp.id)}
                        disabled={isApproving || isRejecting}
                        className="w-full py-2.5 bg-card text-red-500 hover:text-red-700 rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isRejecting && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isRejecting ? "Rejecting..." : "Reject application"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ApplicationDrawer;
