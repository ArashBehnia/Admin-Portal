import { fetchPropertyReportsPage } from "@/lib/property-report-service";
import type {
    PropertyReportListItemDto,
    PropertyReportsData,
} from "@/types/propertyReportTypes";

function mapReport(item: PropertyReportListItemDto) {
    return {
        id: item.id,
        type: item.type,
        message: item.message,
        createdAt: item.createdAt,
        propertyName: item.property?.name ?? "",
        propertyAddress: item.property?.address ?? "",
        propertyType: item.property?.type ?? "",
        bedrooms: item.property?.bedrooms ?? 0,
        bathrooms: item.property?.bathrooms ?? 0,
        carSpaces: item.property?.carSpaces ?? 0,
        reporterName: `${item.user?.firstName ?? ""} ${item.user?.lastName ?? ""}`.trim(),
        reporterEmail: item.user?.email ?? "",
        reporterAvatar: item.user?.avatarUrl ?? "",
        reporterRole: item.user?.role ?? "",
    };
}

export const fetchPropertyReportsData = async (
    offset = 0,
    limit = 20,
    keywords?: string,
): Promise<PropertyReportsData> => {
    try {
        const page = await fetchPropertyReportsPage(offset, limit, keywords);
        const reports = (page.data ?? []).map(mapReport);
        return { reports, total: page.total };
    } catch (err) {
        console.error("Failed to fetch property reports:", err);
        return { reports: [], total: 0 };
    }
};
