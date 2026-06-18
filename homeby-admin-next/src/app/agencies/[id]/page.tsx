import {
    fetchAgencyDetailData,
} from "@/actions/agenciesActions";
import { fetchAgenciesData } from "@/actions/agenciesListActions";
import AgencyDetailClient from "@/components/AgencyDetail/AgencyDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

const AgencyDetailPage = async ({ params }: PageProps) => {
    const { id } = await params;
    const { agencies } = await fetchAgenciesData();
    const agency = agencies.find((a) => a.id === id) ?? agencies[0];
    const detailData = await fetchAgencyDetailData();

    return <AgencyDetailClient agency={agency} detailData={detailData} />;
};

export default AgencyDetailPage;
