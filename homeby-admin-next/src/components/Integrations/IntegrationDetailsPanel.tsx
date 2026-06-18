"use client";

import { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { Feed } from "@/types/integrationTypes";
import { StatusBadge, MethodBadge } from "@/components/Integrations/StatusBadge";
import api from "@/lib/axios";

interface IntegrationDetailsPanelProps {
    feed: Feed | null;
    onClose: () => void;
}

type PanelTab = "overview" | "sync history" | "errors" | "validation";

type ApiDetail = {
    agencyId: string;
    agencyName: string;
    agencyStatus?: string;
    crmType?: string;
    webhookUrl?: string;
    connectionStatus: string;
    totalFeeds: number;
    errorFeeds: number;
    lastSyncAt?: string;
    email?: string;
    phone?: string;
    apiAllowedIps?: string[];
    ftpAllowedIps?: string[];
};

type ApiError = {
    id: string;
    listingId?: string;
    portal?: string;
    status?: string;
    externalId?: string;
    lastError?: string;
    lastSyncAt?: string;
    updatedAt?: string;
};

const SYNC_HISTORY = [
    { time: "Today 14:02", dur: "1.4s", proc: 47, status: "Success", err: 0 },
    { time: "Today 12:58", dur: "1.2s", proc: 12, status: "Success", err: 0 },
    { time: "Today 11:54", dur: "1.5s", proc: 19, status: "Success", err: 0 },
    { time: "Today 10:51", dur: "1.3s", proc: 8, status: "Success", err: 0 },
    { time: "Today 09:47", dur: "9.8s", proc: 0, status: "Failed", err: 3 },
    { time: "Today 08:44", dur: "1.1s", proc: 22, status: "Success", err: 0 },
];

const VALIDATION_ISSUES = [
    { type: "Missing suburb", count: 12, severity: "High", lastSeen: "2 hours ago" },
    { type: "Missing images", count: 8, severity: "Medium", lastSeen: "4 hours ago" },
    { type: "Malformed price", count: 5, severity: "High", lastSeen: "1 hour ago" },
    { type: "Duplicate listing ID", count: 6, severity: "Low", lastSeen: "3 hours ago" },
    { type: "Missing agent mapping", count: 3, severity: "Medium", lastSeen: "6 hours ago" },
];

function formatLastSync(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

const IntegrationDetailsPanel = ({
    feed,
    onClose,
}: IntegrationDetailsPanelProps) => {
    const [activeTab, setActiveTab] = useState<PanelTab>("overview");
    const [detail, setDetail] = useState<ApiDetail | null>(null);
    const [errors, setErrors] = useState<ApiError[]>([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (!feed) return;
        setActiveTab("overview");
        setDetail(null);
        setErrors([]);
        setLoadingDetail(true);

        const id = feed.id;
        Promise.all([
            api.get(`/api/integrations/${id}`),
            api.get(`/api/integrations/${id}/errors?limit=20`),
        ])
            .then(([detailRes, errorsRes]) => {
                setDetail(detailRes.data?.data ?? detailRes.data);
                setErrors(errorsRes.data?.data?.data ?? errorsRes.data?.data ?? []);
            })
            .catch((err) => {
                console.error("Failed to load integration detail:", err);
            })
            .finally(() => setLoadingDetail(false));
    }, [feed?.id]);

    if (!feed) return null;

    const overviewDetail = detail ?? {
        agencyName: feed.agencyName,
        crmType: feed.crm,
        connectionStatus: feed.status,
        webhookUrl: "",
        lastSyncAt: undefined,
        email: undefined,
        phone: undefined,
        apiAllowedIps: [],
        ftpAllowedIps: [],
    };

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
                                {feed.agencyName}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[12px] text-muted">
                                    {feed.crm}
                                </span>
                                <MethodBadge method={feed.method} />
                                <StatusBadge status={feed.status} />
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
                    {loadingDetail && (
                        <div className="py-10 text-center text-muted text-[13px]">
                            Loading…
                        </div>
                    )}

                    {/* Overview */}
                    {activeTab === "overview" && !loadingDetail && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-semibold text-muted">
                                    Onboarding stage
                                </h3>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1.5 flex-1 rounded-full ${
                                                feed.status === "Healthy"
                                                    ? "bg-accent"
                                                    : step <= 3
                                                      ? "bg-accent"
                                                      : "bg-border"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[13px] font-medium text-text mt-1">
                                    {feed.onboarding}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Last sync
                                    </h3>
                                    <p className="text-[13px] text-text">
                                        {formatLastSync(overviewDetail.lastSyncAt)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        CRM type
                                    </h3>
                                    <p className="text-[13px] text-text">
                                        {overviewDetail.crmType ?? "—"}
                                    </p>
                                </div>
                            </div>

                            {overviewDetail.webhookUrl && (
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Feed endpoint
                                    </h3>
                                    <p className="text-[12px] text-muted font-mono break-all">
                                        {overviewDetail.webhookUrl}
                                    </p>
                                </div>
                            )}

                            {overviewDetail.email && (
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        Contact
                                    </h3>
                                    <p className="text-[13px] text-text">
                                        {overviewDetail.email}
                                        {overviewDetail.phone && (
                                            <span className="text-muted ml-2">
                                                {overviewDetail.phone}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {(overviewDetail.apiAllowedIps?.length ?? 0) > 0 && (
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        API allowed IPs
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {overviewDetail.apiAllowedIps!.map(
                                            (ip) => (
                                                <span
                                                    key={ip}
                                                    className="text-[11px] font-mono bg-page border border-border rounded px-1.5 py-0.5"
                                                >
                                                    {ip}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {(overviewDetail.ftpAllowedIps?.length ?? 0) > 0 && (
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-muted">
                                        FTP allowed IPs
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {overviewDetail.ftpAllowedIps!.map(
                                            (ip) => (
                                                <span
                                                    key={ip}
                                                    className="text-[11px] font-mono bg-page border border-border rounded px-1.5 py-0.5"
                                                >
                                                    {ip}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t border-border">
                                <button className="w-full bg-accent hover:bg-accent/90 text-white rounded py-2 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                    <RefreshCw className="w-4 h-4" /> Retry sync
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
                                            {row.time}
                                        </td>
                                        <td className="py-2.5 text-muted">
                                            {row.dur}
                                        </td>
                                        <td className="py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <span className="font-medium">
                                                    {row.proc}
                                                </span>
                                                <span
                                                    className={`text-[10px] px-1 rounded font-medium border ${
                                                        row.status === "Success"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-red-50 text-red-700 border-red-200"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td
                                            className={`py-2.5 text-center font-medium ${row.err > 0 ? "text-red-600" : "text-muted"}`}
                                        >
                                            {row.err}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Errors */}
                    {activeTab === "errors" && (
                        <div className="space-y-3">
                            {errors.length === 0 && !loadingDetail && (
                                <p className="py-10 text-center text-muted text-[13px]">
                                    No errors found.
                                </p>
                            )}
                            {errors.map((err) => (
                                <div
                                    key={err.id}
                                    className="bg-card border border-border rounded p-3 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 rounded">
                                            {err.status ?? "Error"}
                                        </span>
                                        <span className="text-[11px] text-muted">
                                            {formatLastSync(err.lastSyncAt ?? err.updatedAt)}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-text leading-relaxed font-mono mt-2">
                                        {err.lastError ?? "Unknown error"}
                                    </p>
                                    {err.listingId && (
                                        <p className="text-[11px] text-muted mt-2">
                                            Listing:{" "}
                                            <span className="text-text font-medium">
                                                {err.listingId}
                                            </span>
                                        </p>
                                    )}
                                    {err.portal && (
                                        <p className="text-[11px] text-muted mt-1">
                                            Portal:{" "}
                                            <span className="text-text font-medium">
                                                {err.portal}
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
                                    { label: "Total imported", value: String(feed.listings24h ?? 0) },
                                    { label: "Issues", value: String(feed.errors24h ?? 0) },
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
                                                {issue.type}
                                            </td>
                                            <td className="py-2.5 text-right font-medium text-text">
                                                {issue.count}
                                            </td>
                                            <td className="py-2.5 text-center">
                                                <span
                                                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium border inline-block ${
                                                        issue.severity === "High"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : issue.severity ===
                                                                "Medium"
                                                              ? "bg-orange-50 text-orange-700 border-orange-200"
                                                              : "bg-page text-muted border-border"
                                                    }`}
                                                >
                                                    {issue.severity}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-muted">
                                                {issue.lastSeen}
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
