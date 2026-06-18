import { backendFetch } from "@/lib/api";
import type {
    AgentSummaryDto,
    AgentListItemDto,
    AgentOverviewDto,
    AgentActivityDto,
} from "@/types/agentTypes";

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

function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value.replace(/[^0-9.\-]/g, "")) || fallback;
    return fallback;
}

function findTotal(obj: unknown): number {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const o = obj as Record<string, unknown>;
        if (typeof o.total === "number") return o.total;
        if (typeof o.totalCount === "number") return o.totalCount;
        if (typeof o.count === "number") return o.count;
        if (o.meta && typeof o.meta === "object") {
            const m = o.meta as Record<string, unknown>;
            if (typeof m.total === "number") return m.total;
        }
    }
    return 0;
}

export async function fetchAgentsSummary(): Promise<AgentSummaryDto> {
    const raw = await backendFetch<unknown>("/admin/agents/summary");
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        total: toNumber(obj.total),
        active: toNumber(obj.active),
        inactive: toNumber(obj.inactive),
        ftp_enabled: toNumber(obj.ftp_enabled),
        active_listings: toNumber(obj.active_listings),
    };
}

export async function fetchAgentsPage(
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<{ data: AgentListItemDto[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);

    const raw = await backendFetch<unknown>(
        `/admin/agency-staff/page?${params.toString()}`,
    );

    const items = toArray<AgentListItemDto>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total };
}

export async function fetchAgentOverview(
    id: string,
): Promise<AgentOverviewDto> {
    const raw = await backendFetch<unknown>(`/admin/agents/${id}/overview`);
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        id: String(obj.id ?? id),
        email: obj.email ? String(obj.email) : undefined,
        mobile: obj.mobile ? String(obj.mobile) : undefined,
        role: obj.role ? String(obj.role) : undefined,
        status: String(obj.status ?? "unknown"),
        isActive: Boolean(obj.isActive),
        firstName: obj.firstName ? String(obj.firstName) : undefined,
        lastName: obj.lastName ? String(obj.lastName) : undefined,
        agencyId: obj.agencyId ? String(obj.agencyId) : undefined,
        agencyName: obj.agencyName ? String(obj.agencyName) : undefined,
        activeListings: toNumber(obj.activeListings),
        totalListings: toNumber(obj.totalListings),
        sales12m: toNumber(obj.sales12m),
        performanceValue: toNumber(obj.performanceValue),
        totalViews: toNumber(obj.totalViews),
    };
}

export async function fetchAgentActivity(
    id: string,
    limit = 20,
): Promise<AgentActivityDto> {
    const params = new URLSearchParams({ limit: String(limit) });
    const raw = await backendFetch<unknown>(
        `/admin/agents/${id}/activity?${params.toString()}`,
    );
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        data: toArray(obj.data ?? raw),
        limit: toNumber(obj.limit, limit),
    };
}
