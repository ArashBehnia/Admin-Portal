"use client";

import type { ApplicationListItemDto, ApplicationSummaryDto } from "@/types/applicationTypes";
import useApplications from "@/hooks/useApplications";
import ApplicationStats from "@/components/Applications/ApplicationStats";
import ApplicationsTable from "@/components/Applications/ApplicationsTable";
import ApplicationDrawer from "@/components/Applications/ApplicationDrawer";

function formatStatus(status: string): "Pending" | "Approved" | "Rejected" | "Awaiting info" {
    const s = status?.toLowerCase();
    if (s === "pending") return "Pending";
    if (s === "approved") return "Approved";
    if (s === "rejected") return "Rejected";
    return "Pending";
}

function formatTimeAgo(dateStr?: string): string {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
}

interface ApplicationsPageClientProps {
    initialApplications: ApplicationListItemDto[];
    initialStats: ApplicationSummaryDto;
}

const ApplicationsPageClient = ({
    initialApplications,
    initialStats,
}: ApplicationsPageClientProps) => {
    console.log("[ApplicationsPageClient] initialApplications:", JSON.stringify(initialApplications).slice(0, 1000));
    console.log("[ApplicationsPageClient] initialStats:", JSON.stringify(initialStats));

    const mappedApplications = initialApplications.map((item) => {
        const raw = item as unknown as Record<string, unknown>;
        console.log("[ApplicationsPageClient] raw item keys:", Object.keys(raw), "data:", JSON.stringify(raw).slice(0, 300));
        const name = (raw.name ?? raw.applicantName ?? raw.fullName ?? raw.userName ?? raw.contactName ?? "") as string;
        const email = (raw.email ?? raw.emailAddress ?? "") as string;
        const agency = (raw.agency ?? raw.agencyName ?? raw.companyName ?? raw.organisation ?? "") as string;
        const crm = (raw.crm ?? raw.crmPlatform ?? raw.crmType ?? raw.integrationType ?? "") as string;
        const submittedAt = (raw.submittedAt ?? raw.createdAt ?? raw.createdDate ?? raw.applicationDate ?? raw.submittedDate ?? "") as string;
        const phone = (raw.phone ?? raw.phoneNumber ?? raw.mobile ?? "") as string | undefined;

        return {
            id: String(item.id ?? ""),
            name,
            email,
            agency,
            crm,
            submitted: formatTimeAgo(submittedAt),
            status: formatStatus(item.status),
            phone,
        };
    });

    const mappedStats = {
        total: initialStats.total,
        pending: initialStats.pending,
        approvedThisMonth: initialStats.approved,
        rejected: initialStats.rejected,
    };

    const {
        filteredApplications,
        stats,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        selectedApp,
        activeDrawerTab,
        setActiveDrawerTab,
        notes,
        setNotes,
        noteMessage,
        isSavingNote,
        timeline,
        isTimelineLoading,
        openDrawer,
        closeDrawer,
        handleApprove,
        handleReject,
        handleRequestInfo,
        handleSaveNote,
        loadTimeline,
    } = useApplications({
        initialApplications: mappedApplications,
        initialStats: mappedStats,
    });

    return (
        <div className="flex flex-col gap-6 w-full max-w-content mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-bold text-text leading-tight">
                    Applications
                </h1>
                <p className="text-[13px] text-muted">
                    Review and process incoming agent registration requests.
                </p>
            </div>

            <ApplicationStats stats={stats} />

            <ApplicationsTable
                filteredApplications={filteredApplications}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                selectedAppId={selectedApp?.id}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
                onReviewClick={openDrawer}
                onApprove={handleApprove}
                onReject={(id) => handleReject(id)}
            />

            {selectedApp && (
                <ApplicationDrawer
                    selectedApp={selectedApp}
                    activeDrawerTab={activeDrawerTab}
                    notes={notes}
                    noteMessage={noteMessage}
                    isSavingNote={isSavingNote}
                    timeline={timeline}
                    isTimelineLoading={isTimelineLoading}
                    onTabChange={setActiveDrawerTab}
                    onClose={closeDrawer}
                    onNotesChange={setNotes}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                    onSaveNote={handleSaveNote}
                    onLoadTimeline={loadTimeline}
                />
            )}
        </div>
    );
};

export default ApplicationsPageClient;
