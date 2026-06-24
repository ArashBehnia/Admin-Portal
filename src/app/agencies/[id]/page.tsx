import {
    fetchAgencyDetailData,
} from "@/actions/agenciesActions";
import { fetchAgenciesData } from "@/actions/agenciesListActions";
import { fetchAgencyDetail } from "@/lib/agency-service";
import AgencyDetailClient from "@/components/AgencyDetail/AgencyDetailClient";
import type { Agency } from "@/types/agencyTypes";

interface PageProps {
    params: Promise<{ id: string }>;
}

const AgencyDetailPage = async ({ params }: PageProps) => {
    const { id } = await params;

    let agency: Agency | undefined;
    let detailData;

    try {
        detailData = await fetchAgencyDetail(id);
        const { agencies } = await fetchAgenciesData(0, 100);
        agency = agencies.find((a: Agency) => a.id === id);
    } catch {
        detailData = await fetchAgencyDetailData();
    }

    if (!agency) {
        const { agencies } = await fetchAgenciesData(0, 100);
        agency = agencies.find((a: Agency) => a.id === id) ?? agencies[0];
    }

    if (!agency) {
        agency = {
            id,
            name: "Agency",
            location: "",
            subscription: "Trial",
            onboarding: "Pending",
            listings: 0,
            agents: 0,
            feed: "Not configured",
            mrr: "$0/mo",
            lastActivity: "Never",
            highlight: null,
        };
    }

    return (
        <AgencyDetailClient
            agencyId={id}
            agency={agency}
            detailData={detailData}
        />
    );
};

export default AgencyDetailPage;
