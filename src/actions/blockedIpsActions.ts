import { fetchBlockedIpsPage } from "@/lib/blocked-ip-service";
import type {
    BlockedIpListItemDto,
    BlockedIpsData,
} from "@/types/blockedIpTypes";

function mapEntry(item: BlockedIpListItemDto) {
    return {
        id: item.key || "",
        key: item.key || "",
        ipOrUser: item.ip || item.identity || "",
        strategy: item.strategy ?? "",
        reason: item.reason ?? "",
        blockedAt: item.blockedAt ?? "",
        ttl: item.ttlSeconds ? String(item.ttlSeconds) : "",
        meta: item.meta ?? "",
    };
}

export const fetchBlockedIpsData = async (
    limit = 20,
): Promise<BlockedIpsData> => {
    try {
        const result = await fetchBlockedIpsPage(1, limit);
        const entries = (result.data ?? []).map(mapEntry);
        return { entries, total: result.total };
    } catch (err) {
        console.error("Failed to fetch blocked IPs:", err);
        return { entries: [], total: 0 };
    }
};
