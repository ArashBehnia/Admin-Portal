import { backendFetch } from "@/lib/api";
import type {
    BlockedIpListItemDto,
    BlockedIpPageDto,
    BlockedIpFilters,
    CreateBlockPayload,
    CreateBlockResponse,
    RemoveBlockPayload,
    RemoveBlockResponse,
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
    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    if (filters?.strategy) params.set("strategy", filters.strategy);
    if (filters?.reason) params.set("reason", filters.reason);
    if (filters?.filter) params.set("filter", filters.filter);

    const raw = await backendFetch<unknown>(
        `/admin/security/ip-blocklist/page?${params.toString()}`,
    );
    const items = toArray<BlockedIpListItemDto>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total, page, limit };
}

export async function createBlock(
    payload: CreateBlockPayload,
): Promise<CreateBlockResponse> {
    const body: Record<string, unknown> = {
        ip: payload.ip,
        reason: payload.reason,
    };
    if (payload.ttlSeconds != null && payload.ttlSeconds !== undefined) {
        body.ttlSeconds = payload.ttlSeconds;
    }

    return backendFetch<CreateBlockResponse>(
        "/admin/security/ip-blocklist/block",
        {
            method: "POST",
            body: JSON.stringify(body),
        },
    );
}

export async function removeBlock(
    payload: RemoveBlockPayload,
): Promise<RemoveBlockResponse> {
    return backendFetch<RemoveBlockResponse>(
        "/admin/security/ip-blocklist/remove",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
}
