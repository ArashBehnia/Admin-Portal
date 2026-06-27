import { fetchFtpRequestsPage } from "@/lib/ftp-request-service";
import type {
    FtpRequestListItemDto,
    FtpRequestsData,
} from "@/types/ftpRequestTypes";

function mapRequest(item: FtpRequestListItemDto) {
    return {
        id: item.id,
        agencyName: item.agencyName ?? "",
        agentName: item.agentName ?? "",
        agentEmail: item.agentEmail ?? "",
        allowedIp: item.requestedIp ?? "",
        ftpUsername: item.ftpUsername ?? "",
        status: item.status ?? "",
        requestedAt: item.createdAt ?? "",
    };
}

export const fetchFtpRequestsData = async (
    page = 1,
    limit = 20,
): Promise<FtpRequestsData> => {
    try {
        const result = await fetchFtpRequestsPage(page, limit);
        const requests = (result.data ?? []).map(mapRequest);
        return { requests, total: result.total };
    } catch (err) {
        console.error("Failed to fetch FTP requests:", err);
        return { requests: [], total: 0 };
    }
};
