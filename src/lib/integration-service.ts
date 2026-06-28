import { backendFetch } from "@/lib/api";
import type {
    IntegrationSummaryDto,
    IntegrationPageDto,
    IntegrationDetailDto,
    IntegrationErrorsDto,
    IntegrationListItemDto,
} from "@/types/integrationTypes";

export async function fetchIntegrationsSummary(): Promise<IntegrationSummaryDto> {
    const raw = await backendFetch<unknown>("/admin/integrations/summary");
    return (raw as IntegrationSummaryDto) ?? {
        totalAgencies: 0,
        connected: 0,
        feedErrors24h: 0,
        syncingFeeds: 0,
    };
}

export async function fetchIntegrationsPage(
    offset = 0,
    limit = 10,
    keywords?: string,
    status?: string,
): Promise<{ data: IntegrationListItemDto[]; total: number }> {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });
    if (keywords) params.set("keywords", keywords);
    if (status && status !== "All") params.set("status", status);

    const raw = await backendFetch<unknown>(
        `/admin/integrations/page?${params.toString()}`,
    );

    // Handle: { data: [...], total } OR array directly
    const items: IntegrationListItemDto[] = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as IntegrationPageDto)?.data)
          ? (raw as IntegrationPageDto).data
          : [];
    const total = Array.isArray(raw)
        ? raw.length
        : (raw as IntegrationPageDto)?.total ?? 0;

    return { data: items, total };
}

export async function fetchIntegrationDetail(
    id: string,
): Promise<IntegrationDetailDto> {
    const raw = await backendFetch<unknown>(`/admin/integrations/${id}`);
    return (raw as IntegrationDetailDto) ?? {
        agencyId: id,
        agencyName: "",
        connectionStatus: "unknown",
        totalFeeds: 0,
        errorFeeds: 0,
    };
}

export async function fetchIntegrationErrors(
    id: string,
    limit = 20,
): Promise<IntegrationErrorsDto> {
    const raw = await backendFetch<unknown>(
        `/admin/integrations/${id}/errors?limit=${limit}`,
    );

    // Handle: { data: [...], limit } OR array directly
    const items = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as IntegrationErrorsDto)?.data)
          ? (raw as IntegrationErrorsDto).data
          : [];

    return { data: items, limit };
}
