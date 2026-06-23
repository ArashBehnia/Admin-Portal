// ─── API Response Types ──────────────────────────────────────────────

export type AgencySummaryDto = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    with_listings: number;
};

export type AgencyListItemDto = {
    id: string;
    name: string;
    status?: string;
    email?: string;
    phone?: string;
    website?: string;
    totalStaff?: number;
    activeStaff?: number;
    totalListings?: number;
    activeListings?: number;
    sales12m?: number;
    lastActivityAt?: string;
    subscription?: string;
    feedStatus?: string;
    mrr?: string;
    location?: string;
};

export type AgencyPageDto = {
    data: AgencyListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

export type AgencyOverviewDto = {
    id: string;
    name: string;
    status: string;
    email?: string;
    phone?: string;
    website?: string;
    totalStaff: number;
    activeStaff: number;
    totalListings: number;
    activeListings: number;
    sales12m: number;
    lastActivityAt?: string;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type AgencyHighlight = "orange" | "red" | null;

export type Agency = {
    id: string;
    name: string;
    location: string;
    subscription: string;
    onboarding: string;
    listings: number;
    agents: number;
    feed: string;
    mrr: string;
    lastActivity: string;
    highlight: AgencyHighlight;
};

export type AgencyStats = {
    total: string;
    active: string;
    onboarding: string;
    suspended: string;
};

export type AgenciesData = {
    stats: AgencyStats;
    agencies: Agency[];
    total: number;
};

export const ROWS_PER_PAGE = 20;

export const AGENCY_FILTERS = [
    "All",
    "Active",
    "Onboarding",
    "Pending",
    "Suspended",
    "Trial",
] as const;
export type AgencyFilter = (typeof AGENCY_FILTERS)[number];
