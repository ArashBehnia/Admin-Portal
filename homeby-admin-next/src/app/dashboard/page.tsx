import { fetchDashboardData } from './actions';
import DashboardPageClient from './_components/DashboardPageClient';

const DashboardPage = async () => {
    const initialData = await fetchDashboardData();

    return <DashboardPageClient initialData={initialData} />;
};

export default DashboardPage;