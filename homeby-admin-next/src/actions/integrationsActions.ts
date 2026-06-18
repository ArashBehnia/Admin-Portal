import { backendFetch } from "@/lib/api";
import type {
    IntegrationSummaryDto,
    IntegrationPageDto,
    IntegrationListItemDto,
    IntegrationDetailDto,
    IntegrationErrorsDto,
    Feed,
    FeedStats,
    IntegrationsData,
} from "../types/integrationTypes";

// Re-export types so existing imports still work
export type {
    IntegrationSummaryDto,
    IntegrationPageDto,
    IntegrationDetailDto,
    IntegrationErrorDto,
    IntegrationErrorsDto,
    Feed,
    FeedStatus,
    FeedMethod,
    FeedStats,
    IntegrationsData,
    StatusFilter,
} from "../types/integrationTypes";
export { ROWS_PER_PAGE, STATUS_FILTERS } from "../types/integrationTypes";

// ─── Helpers ─────────────────────────────────────────────────────────

function inferMethod(crmType?: string, webhookUrl?: string): Feed["method"] {
    const url = webhookUrl?.toLowerCase() ?? "";
    if (url.includes("ftp") || url.includes("sftp")) return "FTP";
    if (crmType?.toLowerCase() === "homeby internal") return "Internal";
    return "API";
}

function mapConnectionStatus(status: string): Feed["status"] {
    const s = status.toLowerCase();
    if (s === "healthy") return "Healthy";
    if (s === "failing" || s === "error") return "Failing";
    if (s === "warning" || s === "stale") return "Warning";
    if (s === "pending" || s === "pending_setup" || s === "not configured")
        return "Pending setup";
    return "Healthy";
}

function formatLastSync(iso?: string): string {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

function mapAgencyStatus(status?: string): string {
    if (!status) return "Live";
    const s = status.toLowerCase();
    if (s === "active" || s === "live") return "Live";
    if (s === "onboarding") return "CRM Connected";
    if (s === "approved") return "Approved";
    if (s === "trial") return "Approved";
    return status;
}

// ─── Server Actions ──────────────────────────────────────────────────

export const fetchIntegrationsData = async (
    offset = 0,
    limit = 10,
    keywords?: string,
): Promise<IntegrationsData> => {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);

    const [summaryRaw, pageRaw] = await Promise.all([
        backendFetch<unknown>("/admin/integrations/summary"),
        backendFetch<unknown>(
            `/admin/integrations/page?${params.toString()}`,
        ),
    ]);

    // Handle different possible API response shapes
    const summary = (summaryRaw as IntegrationSummaryDto) ?? {
        totalAgencies: 0,
        connected: 0,
        feedErrors24h: 0,
        syncingFeeds: 0,
    };

    // page could be: { data: [...], total } OR an array directly
    const pageItems: IntegrationListItemDto[] = Array.isArray(pageRaw)
        ? pageRaw
        : Array.isArray((pageRaw as IntegrationPageDto)?.data)
          ? (pageRaw as IntegrationPageDto).data
          : [];
    const pageTotal = Array.isArray(pageRaw)
        ? pageRaw.length
        : (pageRaw as IntegrationPageDto)?.total ?? 0;

    const stats: FeedStats = {
        total: summary.totalAgencies,
        healthy: summary.connected,
        warning: Math.max(
            0,
            summary.totalAgencies - summary.connected - summary.feedErrors24h,
        ),
        failing: summary.feedErrors24h,
    };

    const feeds: Feed[] = pageItems.map((item) => ({
        id: item.agencyId,
        agencyName: item.agencyName,
        crm: item.crmType ?? "—",
        method: inferMethod(item.crmType, item.webhookUrl),
        status: mapConnectionStatus(item.connectionStatus),
        lastSync: formatLastSync(item.lastSyncAt),
        listings24h: item.totalFeeds,
        errors24h: item.errorFeeds,
        distribution: "—",
        onboarding: mapAgencyStatus(item.agencyStatus),
    }));

    return { stats, feeds, total: pageTotal };
};

export const fetchIntegrationDetail = async (
    id: string,
): Promise<IntegrationDetailDto> => {
    return backendFetch<IntegrationDetailDto>(
        `/admin/integrations/${id}`,
    );
};

export const fetchIntegrationErrors = async (
    id: string,
    limit = 20,
): Promise<IntegrationErrorsDto> => {
    return backendFetch<IntegrationErrorsDto>(
        `/admin/integrations/${id}/errors?limit=${limit}`,
    );
};
