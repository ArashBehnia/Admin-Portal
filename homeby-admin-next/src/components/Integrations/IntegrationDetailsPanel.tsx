"use client";

import { useState } from "react";
import { X, RefreshCw } from "lucide-react";
import { Feed } from "@/actions/integrationsActions";
import { StatusBadge, MethodBadge } from "@/components/Integrations/StatusBadge";

interface IntegrationDetailsPanelProps {
    feed: Feed | null;
    onClose: () => void;
}

type PanelTab = "overview" | "sync history" | "errors" | "validation";

const SYNC_HISTORY = [
    { time: "Today 14:02", dur: "1.4s", proc: 47, status: "Success", err: 0 },
    { time: "Today 12:58", dur: "1.2s", proc: 12, status: "Success", err: 0 },
    { time: "Today 11:54", dur: "1.5s", proc: 19, status: "Success", err: 0 },
    { time: "Today 10:51", dur: "1.3s", proc: 8, status: "Success", err: 0 },
    { time: "Today 09:47", dur: "9.8s", proc: 0, status: "Failed", err: 3 },
    { time: "Today 08:44", dur: "1.1s", proc: 22, status: "Success", err: 0 },
    {
        time: "Yesterday 23:40",
        dur: "1.6s",
        proc: 14,
        status: "Success",
        err: 0,
    },
    {
        time: "Yesterday 22:36",
        dur: "1.4s",
        proc: 9,
        status: "Success",
        err: 0,
    },
    {
        time: "Yesterday 21:33",
        dur: "12.4s",
        proc: 0,
        status: "Failed",
        err: 7,
    },
    {
        time: "Yesterday 20:29",
        dur: "1.5s",
        proc: 18,
        status: "Success",
        err: 0,
    },
];

const ERRORS = [
    {
        type: "Auth failure",
        time: "Today 09:47",
        msg: "401 Unauthorized: invalid_grant. Refresh token rejected by VaultRE OAuth endpoint at /oauth/token. Re-authentication required by agency admin.",
    },
    {
        type: "Parse error",
        time: "Yesterday 21:33",
        msg: "Unexpected closing tag </listing> at line 4821, column 14. REAXML feed appears truncated mid-document.",
        listing: "RW-BON-44218",
    },
    {
        type: "Parse error",
        time: "Yesterday 21:33",
        msg: "Invalid <price> node: non-numeric value '$AUCTION'. Expected integer or decimal.",
        listing: "RW-BON-44217",
    },
    {
        type: "Missing field",
        time: "Yesterday 14:12",
        msg: "Required field <suburb> missing from listing payload.",
        listing: "RW-BON-44209",
    },
    {
        type: "Timeout",
        time: "Yesterday 09:55",
        msg: "Connection to feed endpoint timed out after 30s. Server did not respond.",
    },
    {
        type: "Duplicate listing",
        time: "2 days ago 22:14",
        msg: "Listing already imported under different ID: RW-BON-44182.",
        listing: "RW-BON-44188",
    },
];

const VALIDATION_ISSUES = [
    {
        type: "Missing suburb",
        count: 12,
        severity: "High",
        lastSeen: "2 hours ago",
    },
    {
        type: "Missing images",
        count: 8,
        severity: "Medium",
        lastSeen: "4 hours ago",
    },
    {
        type: "Malformed price",
        count: 5,
        severity: "High",
        lastSeen: "1 hour ago",
    },
    {
        type: "Duplicate listing ID",
        count: 6,
        severity: "Low",
        lastSeen: "3 hours ago",
    },
    {
        type: "Missing agent mapping",
        count: 3,
        severity: "Medium",
        lastSeen: "6 hours ago",
    },
];

const IntegrationDetailsPanel = ({
    feed,
    onClose,
}: IntegrationDetailsPanelProps) => {
    const [activeTab, setActiveTab] = useState<PanelTab>("overview");

    if (!feed) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/20 z-60 transition-opacity"
                onClick={onClose}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-card shadow-xl z-60 flex flex-col">
                {/* Header */}
                <div className="flex flex-col gap-2 p-5 border-b border-border">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-[18px] font-bold text-text leading-tight">
                                {feed?.agencyName}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[12px] text-muted">
                                    {feed?.crm}
                                </span>
                                <MethodBadge method={feed?.method ?? ""} />
                                <StatusBadge status={feed?.status ?? ""} />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-muted hover:text-text rounded cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Panel Tabs */}
                    <div className="flex items-center gap-5 mt-4 border-b border-border">
                        {(
                            [
                                "Overview",
                                "Sync history",
                                "Errors",
                                "Validation",
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab}
                                onClick={() =>
                                    setActiveTab(tab.toLowerCase() as PanelTab)
                                }
                                className={`pb-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer ${
                                    activeTab === tab.toLowerCase()
                                        ? "border-accent text-accent"
                                        : "border-transparent text-muted hover:text-text"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-semibold text-muted">
                                    Onboarding stage
                                </h3>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1.5 flex-1 rounded-full ${step <= 4 ? "bg-accent" : "bg-border"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[13px] font-medium text-text mt-1">
                                    Live
                                </p>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[12px] font-semibold text-muted">
                                    Assigned admin
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                        SC
                                    </div>
                                    <span className="text-[13px] text-text">
                                        Sarah Chen
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Notes
                                    </h3>
                                    <button className="text-accent text-[11px] font-medium hover:underline cursor-pointer">
                                        Edit
                                    </button>
                                </div>
                                <div className="bg-page p-3 rounded border border-border text-[12px] text-muted leading-relaxed">
                                    Onboarding contact: Mark Henderson. CRM
                                    credentials confirmed 12 May. Initial sync
                                    passed validation; monitoring for first full
                                    daily import.
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Last sync
                                    </h3>
                                    <p className="text-[13px] text-text">
                                        {feed?.lastSync}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Sync frequency
                                    </h3>
                                    <p className="text-[13px] text-text">
                                        1 hour
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[12px] font-semibold text-muted">
                                    Feed endpoint
                                </h3>
                                <p className="text-[12px] text-muted font-mono break-all">
                                    https://feeds.boxdice.com.au/raywhite-bondi/reaxm...
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-[12px] font-semibold text-muted">
                                    Listing distribution
                                </h3>
                                <p className="text-[11px] text-muted -mt-1">
                                    Outbound push status to external portals
                                </p>
                                <div className="space-y-1.5 text-[12px]">
                                    {[
                                        {
                                            name: "HomeBy",
                                            status: "Active",
                                            dot: "bg-green-500",
                                            count: "247 listings",
                                        },
                                        {
                                            name: "REA Group",
                                            status: "Connected",
                                            dot: "bg-green-500",
                                            count: "247 published",
                                        },
                                        {
                                            name: "Domain",
                                            status: "Connected",
                                            dot: "bg-green-500",
                                            count: "247 published",
                                        },
                                        {
                                            name: "View.com.au",
                                            status: "Connected",
                                            dot: "bg-green-500",
                                            count: "247 published",
                                        },
                                    ].map(({ name, status, dot, count }) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full ${dot}`}
                                                />
                                                <span className="font-medium">
                                                    {name}
                                                </span>
                                                <span className="text-muted">
                                                    - {status}
                                                </span>
                                            </div>
                                            <span className="text-muted">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-between text-muted">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                            <span className="font-medium">
                                                Homely
                                            </span>
                                            <span>- Not connected</span>
                                        </div>
                                        <span>0 published</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted mt-2">
                                    Distribution connections are managed by the
                                    agency in their portal. Admin view is
                                    read-only.
                                </p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-border">
                                <button className="w-full bg-accent hover:bg-accent/90 text-white rounded py-2 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                    <RefreshCw className="w-4 h-4" /> Retry sync
                                </button>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-card border border-border text-text rounded py-2 text-[12px] font-medium hover:bg-page transition-colors cursor-pointer">
                                        Edit configuration
                                    </button>
                                    <button className="flex-1 bg-card border border-border text-text rounded py-2 text-[12px] font-medium hover:bg-page transition-colors cursor-pointer">
                                        Pause feed
                                    </button>
                                </div>
                                <button className="w-full text-muted py-2 text-[12px] font-medium hover:bg-page transition-colors rounded cursor-pointer">
                                    Mark resolved
                                </button>
                                <button className="w-full text-red-600 py-2 text-[12px] font-medium hover:bg-red-50 transition-colors rounded flex items-center justify-center gap-1.5 cursor-pointer">
                                    Remove feed
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sync History */}
                    {activeTab === "sync history" && (
                        <table className="w-full text-left text-[12px]">
                            <thead>
                                <tr className="border-b border-border text-muted">
                                    <th className="font-medium py-2">
                                        Timestamp
                                    </th>
                                    <th className="font-medium py-2">
                                        Duration
                                    </th>
                                    <th className="font-medium py-2 text-right">
                                        Processed
                                    </th>
                                    <th className="font-medium py-2 text-center">
                                        Errors
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {SYNC_HISTORY.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-border/40 last:border-0"
                                    >
                                        <td className="py-2.5 text-text">
                                            {row?.time}
                                        </td>
                                        <td className="py-2.5 text-muted">
                                            {row?.dur}
                                        </td>
                                        <td className="py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <span className="font-medium">
                                                    {row?.proc}
                                                </span>
                                                <span
                                                    className={`text-[10px] px-1 rounded font-medium border ${
                                                        row?.status ===
                                                        "Success"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-red-50 text-red-700 border-red-200"
                                                    }`}
                                                >
                                                    {row?.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td
                                            className={`py-2.5 text-center font-medium ${(row?.err ?? 0) > 0 ? "text-red-600" : "text-muted"}`}
                                        >
                                            {row?.err}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Errors */}
                    {activeTab === "errors" && (
                        <div className="space-y-3">
                            {ERRORS.map((err, i) => (
                                <div
                                    key={i}
                                    className="bg-card border border-border rounded p-3 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 rounded">
                                            {err?.type}
                                        </span>
                                        <span className="text-[11px] text-muted">
                                            {err?.time}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-text leading-relaxed font-mono mt-2">
                                        {err?.msg}
                                    </p>
                                    {err?.listing && (
                                        <p className="text-[11px] text-muted mt-2">
                                            Listing:{" "}
                                            <span className="text-text font-medium">
                                                {err?.listing}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Validation */}
                    {activeTab === "validation" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Total imported", value: "847" },
                                    { label: "Valid", value: "819" },
                                    { label: "Issues", value: "28" },
                                    { label: "Duplicates", value: "6" },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="border border-border rounded p-3 bg-card"
                                    >
                                        <h3 className="text-[12px] text-muted mb-1">
                                            {label}
                                        </h3>
                                        <p className="text-[18px] font-bold text-text">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <table className="w-full text-left text-[12px]">
                                <thead>
                                    <tr className="border-b border-border text-muted">
                                        <th className="font-medium py-2">
                                            Issue type
                                        </th>
                                        <th className="font-medium py-2 text-right">
                                            Count
                                        </th>
                                        <th className="font-medium py-2 text-center">
                                            Severity
                                        </th>
                                        <th className="font-medium py-2">
                                            Last seen
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {VALIDATION_ISSUES.map((issue, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-border/40 last:border-0"
                                        >
                                            <td className="py-2.5 text-text font-medium">
                                                {issue?.type}
                                            </td>
                                            <td className="py-2.5 text-right font-medium text-text">
                                                {issue?.count}
                                            </td>
                                            <td className="py-2.5 text-center">
                                                <span
                                                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium border inline-block ${
                                                        issue?.severity ===
                                                        "High"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : issue?.severity ===
                                                                "Medium"
                                                              ? "bg-orange-50 text-orange-700 border-orange-200"
                                                              : "bg-page text-muted border-border"
                                                    }`}
                                                >
                                                    {issue?.severity}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-muted">
                                                {issue?.lastSeen}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default IntegrationDetailsPanel;
