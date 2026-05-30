"use client";

import { Application } from "@/actions/applicationsActions";
import useApplications from "@/hooks/useApplications";
import ApplicationStats from "@/components/Applications/ApplicationStats";
import ApplicationsTable from "@/components/Applications/ApplicationsTable";
import ApplicationDrawer from "@/components/Applications/ApplicationDrawer";

interface ApplicationsPageClientProps {
    initialApplications: Application[];
}

const ApplicationsPageClient = ({
    initialApplications,
}: ApplicationsPageClientProps) => {
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
        openDrawer,
        closeDrawer,
        handleApprove,
        handleReject,
        handleRequestInfo,
    } = useApplications({ initialApplications });

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
                onReject={handleReject}
            />

            {selectedApp && (
                <ApplicationDrawer
                    selectedApp={selectedApp}
                    activeDrawerTab={activeDrawerTab}
                    notes={notes}
                    onTabChange={setActiveDrawerTab}
                    onClose={closeDrawer}
                    onNotesChange={setNotes}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                />
            )}
        </div>
    );
};

export default ApplicationsPageClient;
