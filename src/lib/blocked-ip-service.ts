import { backendFetch } from "@/lib/api";
import type {
    BlockedIpListItemDto,
    BlockedIpPageDto,
    BlockedIpFilters,
} from "@/types/blockedIpTypes";

function toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.results)) return obj.results as T[];
        for (const v of Object.values(obj)) {
            if (Array.isArray(v)) return v as T[];
        }
    }
    return [];
}

function findTotal(obj: unknown): number {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const o = obj as Record<string, unknown>;
        if (typeof o.total === "number") return o.total;
        if (typeof o.totalCount === "number") return o.totalCount;
        if (typeof o.count === "number") return o.count;
    }
    return 0;
}

export async function fetchBlockedIpsPage(
    page = 1,
    limit = 20,
    filters?: BlockedIpFilters,
): Promise<BlockedIpPageDto> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (filters?.strategy) params.set("strategy", filters.strategy);
    if (filters?.reason) params.set("reason", filters.reason);
    if (filters?.filter) params.set("filter", filters.filter);

    const raw = await backendFetch<unknown>(
        `/admin/security/ip-blocklist/page?${params.toString()}`,
    );
    // console.log("raw", raw);
    const items = toArray<BlockedIpListItemDto>(raw);
    // console.log("items", items);
    const total = findTotal(raw) || items.length;

    return { data: items, total, page: 1, limit };
}
