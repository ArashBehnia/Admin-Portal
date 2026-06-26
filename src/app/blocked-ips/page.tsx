import { fetchBlockedIpsData } from "@/actions/blockedIpsActions";
import BlockedIpsPageClient from "@/components/BlockedIps/BlockedIpsPageClient";

const BlockedIpsPage = async () => {
    const initialData = await fetchBlockedIpsData();
    return <BlockedIpsPageClient initialData={initialData} />;
};

export default BlockedIpsPage;
