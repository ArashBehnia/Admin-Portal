// ─── API Response Types ──────────────────────────────────────────────

export type PropertyReportUserDto = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    role: string;
};

export type PropertyReportPropertyDto = {
    propertyId: number;
    name: string;
    address: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    carSpaces: number;
};

export type PropertyReportListItemDto = {
    id: string;
    propertyId: string;
    type: string;
    message: string;
    createdAt: string;
    user: PropertyReportUserDto;
    property: PropertyReportPropertyDto;
};

export type PropertyReportPageDto = {
    data: PropertyReportListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type PropertyReport = {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    propertyName: string;
    propertyAddress: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    carSpaces: number;
    reporterName: string;
    reporterEmail: string;
    reporterAvatar: string;
    reporterRole: string;
};

export type PropertyReportsData = {
    reports: PropertyReport[];
    total: number;
};

export const ROWS_PER_PAGE = 20;

export const REPORT_TYPE_FILTERS = [
    "All",
    "Pest",
    "Building",
    "Both",
] as const;
export type ReportTypeFilter = (typeof REPORT_TYPE_FILTERS)[number];
