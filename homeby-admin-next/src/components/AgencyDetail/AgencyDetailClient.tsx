"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Agency } from "@/actions/agenciesActions";
import { AgencyDetailData } from "@/actions/agenciesActions";
import useAgencyDetail from "@/hooks/useAgencyDetail";
import AgencyHeader from "./AgencyHeader";
import AgencyTabs from "./AgencyTabs";
import OverviewTab from "./OverviewTab";
import AgentsTab from "./AgentsTab";
import ListingsTab from "./ListingsTab";
import BillingTab from "./BillingTab";
import ReviewsTab from "./ReviewsTab";
import NotesTab from "./NotesTab";
import AuditTab from "./AuditTab";

interface AgencyDetailClientProps {
    agency: Agency;
    detailData: AgencyDetailData;
}

const AgencyDetailClient = ({
    agency,
    detailData,
}: AgencyDetailClientProps) => {
    const { activeTab, setActiveTab, notes, setNotes, getInitials } =
        useAgencyDetail({ detailData });

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-muted">
                <Link
                    href="/agencies"
                    className="hover:text-text transition-colors"
                >
                    Agencies
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-text font-medium">{agency?.name}</span>
            </div>

            <AgencyHeader
                agency={agency}
                abn={detailData?.abn ?? ""}
                memberSince={detailData?.memberSince ?? ""}
                initials={getInitials(agency?.name ?? "")}
            />

            <AgencyTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "Overview" && (
                <OverviewTab
                    activityTimeline={detailData?.activityTimeline ?? []}
                    distributionPortals={detailData?.distributionPortals ?? []}
                    internalNotes={detailData?.internalNotes ?? ""}
                    crmProvider={detailData?.crmProvider ?? ""}
                    feedLastSynced={detailData?.feedLastSynced ?? ""}
                    onEditNotesClick={setActiveTab}
                />
            )}

            {activeTab === "Agents" && (
                <AgentsTab agents={detailData?.agents ?? []} />
            )}

            {activeTab === "Listings" && (
                <ListingsTab listings={detailData?.listings ?? []} />
            )}

            {activeTab === "Subscription & Billing" && (
                <BillingTab
                    agency={agency}
                    invoices={detailData?.invoices ?? []}
                />
            )}

            {activeTab === "Reviews" && (
                <ReviewsTab reviews={detailData?.reviews ?? []} />
            )}

            {activeTab === "Notes" && (
                <NotesTab notes={notes} onNotesChange={setNotes} />
            )}

            {activeTab === "Audit" && (
                <AuditTab auditLog={detailData?.auditLog ?? []} />
            )}
        </div>
    );
};

export default AgencyDetailClient;
