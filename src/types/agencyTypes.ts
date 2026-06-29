// ─── API Response Types ──────────────────────────────────────────────

export type AgencySummaryDto = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    with_listings: number;
};

export type AgencySubscriptionDto = {
    status: string;
    label: string;
    mrr: number;
    mrrLabel: string;
};

export type AgencyFeedDto = {
    status: string;
    label: string;
    totalFeeds: number;
    errorFeeds: number;
    lastSyncAt: string | null;
};

export type AgencyListItemDto = {
    id: string;
    name: string;
    status: string;
    onboardingStatus: string;
    onboardingLabel: string;
    subscription: AgencySubscriptionDto;
    totalListings: number;
    activeListings: number;
    totalAgents: number;
    activeAgents: number;
    feed: AgencyFeedDto;
    mrr: number;
    mrrLabel: string;
    lastActivityAt: string;
    email: string;
    phone: string;
    website: string;
    agencyAddress: string;
    state: string;
    postcode: string;
    crmSelection: string;
    createdAt: string;
};

export type AgencyPageDto = {
    content: AgencyListItemDto[];
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
    abn?: string;
    createdAt?: string;
    totalStaff: number;
    activeStaff: number;
    totalListings: number;
    activeListings: number;
    sales12m: number;
    lastActivityAt?: string;
};

// ─── Detail API Response Types ─────────────────────────────────────

export type AgencyOnboardingStepDto = {
    key: string;
    label: string;
    status: "completed" | "current" | "pending";
    completedAt?: string;
};

export type AgencyOnboardingDto = {
    currentStep: string;
    steps: AgencyOnboardingStepDto[];
    appliedAt?: string;
    approvedAt?: string;
    crmConnectedAt?: string;
    syncingAt?: string;
    validatedAt?: string;
    liveAt?: string;
};

export type AgencyActivityEventDto = {
    title: string;
    date: string;
    type: "info" | "success" | "warning" | "error";
};

export type AgencyActivityDto = {
    events: AgencyActivityEventDto[];
    total: number;
};

export type AgencyPortalDistributionDto = {
    name: string;
    icon: string;
    color: string;
    status: string;
    listings: string;
    active: boolean;
};

export type AgencyListingDistributionDto = {
    portals: AgencyPortalDistributionDto[];
};

export type AgencyDetailDto = {
    overview: {
        id: string;
        name: string;
        status: string;
        email?: string;
        phone?: string;
        website?: string;
        abn?: string;
        createdAt?: string;
        totalStaff: number;
        activeStaff: number;
        totalListings: number;
        activeListings: number;
        sales12m: number;
        memberSince?: string;
        lastActivityAt?: string;
        subscription?: string;
        feedStatus?: string;
        mrr?: string;
        location?: string;
    };
    onboarding: AgencyOnboardingDto;
    activity: AgencyActivityDto;
    listingDistribution: AgencyListingDistributionDto;
    notes: {
        note: string;
        lastEditedBy?: string;
        lastEditedAt?: string;
    };
    billing: {
        available: boolean;
        reason?: string;
    };
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
    trial: string;
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
