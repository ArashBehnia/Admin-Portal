import { fetchApplications } from "@/actions/applicationsActions";
import ApplicationsPageClient from "@/components/Applications/ApplicationsPageClient";

const ApplicationsPage = async () => {
    const initialApplications = await fetchApplications();

    return <ApplicationsPageClient initialApplications={initialApplications} />;
};

export default ApplicationsPage;
