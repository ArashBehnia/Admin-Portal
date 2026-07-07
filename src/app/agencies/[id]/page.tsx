import { fetchAgenciesData } from "@/actions/agenciesListActions";
import { BackendError } from "@/lib/api";
import { fetchAgencyDetail } from "@/lib/agency-service";
import AgencyDetailClient from "@/components/AgencyDetail/AgencyDetailClient";
import type { Agency } from "@/types/agencyTypes";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AgencyDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let detailData;
  try {
    detailData = await fetchAgencyDetail(id);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { agencies } = await fetchAgenciesData(0, 100);
  let agency = agencies.find((a: Agency) => a.id === id);

  if (!agency) {
    agency = {
      id,
      name: detailData.name || "Agency",
      status: detailData.status || "pending",
      location: "",
      subscription: "Trial",
      onboarding: "Pending",
      listings: detailData.activeListings,
      agents: detailData.activeStaff,
      feed: "Not configured",
      mrr: "$0/mo",
      lastActivity: "Never",
      highlight: null,
    };
  }

  return (
    <AgencyDetailClient agencyId={id} agency={agency} detailData={detailData} />
  );
};

export default AgencyDetailPage;
