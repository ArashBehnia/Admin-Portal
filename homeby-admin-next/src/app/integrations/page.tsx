import { fetchIntegrationsData } from "@/actions/integrationsActions";
import IntegrationsPageClient from "@/components/Integrations/IntegrationsPageClient";

const IntegrationsPage = async () => {
    const initialData = await fetchIntegrationsData();
    return <IntegrationsPageClient initialData={initialData} />;
};

export default IntegrationsPage;
