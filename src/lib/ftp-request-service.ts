import { backendFetch } from "@/lib/api";
import type {
    FtpRequestListItemDto,
    FtpRequestPageDto,
    FtpRequestFilters,
} from "@/types/ftpRequestTypes";

export async function fetchFtpRequestsPage(
    page = 1,
    limit = 20,
    filters?: FtpRequestFilters,
): Promise<FtpRequestPageDto> {
    const offset = (page - 1) * limit;

    const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        sortOrder: "1",
    });

    if (filters?.status) params.set("status", filters.status);
    if (filters?.filter) params.set("filter", filters.filter);

    const raw = await backendFetch<{ content: FtpRequestListItemDto[] }>(
        `/admin/agency-staff-ftp-requests/page?${params.toString()}`,
    );

    const items = Array.isArray(raw?.content) ? raw?.content : [];

    return { data: items, total: items.length, page, limit };
}

export async function approveFtpRequest(id: string) {
    return backendFetch(`/admin/agency-staff-ftp-requests/${id}/approve`, {
        method: "POST",
    });
}

export async function rejectFtpRequest(id: string, reason: string) {
    return backendFetch(`/admin/agency-staff-ftp-requests/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
}
