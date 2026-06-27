"use client";

import {
    X,
    Building2,
    User,
    FileText,
    Globe,
    Key,
    Calendar,
    Mail,
} from "lucide-react";
import { FtpRequest } from "@/types/ftpRequestTypes";

interface FtpRequestDrawerProps {
    request: FtpRequest;
    onClose: () => void;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(iso: string): string {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(iso: string): string {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === "pending") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                Pending
            </span>
        );
    }
    if (s === "approved") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-green-50 text-green-700 border border-green-200">
                Approved
            </span>
        );
    }
    if (s === "rejected") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-red-50 text-red-700 border border-red-200">
                Rejected
            </span>
        );
    }
    return (
        <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            {status}
        </span>
    );
}

const FtpRequestDrawer = ({
    request,
    onClose,
}: FtpRequestDrawerProps) => {
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
                <div className="p-6 border-b border-border/80 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[16px] text-text leading-tight">
                                FTP Request
                            </h2>
                            <p className="text-[12px] text-muted mt-0.5">
                                Request details and information
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted hover:text-text hover:bg-page rounded-md transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {/* Agency Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Building2 className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                Agency
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="font-semibold text-[14px] text-text leading-tight">
                                    {request.agencyName || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agent Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <User className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                Agent
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[14px] border-2 border-card shadow-sm">
                                {getInitials(request.agentName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[14px] text-text leading-tight truncate">
                                    {request.agentName || "—"}
                                </p>
                                {request.agentEmail && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Mail className="w-3 h-3 text-muted shrink-0" />
                                        <span className="text-[12px] text-muted truncate">
                                            {request.agentEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FTP Details Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Key className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                FTP Details
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-muted">
                                    Agent Email
                                </span>
                                <span className="text-[13px] font-medium text-text">
                                    {request.agentEmail || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] text-muted">
                                        Allowed IP
                                    </span>
                                </div>
                                <span className="text-[13px] font-medium text-text font-mono">
                                    {request.allowedIp || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] text-muted">
                                        FTP Username
                                    </span>
                                </div>
                                <span className="text-[13px] font-medium text-text">
                                    {request.ftpUsername || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <span className="text-[13px] text-muted">
                                    Status
                                </span>
                                <StatusBadge status={request.status} />
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] text-muted">
                                        Requested
                                    </span>
                                </div>
                                <span className="text-[13px] font-medium text-text">
                                    {formatDate(request.requestedAt)}
                                    {request.requestedAt &&
                                        ` ${formatTime(request.requestedAt)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FtpRequestDrawer;
