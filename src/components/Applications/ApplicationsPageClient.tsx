"use client";

import { RefreshCw } from "lucide-react";
import type { ApplicationListItemDto, ApplicationSummaryDto } from "@/types/applicationTypes";
import useApplications from "@/hooks/useApplications";
import ApplicationStats from "@/components/Applications/ApplicationStats";
import ApplicationsTable from "@/components/Applications/ApplicationsTable";
import ApplicationDrawer from "@/components/Applications/ApplicationDrawer";
import ApproveModal from "@/components/Applications/ApproveModal";
import RejectModal from "@/components/Applications/RejectModal";
import Toast from "@/components/Shared/Toast";

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
        const nested = (raw.data ?? {}) as Record<string, unknown>;
        const user = (raw.user ?? {}) as Record<string, unknown>;

        const firstName = (nested.agentFirstName ?? user.firstName ?? "") as string;
        const lastName = (nested.agentLastName ?? user.lastName ?? "") as string;
        const name = `${firstName} ${lastName}`.trim();
        const email = (nested.agentEmail ?? user.email ?? "") as string;
        const agency = (nested.agencyLegalName ?? "") as string;
        const crm = (nested.crmSelection ?? nested.crmName ?? "") as string;
        const phone = (nested.agentPhone ?? user.mobile ?? user.phone ?? "") as string;
        const submittedAt = (nested.clientSubmittedAt ?? raw.createdAt ?? "") as string;

        return {
            id: String(item.id ?? ""),
            name,
            email,
            agency,
            crm,
            submitted: formatTimeAgo(submittedAt),
            status: formatStatus(item.status),
            phone,
            rawData: raw,
        };
    });

    const mappedStats = {
        total: initialStats.total,
        pending: initialStats.pending,
        approvedThisMonth: initialStats.approved,
        rejected: initialStats.rejected,
    };

    const {
        applications,
        totalCount,
        stats,
        searchQuery,
        setSearchQuery,
        statusFilter,
        handleStatusFilterChange,
        currentPage,
        handlePageChange,
        isLoading,
        selectedApp,
        activeDrawerTab,
        setActiveDrawerTab,
        notes,
        setNotes,
        isSavingNote,
        toast,
        setToast,
        isApproving,
        isRejecting,
        approveModalApp,
        confirmApprove,
        closeApproveModal,
        rejectModalApp,
        confirmReject,
        closeRejectModal,
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
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-text leading-snug">
                        Applications
                    </h1>
                    <p className="text-[12px] sm:text-[13px] text-muted mt-0.5">
                        Review and process incoming agent registration requests.
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-muted hover:text-text p-2 rounded border border-border hover:bg-page transition-colors self-start shrink-0 cursor-pointer"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <ApplicationStats stats={stats} />

            <ApplicationsTable
                applications={applications}
                totalCount={totalCount}
                currentPage={currentPage}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                selectedAppId={selectedApp?.id}
                isLoading={isLoading}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={handleStatusFilterChange}
                onPageChange={handlePageChange}
                onReviewClick={openDrawer}
                onApprove={handleApprove}
                onReject={(id) => handleReject(id)}
            />

            {selectedApp && (
                <ApplicationDrawer
                    selectedApp={selectedApp}
                    activeDrawerTab={activeDrawerTab}
                    notes={notes}
                    isSavingNote={isSavingNote}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
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

            {approveModalApp && (
                <ApproveModal
                    app={approveModalApp}
                    isApproving={isApproving}
                    onConfirm={confirmApprove}
                    onCancel={closeApproveModal}
                />
            )}

            {rejectModalApp && (
                <RejectModal
                    app={rejectModalApp}
                    isRejecting={isRejecting}
                    onConfirm={confirmReject}
                    onCancel={closeRejectModal}
                />
            )}

            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default ApplicationsPageClient;
