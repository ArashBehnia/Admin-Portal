import { fetchDashboardData } from "@/actions/dashboardActions";
import DashboardPageClient from "@/components/Dashboard/DashboardPageClient";

const DashboardPage = async () => {
    const initialData = await fetchDashboardData();

    return <DashboardPageClient initialData={initialData} />;
};

export default DashboardPage;