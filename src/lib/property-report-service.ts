import { backendFetch } from "@/lib/api";
import type {
    PropertyReportListItemDto,
    PropertyReportPageDto,
    PropertyReportFilters,
} from "@/types/propertyReportTypes";

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

export async function fetchPropertyReportsPage(
    offset = 0,
    limit = 20,
    filters?: PropertyReportFilters,
): Promise<PropertyReportPageDto> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    if (filters?.type) params.set("type", filters.type);
    if (filters?.createdAtGte) params.set("createdAt.gte", filters.createdAtGte);
    if (filters?.createdAtLte) params.set("createdAt.lte", filters.createdAtLte);
    if (filters?.filter) params.set("filter", filters.filter);

    const raw = await backendFetch<unknown>(
        `/admin/property-reports/page?${params.toString()}`,
    );

    const items = toArray<PropertyReportListItemDto>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total, offset, limit };
}
