import { backendFetch } from "@/lib/api";
import type { Agency, AgencyStats, AgenciesData, AgencyListItemDto } from "../types/agencyTypes";

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

function formatLastActivity(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
}

function mapStatus(status?: string): string {
    if (!status) return "Approved";
    const s = status.toLowerCase();
    if (s === "active" || s === "live") return "Live";
    if (s === "trial") return "Trial";
    if (s === "onboarding") return "Onboarding";
    if (s === "suspended") return "Suspended";
    if (s === "pending") return "Pending";
    return status;
}

function mapHighlight(status?: string): "orange" | "red" | null {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === "suspended") return "red";
    if (s === "warning" || s === "onboarding") return "orange";
    return null;
}

export const fetchAgenciesData = async (
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<AgenciesData> => {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);

    const [summaryRaw, pageRaw] = await Promise.all([
        backendFetch<unknown>("/admin/agencies/summary"),
        backendFetch<unknown>(`/admin/agency/page?${params.toString()}`),
    ]);

    const summaryObj =
        summaryRaw && typeof summaryRaw === "object" && !Array.isArray(summaryRaw)
            ? (summaryRaw as Record<string, unknown>)
            : {};
    const toNum = (v: unknown) =>
        typeof v === "number" ? v : typeof v === "string" ? Number(v) || 0 : 0;

    const items = toArray<AgencyListItemDto>(pageRaw);
    const total = findTotal(pageRaw) || items.length;

    const stats: AgencyStats = {
        total: String(toNum(summaryObj.total)),
        active: String(toNum(summaryObj.active)),
        onboarding: String(toNum(summaryObj.pending)),
        suspended: String(toNum(summaryObj.inactive)),
    };

    const agencies: Agency[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        location: item.location ?? "",
        subscription: item.subscription ?? "Trial",
        onboarding: mapStatus(item.status),
        listings: item.totalListings ?? 0,
        agents: item.activeStaff ?? item.totalStaff ?? 0,
        feed: item.feedStatus ?? "Not configured",
        mrr: item.mrr ?? "$0/mo",
        lastActivity: formatLastActivity(item.lastActivityAt),
        highlight: mapHighlight(item.status),
    }));

    return { stats, agencies, total };
};
