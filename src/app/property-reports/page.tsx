import { fetchPropertyReportsData } from "@/actions/propertyReportsActions";
import PropertyReportsPageClient from "@/components/PropertyReports/PropertyReportsPageClient";

const PropertyReportsPage = async () => {
    const initialData = await fetchPropertyReportsData();
    return <PropertyReportsPageClient initialData={initialData} />;
};

export default PropertyReportsPage;
