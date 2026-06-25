import { fetchFtpRequestsData } from "@/actions/ftpRequestsActions";
import FtpRequestsPageClient from "@/components/FtpRequests/FtpRequestsPageClient";

const FtpRequestsPage = async () => {
    const initialData = await fetchFtpRequestsData();
    return <FtpRequestsPageClient initialData={initialData} />;
};

export default FtpRequestsPage;
