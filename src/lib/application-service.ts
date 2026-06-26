import { backendFetch } from "@/lib/api";
import type {
    ApplicationSummaryDto,
    ApplicationListItemDto,
    ApplicationTimeline,
} from "@/types/applicationTypes";

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

export async function fetchApplicationsSummary(): Promise<ApplicationSummaryDto> {
    // console.log("[application-service] fetchApplicationsSummary -> GET /admin/applications/summary");
    const raw = await backendFetch<unknown>("/admin/applications/summary");
    // console.log("[application-service] fetchApplicationsSummary raw:", JSON.stringify(raw));
    const obj =
        raw && typeof raw === "object" && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {};
    return {
        total: toNumber(obj.total),
        pending: toNumber(obj.pending),
        approved: toNumber(obj.approved),
        rejected: toNumber(obj.rejected),
        newToday: toNumber(obj.newToday),
    };
}

export async function fetchApplicationsPage(
    offset = 0,
    limit = 20,
    status?: string,
    filter?: string,
): Promise<{ data: ApplicationListItemDto[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (status) params.set("status", status);
    if (filter) params.set("filter", filter);

    // console.log("[application-service] fetchApplicationsPage -> GET /admin/agent-portal/page?", params.toString());
    const raw = await backendFetch<unknown>(
        `/admin/agent-portal/page?${params.toString()}`,
    );
    // console.log("[application-service] fetchApplicationsPage raw:", JSON.stringify(raw).slice(0, 500));

    const items = toArray<ApplicationListItemDto>(raw);
    const total = findTotal(raw) || items.length;

    return { data: items, total };
}

export async function generateApplication(
    applicationId: string,
): Promise<unknown> {
    return backendFetch<unknown>(
        `/admin/agent-portal/${applicationId}/generate`,
        {
            method: "POST",
            body: JSON.stringify({}),
        },
    );
}

export async function rejectApplication(
    applicationId: string,
    reason: string,
): Promise<unknown> {
    return backendFetch<unknown>(
        `/admin/agent-portal/${applicationId}/reject`,
        {
            method: "POST",
            body: JSON.stringify({ reason }),
        },
    );
}

export async function addApplicationNote(
    applicationId: string,
    note: string,
): Promise<unknown> {
    return backendFetch<unknown>(
        `/admin/applications/${applicationId}/notes`,
        {
            method: "POST",
            body: JSON.stringify({ note }),
        },
    );
}

export async function fetchApplicationTimeline(
    applicationId: string,
): Promise<ApplicationTimeline> {
    const raw = await backendFetch<unknown>(
        `/admin/applications/${applicationId}/timeline`,
    );
    return toArray(raw);
}
