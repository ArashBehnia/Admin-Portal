import { fetchAgenciesData } from "@/actions/agenciesActions";
import AgenciesPageClient from "@/components/Agencies/AgenciesPageClient";

const AgenciesPage = async () => {
    const initialData = await fetchAgenciesData();
    return <AgenciesPageClient initialData={initialData} />;
};

export default AgenciesPage;
