import { fetchFtpRequestsPage } from "@/lib/ftp-request-service";
import type {
    FtpRequestListItemDto,
    FtpRequestsData,
} from "@/types/ftpRequestTypes";

function mapRequest(item: FtpRequestListItemDto) {
    return {
        id: item.id,
        agencyName: item.agency?.name ?? "",
        agentName: `${item.agent?.firstName ?? ""} ${item.agent?.lastName ?? ""}`.trim(),
        agentEmail: item.agent?.email ?? "",
        email: item.email ?? "",
        allowedIp: item.allowedIp ?? "",
        ftpUsername: item.ftpUsername ?? "",
        status: item.status ?? "",
        requestedAt: item.requestedAt ?? "",
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
