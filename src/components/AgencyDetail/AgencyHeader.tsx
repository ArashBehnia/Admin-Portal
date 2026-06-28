"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Agency } from "@/actions/agenciesActions";
import {
    SubscriptionBadge,
    OnboardingBadge,
} from "@/components/Agencies/AgencyBadges";
import SuspendAgencyModal from "./SuspendAgencyModal";
import EditAgencySidebar, { EditAgencyData } from "./EditAgencySidebar";

interface AgencyHeaderProps {
    agency: Agency;
    agencyId: string;
    abn: string;
    memberSince: string;
    activeListings: number;
    activeAgents: number;
    initials: string;
    editData: EditAgencyData;
    onSuspendSuccess: () => void;
    onEditSuccess: () => void;
}

const AgencyHeader = ({
    agency,
    agencyId,
    abn,
    memberSince,
    activeListings,
    activeAgents,
    initials,
    editData,
    onSuspendSuccess,
    onEditSuccess,
}: AgencyHeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);

    return (
        <>
            <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-page flex items-center justify-center text-[16px] font-bold text-text shrink-0">
                            {initials}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-[20px] font-bold text-text leading-tight">
                                {agency?.name}
                            </h1>
                            <div className="flex items-center gap-3 text-[12px] text-muted">
                                <span>{agency?.location}</span>
                                <span>ABN: {abn}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <SubscriptionBadge type={agency?.subscription ?? ""} />
                                <OnboardingBadge status={agency?.onboarding ?? ""} />
                                <div className="flex items-center gap-1.5 ml-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[11px] font-medium text-text">
                                        {agency?.feed}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-muted hover:text-text p-1 rounded transition-colors focus:outline-none border border-border cursor-pointer"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 py-1.5 overflow-hidden"
                                onMouseLeave={() => setIsMenuOpen(false)}
                            >
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsEditSidebarOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] text-text hover:bg-page cursor-pointer"
                                >
                                    Edit details
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full text-left px-4 py-2 text-[13px] text-text hover:bg-page cursor-pointer"
                                >
                                    Change subscription tier
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full text-left px-4 py-2 text-[13px] text-text hover:bg-page cursor-pointer"
                                >
                                    Send invitation
                                </button>
                                <div className="border-t border-border my-1" />
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsSuspendModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] text-orange-600 hover:bg-orange-50 cursor-pointer"
                                >
                                    Suspend agency
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                    Archive agency
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-border">
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-muted">Active listings</span>
                        <span className="text-[18px] font-bold text-text">{activeListings}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-muted">Active agents</span>
                        <span className="text-[18px] font-bold text-text">{activeAgents}</span>
                    </div>
                    <div className="flex flex-col gap-1 opacity-40">
                        <span className="text-[12px] text-muted">MRR</span>
                        <span className="text-[18px] font-bold text-text">—</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-muted">Member since</span>
                        <span className="text-[18px] font-bold text-text">{memberSince || "—"}</span>
                    </div>
                </div>
            </div>

            <SuspendAgencyModal
                isOpen={isSuspendModalOpen}
                agencyId={agencyId}
                agencyName={agency?.name ?? ""}
                onClose={() => setIsSuspendModalOpen(false)}
                onSuccess={onSuspendSuccess}
            />

            <EditAgencySidebar
                isOpen={isEditSidebarOpen}
                agencyId={agencyId}
                initialData={editData}
                onClose={() => setIsEditSidebarOpen(false)}
                onSuccess={onEditSuccess}
            />
        </>
    );
};

export default AgencyHeader;