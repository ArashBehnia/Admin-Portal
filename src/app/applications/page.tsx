import { fetchApplications } from "@/actions/applicationsActions";
import ApplicationsPageClient from "@/components/Applications/ApplicationsPageClient";

const ApplicationsPage = async () => {
    const data = await fetchApplications();

    return (
        <ApplicationsPageClient
            initialApplications={data.applications}
            initialStats={data.summary}
        />
    );
};

export default ApplicationsPage;
