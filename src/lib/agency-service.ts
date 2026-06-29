import { backendFetch } from "@/lib/api";
import type {
    AgencySummaryDto,
    AgencyListItemDto,
    AgencyOverviewDto,
    AgencyDetailDto,
    AgencyOnboardingDto,
    AgencyOnboardingStepDto,
    AgencyActivityDto,
    AgencyListingDistributionDto,
} from "@/types/agencyTypes";
import type { AgencyDetailData, ActivityEvent, Portal } from "@/actions/agenciesActions";

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

export type AgencyNotes = {
    note: string;
    lastEditedBy: string | null;
    lastEditedAt: string | null;
};

export async function fetchAgencyNotes(id: string): Promise<AgencyNotes> {
    const raw = await backendFetch<unknown>(
        `/api/admin/agencies/${id}/notes`,
    );
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        note: String(obj.note ?? ""),
        lastEditedBy: obj.lastEditedBy ? String(obj.lastEditedBy) : null,
        lastEditedAt: obj.lastEditedAt ? String(obj.lastEditedAt) : null,
    };
}

export async function saveAgencyNotes(
    id: string,
    note: string,
): Promise<AgencyNotes> {
    const raw = await backendFetch<unknown>(
        `/api/admin/agencies/${id}/notes`,
        {
            method: "POST",
            body: JSON.stringify({ note }),
        },
    );
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};
    return {
        note: String(obj.note ?? note),
        lastEditedBy: obj.lastEditedBy ? String(obj.lastEditedBy) : null,
        lastEditedAt: obj.lastActivityAt ? String(obj.lastActivityAt) : null,
    };
}

// ─── Detail API Functions ──────────────────────────────────────────

function mapActivityTypeToColor(type: string): string {
    switch (type) {
        case "success": return "bg-green-500";
        case "warning": return "bg-orange-400";
        case "error": return "bg-red-500";
        default: return "bg-accent";
    }
}

function mapActivityEvents(raw: unknown): ActivityEvent[] {
    const obj = raw && typeof raw === "object" && !Array.isArray(raw)
        ? raw as Record<string, unknown>
        : {};
    const events = toArray<{ title?: string; label?: string; date?: string; createdAt?: string; type?: string }>(
        obj.events ?? obj.data ?? raw,
    );
    return events.map((e) => ({
        title: String(e.label ?? e.title ?? ""),
        date: String(e.createdAt ?? e.date ?? ""),
        color: mapActivityTypeToColor(String(e.type ?? "info")),
    }));
}

const PORTAL_META: Record<string, { icon: string; color: string }> = {
    homeby: { icon: "HB", color: "bg-blue-100 text-blue-700" },
    homely: { icon: "HO", color: "bg-green-100 text-green-700" },
    realestate: { icon: "RE", color: "bg-orange-100 text-orange-700" },
    domain: { icon: "DO", color: "bg-purple-100 text-purple-700" },
};

function mapPortals(raw: unknown): Portal[] {
    const obj = raw && typeof raw === "object" && !Array.isArray(raw)
        ? raw as Record<string, unknown>
        : {};
    const rows = toArray<{
        portal?: string; connected?: boolean; published?: number; total?: number;
        name?: string; icon?: string; color?: string;
        status?: string; listings?: string; active?: boolean;
    }>(obj.rows ?? obj.portals ?? obj.data ?? raw);
    return rows.map((r) => {
        const portalName = String(r.portal ?? r.name ?? "");
        const meta = PORTAL_META[portalName.toLowerCase()] ?? { icon: portalName.slice(0, 2).toUpperCase(), color: "bg-gray-100 text-gray-700" };
        const connected = Boolean(r.connected ?? r.active);
        const published = Number(r.published ?? 0);
        const total = Number(r.total ?? 0);
        return {
            name: portalName,
            icon: meta.icon,
            color: meta.color,
            status: connected ? "Connected" : "Not connected",
            listings: `${published}/${total} published`,
            active: connected,
        };
    });
}

function formatDate(iso?: string): string {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("en-AU", { month: "short", year: "numeric" });
    } catch {
        return iso;
    }
}

function mapOnboardingSteps(onboarding?: AgencyOnboardingDto): AgencyOnboardingStepDto[] {
    if (onboarding?.steps && onboarding.steps.length > 0) {
        let foundCurrent = false;
        return onboarding.steps.map((step) => {
            if (step.status) return step;
            if (!foundCurrent) {
                foundCurrent = true;
                return { ...step, status: "current" as const };
            }
            return { ...step, status: "pending" as const };
        });
    }
    return [
        { key: "APPLIED", label: "APPLIED", status: "completed" as const },
        { key: "APPROVED", label: "APPROVED", status: "completed" as const },
        { key: "CRM CONNECTED", label: "CRM CONNECTED", status: "completed" as const },
        { key: "SYNCING", label: "SYNCING", status: "completed" as const },
        { key: "VALIDATION", label: "VALIDATION", status: "completed" as const },
    ];
}

export async function fetchAgencyDetail(id: string): Promise<AgencyDetailData> {
    const raw = await backendFetch<unknown>(`/admin/agencies/${id}/detail`);
    const dto = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as AgencyDetailDto
        : null;

    if (!dto) {
        return fallbackDetailData(id);
    }

    const overview = dto.overview ?? {};
    const onboardingSteps = mapOnboardingSteps(dto.onboarding);
    return {
        abn: String(overview.abn ?? ""),
        memberSince: formatDate(overview.createdAt),
        email: String(overview.email ?? ""),
        phone: String(overview.phone ?? ""),
        website: String(overview.website ?? ""),
        activeListings: Number(overview.activeListings ?? 0),
        activeStaff: Number(overview.activeStaff ?? 0),
        crmProvider: "",
        feedLastSynced: "",
        activityTimeline: mapActivityEvents(dto.activity),
        distributionPortals: mapPortals(dto.listingDistribution),
        internalNotes: String(dto.notes?.note ?? ""),
        auditLog: [],
        reviews: [],
        invoices: [],
        listings: [],
        agents: [],
        onboardingSteps,
        billing: dto.billing ?? { available: false, reason: "Subscription and billing models are not available in St1 yet." },
    };
}

export async function fetchAgencyDetailOverview(id: string): Promise<AgencyDetailData> {
    const raw = await backendFetch<unknown>(`/admin/agencies/${id}/overview`);
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};

    return {
        abn: String(obj.abn ?? ""),
        memberSince: formatDate(obj.memberSince ? String(obj.memberSince) : undefined),
        email: String(obj.email ?? ""),
        phone: String(obj.phone ?? ""),
        website: String(obj.website ?? ""),
        activeListings: Number(obj.activeListings ?? 0),
        activeStaff: Number(obj.activeStaff ?? 0),
        crmProvider: String(obj.crmProvider ?? ""),
        feedLastSynced: String(obj.feedLastSynced ?? ""),
        activityTimeline: [],
        distributionPortals: [],
        internalNotes: "",
        auditLog: [],
        reviews: [],
        invoices: [],
        listings: [],
        agents: [],
        billing: { available: false, reason: "Subscription and billing models are not available in St1 yet." },
    };
}

export async function fetchAgencyOnboarding(id: string): Promise<AgencyOnboardingDto> {
    const raw = await backendFetch<unknown>(`/admin/agencies/${id}/onboarding`);
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};

    const steps = toArray<{ key?: string; label?: string; status?: string; completedAt?: string }>(
        obj.steps ?? obj.data ?? raw,
    );

    return {
        currentStep: String(obj.currentStep ?? ""),
        steps: steps.map((s) => ({
            key: String(s.key ?? ""),
            label: String(s.label ?? ""),
            status: (s.status as "completed" | "current" | "pending") ?? "pending",
            completedAt: s.completedAt ? String(s.completedAt) : undefined,
        })),
        appliedAt: obj.appliedAt ? String(obj.appliedAt) : undefined,
        approvedAt: obj.approvedAt ? String(obj.approvedAt) : undefined,
        crmConnectedAt: obj.crmConnectedAt ? String(obj.crmConnectedAt) : undefined,
        syncingAt: obj.syncingAt ? String(obj.syncingAt) : undefined,
        validatedAt: obj.validatedAt ? String(obj.validatedAt) : undefined,
        liveAt: obj.liveAt ? String(obj.liveAt) : undefined,
    };
}

export async function fetchAgencyActivity(
    id: string,
    limit = 20,
): Promise<AgencyActivityDto> {
    const params = new URLSearchParams({ limit: String(limit) });
    const raw = await backendFetch<unknown>(
        `/admin/agencies/${id}/activity?${params.toString()}`,
    );
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};

    const events = toArray<{ title?: string; date?: string; type?: string }>(
        obj.events ?? obj.data ?? raw,
    );

    return {
        events: events.map((e) => ({
            title: String(e.title ?? ""),
            date: String(e.date ?? ""),
            type: (e.type as "info" | "success" | "warning" | "error") ?? "info",
        })),
        total: toNumber(obj.total) || events.length,
    };
}

export async function fetchAgencyListingDistribution(
    id: string,
): Promise<AgencyListingDistributionDto> {
    const raw = await backendFetch<unknown>(
        `/admin/agencies/${id}/listing-distribution`,
    );
    const obj = (raw && typeof raw === "object" && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};

    const portals = toArray<{
        name?: string; icon?: string; color?: string;
        status?: string; listings?: string; active?: boolean;
    }>(obj.portals ?? obj.data ?? raw);

    return {
        portals: portals.map((p) => ({
            name: String(p.name ?? ""),
            icon: String(p.icon ?? ""),
            color: String(p.color ?? "text-muted bg-page"),
            status: String(p.status ?? "Not connected"),
            listings: String(p.listings ?? "0 published"),
            active: Boolean(p.active),
        })),
    };
}

function fallbackDetailData(id: string): AgencyDetailData {
    void id;
    return {
        abn: "",
        memberSince: "",
        email: "",
        phone: "",
        website: "",
        activeListings: 0,
        activeStaff: 0,
        crmProvider: "",
        feedLastSynced: "",
        activityTimeline: [],
        distributionPortals: [],
        internalNotes: "",
        auditLog: [],
        reviews: [],
        invoices: [],
        listings: [],
        agents: [],
        billing: { available: false, reason: "Subscription and billing models are not available in St1 yet." },
    };
}
