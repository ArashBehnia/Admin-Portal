import { backendFetch } from "@/lib/api";
import type {
    AgencySummaryDto,
    AgencyListItemDto,
    AgencyOverviewDto,
} from "@/types/agencyTypes";

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

export async function fetchAgenciesSummary(): Promise<AgencySummaryDto> {
    const raw = await backendFetch<unknown>("/admin/agencies/summary");
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        total: toNumber(obj.total),
        active: toNumber(obj.active),
        inactive: toNumber(obj.inactive),
        pending: toNumber(obj.pending),
        with_listings: toNumber(obj.with_listings),
    };
}

export async function fetchAgenciesPage(
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<{ data: AgencyListItemDto[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);

    const raw = await backendFetch<unknown>(
        `/admin/agency/page?${params.toString()}`,
    );

    const items = toArray<AgencyListItemDto>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total };
}

export async function fetchAgencyOverview(
    id: string,
): Promise<AgencyOverviewDto> {
    const raw = await backendFetch<unknown>(`/admin/agencies/${id}/overview`);
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        id: toNumber(obj.id) ? String(obj.id) : id,
        name: String(obj.name ?? ""),
        status: String(obj.status ?? "unknown"),
        email: obj.email ? String(obj.email) : undefined,
        phone: obj.phone ? String(obj.phone) : undefined,
        website: obj.website ? String(obj.website) : undefined,
        totalStaff: toNumber(obj.totalStaff),
        activeStaff: toNumber(obj.activeStaff),
        totalListings: toNumber(obj.totalListings),
        activeListings: toNumber(obj.activeListings),
        sales12m: toNumber(obj.sales12m),
        lastActivityAt: obj.lastActivityAt ? String(obj.lastActivityAt) : undefined,
    };
}
