"use client";

import { X } from "lucide-react";
import { Application, DrawerTab } from "@/actions/applicationsActions";
import StatusBadge from "./StatusBadge";

interface ApplicationDrawerProps {
    selectedApp: Application;
    activeDrawerTab: DrawerTab;
    notes: string;
    onTabChange: (tab: DrawerTab) => void;
    onClose: () => void;
    onNotesChange: (val: string) => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onRequestInfo: (id: number) => void;
}

const ApplicationDrawer = ({
    selectedApp,
    activeDrawerTab,
    notes,
    onTabChange,
    onClose,
    onNotesChange,
    onApprove,
    onReject,
    onRequestInfo,
}: ApplicationDrawerProps) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[450px] bg-card shadow-2xl z-[60] flex flex-col border-l border-border overflow-hidden animate-slide-left">
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
                        <span>{selectedApp.phone ?? "+61 412 308 991"}</span>
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
                        ).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`py-3 text-[14px] font-medium border-b-2 transition-colors ${
                                    activeDrawerTab === tab
                                        ? "border-accent text-text"
                                        : "border-transparent text-muted hover:text-text"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Application Tab */}
                    {activeDrawerTab === "Application" && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
                                    Agency Details
                                </h3>
                                <div className="flex flex-col gap-3 text-[14px]">
                                    {[
                                        ["Legal name", selectedApp.agency],
                                        [
                                            "Agency email",
                                            `admin@${selectedApp.agency.toLowerCase().replace(/\s/g, "")}.com.au`,
                                        ],
                                        [
                                            "Address",
                                            "142 Campbell Parade, Bondi NSW 2026",
                                        ],
                                        ["Licence number", "LIC-NSW-28441"],
                                        ["ABN (optional)", "45 123 456 789"],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="grid grid-cols-[130px_1fr] gap-x-2"
                                        >
                                            <span className="text-muted">
                                                {label}
                                            </span>
                                            <span className="text-text">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-[130px_1fr] gap-x-2 items-center">
                                        <span className="text-muted">CRM</span>
                                        <span className="inline-block px-2 py-0.5 rounded text-[12px] font-medium bg-page text-muted border border-border w-fit">
                                            {selectedApp.crm}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[12px] font-bold text-muted uppercase tracking-wider">
                                    Agent Details
                                </h3>
                                <div className="flex flex-col gap-3 text-[14px]">
                                    {[
                                        ["Name", selectedApp.name],
                                        ["Email", selectedApp.email],
                                        ["Licence", "LIC-NSW-28441"],
                                        ["Interested in", "Residential sales"],
                                        [
                                            "Message",
                                            "We are a boutique agency looking to expand our digital presence. HomeBy looks like a great fit.",
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
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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
                            <button className="px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded text-[14px] font-medium self-end transition-colors cursor-pointer">
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-card border-t border-border flex flex-col gap-2 shrink-0">
                    <button
                        onClick={() => onApprove(selectedApp.id)}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-[13px] font-medium transition-colors cursor-pointer"
                    >
                        Approve application
                    </button>
                    <button
                        onClick={() => onRequestInfo(selectedApp.id)}
                        className="w-full py-2.5 bg-card border border-border hover:bg-page text-text rounded text-[13px] font-medium transition-colors cursor-pointer"
                    >
                        Request more information
                    </button>
                    <button
                        onClick={() => onReject(selectedApp.id)}
                        className="w-full py-2.5 bg-card text-red-500 hover:text-red-700 rounded text-[13px] font-medium transition-colors cursor-pointer"
                    >
                        Reject application
                    </button>
                </div>
            </div>
        </>
    );
};

export default ApplicationDrawer;
