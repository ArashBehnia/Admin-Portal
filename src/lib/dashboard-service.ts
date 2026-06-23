import { backendFetch } from "@/lib/api";
import type {
    OverviewData,
    AttentionItem,
    OnboardingPipeline,
    UserActivityPoint,
    Hotspot,
} from "@/actions/dashboardActions";

function toNum(v: unknown, fallback = 0): number {
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v.replace(/[^0-9.\-]/g, "")) || fallback;
    return fallback;
}

function toStr(v: unknown, fallback = ""): string {
    if (v == null) return fallback;
    return String(v);
}

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

function toObject(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>;
        if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
            return obj.data as Record<string, unknown>;
        }
        return obj;
    }
    return {};
}

function normalizeKpi(raw: unknown): { value: string; trend: string; trendType: "success" | "warning" | "danger" } {
    if (raw && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        return {
            value: toStr(o.value ?? o.count ?? o.total ?? o.number ?? "0"),
            trend: toStr(o.trend ?? o.change ?? o.label ?? ""),
            trendType: (o.trendType ?? o.type ?? "success") as "success" | "warning" | "danger",
        };
    }
    if (typeof raw === "number" || typeof raw === "string") {
        return { value: String(raw), trend: "", trendType: "success" };
    }
    return { value: "–", trend: "No data", trendType: "warning" };
}

export async function fetchOverview(): Promise<OverviewData> {
    const raw = await backendFetch("/admin/dashboard/overview");
    const data = toObject(raw);

    const kpiKeys = ["activeAgencies", "pendingApplications", "feedFailures", "mrr"];
    const hasKpis = data.kpis || kpiKeys.every((k) => k in data);

    if (hasKpis) {
        const kpis = toObject(data.kpis || data);
        return {
            kpis: {
                activeAgencies: normalizeKpi(kpis.activeAgencies ?? data.activeAgencies),
                pendingApplications: normalizeKpi(kpis.pendingApplications ?? data.pendingApplications),
                feedFailures: normalizeKpi(kpis.feedFailures ?? data.feedFailures),
                mrr: normalizeKpi(kpis.mrr ?? data.mrr),
            },
            systemHealth: normalizeSystemHealth(data.systemHealth || data),
        };
    }

    return {
        kpis: {
            activeAgencies: normalizeKpi(data.activeAgencies ?? data.active_agencies),
            pendingApplications: normalizeKpi(data.pendingApplications ?? data.pending_applications),
            feedFailures: normalizeKpi(data.feedFailures ?? data.feed_failures),
            mrr: normalizeKpi(data.mrr ?? data.MRR ?? data.revenue),
        },
        systemHealth: normalizeSystemHealth(data.systemHealth || data),
    };
}

function normalizeSystemHealth(raw: unknown): OverviewData["systemHealth"] {
    const data = toObject(raw);
    return {
        apiStatus: {
            status: toStr(data.apiStatus ?? data.api_status ?? "Unknown"),
            type: (data.apiStatusType ?? data.api_status_type ?? "success") as "success" | "warning" | "danger",
        },
        queueDepth: toNum(data.queueDepth ?? data.queue_depth),
        failedJobs: toNum(data.failedJobs ?? data.failed_jobs),
        staleFeeds: toNum(data.staleFeeds ?? data.stale_feeds),
        feedsHealthy: normalizeFeedsHealthy(data.feedsHealthy ?? data.feeds_healthy),
    };
}

function normalizeFeedsHealthy(raw: unknown): { healthy: number; total: number } {
    if (raw && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        return { healthy: toNum(o.healthy), total: toNum(o.total) };
    }
    return { healthy: 0, total: 0 };
}

export async function fetchAttentionAlerts(): Promise<AttentionItem[]> {
    const raw = await backendFetch("/admin/dashboard/attention-alerts");
    const arr = toArray<Record<string, unknown>>(raw);
    return arr.map((item, idx) => ({
        id: toStr(item.id ?? item.key ?? item.type ?? idx),
        label: toStr(item.label ?? item.message ?? item.text ?? item.description ?? `Alert ${idx + 1}`),
        type: (item.type ?? item.severity ?? "warning") as "success" | "warning" | "danger",
    }));
}

export async function fetchOnboardingPipeline(): Promise<OnboardingPipeline> {
    const raw = await backendFetch("/admin/dashboard/onboarding-pipeline");
    const data = toObject(raw);

    const stagesArr = data.stages ?? data.pipeline ?? data.counts;
    const stages = toArray<Record<string, unknown>>(stagesArr).map((s) => ({
        stage: toStr(s.stage ?? s.name ?? s.label),
        count: toNum(s.count ?? s.value ?? s.total),
    }));

    return {
        stages,
        blockedMessage: toStr(
            data.blockedMessage ?? data.blocked_message ?? data.blocked,
            "",
        ),
    };
}

export async function fetchUserActivity(days: number): Promise<UserActivityPoint[]> {
    const raw = await backendFetch(`/admin/dashboard/user-activity?days=${days}`);
    const arr = toArray<Record<string, unknown>>(raw);
    return arr.map((item, idx) => ({
        day: toNum(item.day ?? item.date ?? item.index ?? idx + 1),
        active: toNum(item.active ?? item.activeUsers ?? item.count ?? item.value),
    }));
}

export async function fetchDemandHotspots(
    days: number,
    limit: number,
): Promise<Hotspot[]> {
    const raw = await backendFetch(
        `/admin/dashboard/demand-hotspots?days=${days}&limit=${limit}`,
    );
    const arr = toArray<Record<string, unknown>>(raw);
    return arr.map((item) => ({
        suburb: toStr(item.suburb ?? item.name ?? item.area),
        state: toStr(item.state ?? item.region),
        activeUsers: toStr(item.activeUsers ?? item.active_users ?? item.users ?? "0"),
        searches: toStr(item.searches ?? item.searchCount ?? item.search_count ?? "0"),
        enquiries: toNum(item.enquiries ?? item.inquiries ?? item.enquiry_count),
    }));
}
