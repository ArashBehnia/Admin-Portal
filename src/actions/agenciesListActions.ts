import { backendFetch } from "@/lib/api";
import type {
    Agency,
    AgencyStats,
    AgenciesData,
    AgencyListItemDto,
    AgencyPageDto,
} from "../types/agencyTypes";

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
        backendFetch<AgencyPageDto>(`/admin/agencies/page?${params.toString()}`),
    ]);

    const summaryObj =
        summaryRaw && typeof summaryRaw === "object" && !Array.isArray(summaryRaw)
            ? (summaryRaw as Record<string, unknown>)
            : {};
    const toNum = (v: unknown) =>
        typeof v === "number" ? v : typeof v === "string" ? Number(v) || 0 : 0;

    const stats: AgencyStats = {
        total: String(toNum(summaryObj.total)),
        active: String(toNum(summaryObj.active)),
        onboarding: String(toNum(summaryObj.onboarding)),
        suspended: String(toNum(summaryObj.suspended)),
        trial: String(toNum(summaryObj.trial)),
    };

    const items: AgencyListItemDto[] = Array.isArray(pageRaw?.content)
        ? pageRaw.content
        : [];
    const total = pageRaw?.total ?? items.length;

    const agencies: Agency[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        location: [item.agencyAddress, item.state, item.postcode]
            .filter(Boolean)
            .join(", "),
        subscription: item.subscription?.label ?? "Trial",
        onboarding: item.onboardingLabel ?? item.onboardingStatus ?? "",
        listings: item.activeListings ?? item.totalListings ?? 0,
        agents: item.activeAgents ?? item.totalAgents ?? 0,
        feed: item.feed?.label ?? "Not configured",
        mrr: item.mrrLabel ?? "$0/mo",
        lastActivity: formatLastActivity(item.lastActivityAt),
        highlight: mapHighlight(item.status),
    }));

    return { stats, agencies, total };
};
