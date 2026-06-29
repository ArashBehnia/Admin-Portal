"use client";

import {
    X,
    Home,
    User,
    FileText,
    BedDouble,
    Bath,
    Car,
    MapPin,
    Calendar,
    Mail,
    Shield,
} from "lucide-react";
import { PropertyReport } from "@/types/propertyReportTypes";

interface PropertyReportDrawerProps {
    report: PropertyReport;
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

function ReportTypeBadge({ type }: { type: string }) {
    const t = type.toLowerCase();
    if (t === "pest") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-green-50 text-green-700 border border-green-200">
                Pest
            </span>
        );
    }
    if (t === "building") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Building
            </span>
        );
    }
    if (t === "both") {
        return (
            <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Both
            </span>
        );
    }
    return (
        <span className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            {type}
        </span>
    );
}

const PropertyReportDrawer = ({
    report,
    onClose,
}: PropertyReportDrawerProps) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className="overlay z-drawer transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-card border-l border-border shadow-2xl z-[101] flex flex-col animate-slide-left">
                {/* Header */}
                <div className="p-6 border-b border-border/80 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[16px] text-text leading-tight">
                                Property Report
                            </h2>
                            <p className="text-[12px] text-muted mt-0.5">
                                Report details and information
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
                    {/* Reporter Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <User className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                Reporter
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {report.reporterAvatar ? (
                                <img
                                    src={report.reporterAvatar}
                                    alt={report.reporterName}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-card shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display =
                                            "none";
                                        (
                                            e.target as HTMLImageElement
                                        ).nextElementSibling?.classList.remove("hidden");
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[14px] border-2 border-card shadow-sm ${report.reporterAvatar ? "hidden" : ""}`}
                            >
                                {getInitials(report.reporterName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[14px] text-text leading-tight truncate">
                                    {report.reporterName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail className="w-3 h-3 text-muted shrink-0" />
                                    <span className="text-[12px] text-muted truncate">
                                        {report.reporterEmail}
                                    </span>
                                </div>
                                {report.reporterRole && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Shield className="w-3 h-3 text-muted shrink-0" />
                                        <span className="text-[12px] text-muted capitalize">
                                            {report.reporterRole}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Property Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Home className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                Property
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="font-semibold text-[14px] text-text leading-tight">
                                    {report.propertyName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-3 h-3 text-muted shrink-0" />
                                    <span className="text-[12px] text-muted">
                                        {report.propertyAddress}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-2 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                    <BedDouble className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] font-medium text-text">
                                        {report.bedrooms}
                                    </span>
                                    <span className="text-[11px] text-muted">
                                        Bed
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Bath className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] font-medium text-text">
                                        {report.bathrooms}
                                    </span>
                                    <span className="text-[11px] text-muted">
                                        Bath
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Car className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] font-medium text-text">
                                        {report.carSpaces}
                                    </span>
                                    <span className="text-[11px] text-muted">
                                        Car
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Details Section */}
                    <div className="bg-page/50 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-1.5 mb-3">
                            <FileText className="w-3.5 h-3.5 text-muted" />
                            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                                Report Details
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-muted">
                                    Report Type
                                </span>
                                <ReportTypeBadge type={report.type} />
                            </div>
                            <div className="border-t border-border/40 pt-3">
                                <span className="text-[13px] text-muted block mb-1.5">
                                    Message
                                </span>
                                <p className="text-[13px] text-text font-medium leading-relaxed bg-card rounded-lg p-3 border border-border/50">
                                    {report.message || "No message provided"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted" />
                                    <span className="text-[13px] text-muted">
                                        Created
                                    </span>
                                </div>
                                <span className="text-[13px] font-medium text-text">
                                    {formatDate(report.createdAt)}
                                    {report.createdAt &&
                                        ` ${formatTime(report.createdAt)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyReportDrawer;
