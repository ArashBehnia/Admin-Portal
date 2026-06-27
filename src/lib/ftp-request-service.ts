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
