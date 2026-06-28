"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Agency, AgencyTab, AgencyDetailData } from "@/actions/agenciesActions";
import useAgencyDetail from "@/hooks/useAgencyDetail";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import AgencyHeader from "./AgencyHeader";
import AgencyTabs from "./AgencyTabs";
import OverviewTab from "./OverviewTab";
import AgentsTab from "./AgentsTab";
import ListingsTab from "./ListingsTab";
import NotesTab from "./NotesTab";
import ComingSoon from "./ComingSoon";

interface AgencyDetailClientProps {
  agencyId: string;
  agency: Agency;
  detailData: AgencyDetailData;
}

const AgencyDetailClient = ({
  agencyId,
  agency,
  detailData,
}: AgencyDetailClientProps) => {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    detailData: currentDetailData,
    onboardingSteps,
    onboardingCurrentStep,
    notes,
    isNotesLoading,
    isNotesSaving,
    newNoteText,
    setNewNoteText,
    addNote,
    getInitials,
    agents,
    isAgentsLoading,
    fetchAgents,
  } = useAgencyDetail({ agencyId, detailData });

  const { setDynamicCrumb } = useBreadcrumb();

  useEffect(() => {
    if (agency?.name) {
      setDynamicCrumb(agency.name);
    }
    return () => setDynamicCrumb(null);
  }, [agency?.name, setDynamicCrumb]);

  const handleTabChange = (tab: AgencyTab) => {
    setActiveTab(tab);
    if (tab === "Agents" && agents.length === 0) {
      fetchAgents();
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <Link href="/agencies" className="hover:text-text transition-colors">
          Agencies
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text font-medium">{agency?.name}</span>
      </div>

      <AgencyHeader
        agency={agency}
        agencyId={agencyId}
        abn={currentDetailData?.abn ?? ""}
        memberSince={currentDetailData?.memberSince ?? ""}
        activeListings={currentDetailData?.activeListings ?? 0}
        activeAgents={currentDetailData?.activeStaff ?? 0}
        initials={getInitials(agency?.name ?? "")}
        editData={{
          name: agency?.name ?? "",
          email: currentDetailData?.email ?? "",
          phone: currentDetailData?.phone ?? "",
          website: currentDetailData?.website ?? "",
        }}
        onSuspendSuccess={() => router.refresh()}
        onEditSuccess={() => router.refresh()}
        onDeleteSuccess={() => router.push("/agencies")}
      />

      <AgencyTabs activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "Overview" && (
        <OverviewTab
          activityTimeline={currentDetailData?.activityTimeline ?? []}
          distributionPortals={currentDetailData?.distributionPortals ?? []}
          notes={notes}
          crmProvider={currentDetailData?.crmProvider ?? ""}
          feedLastSynced={currentDetailData?.feedLastSynced ?? ""}
          onEditNotesClick={setActiveTab}
          onboardingSteps={onboardingSteps}
          onboardingCurrentStep={onboardingCurrentStep}
        />
      )}

      {activeTab === "Agents" && (
        <AgentsTab agents={agents} isLoading={isAgentsLoading} />
      )}

      {activeTab === "Listings" &&
        ((currentDetailData?.listings ?? []).length > 0 ? (
          <ListingsTab listings={currentDetailData?.listings ?? []} />
        ) : (
          <ComingSoon
            title="Listings"
            description="Detailed listing data will be available when the listings integration is connected."
          />
        ))}

      {activeTab === "Subscription & Billing" && (
        <ComingSoon
          title="Subscription & Billing"
          description={
            currentDetailData?.billing?.reason ??
            "Subscription management and billing features will be available in a future release."
          }
        />
      )}

      {activeTab === "Reviews" && (
        <ComingSoon
          title="Reviews"
          description="Agency review management will be available in a future release."
        />
      )}

      {activeTab === "Notes" && (
        <NotesTab
          notes={notes}
          isLoading={isNotesLoading}
          isSaving={isNotesSaving}
          newNoteText={newNoteText}
          onNewNoteChange={setNewNoteText}
          onAddNote={addNote}
        />
      )}

      {activeTab === "Audit" && (
        <ComingSoon
          title="Audit Log"
          description="Audit trail and activity logging will be available in a future release."
        />
      )}
    </div>
  );
};

export default AgencyDetailClient;
