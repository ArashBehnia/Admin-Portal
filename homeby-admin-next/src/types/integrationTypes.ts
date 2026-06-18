// ─── API Response Types ──────────────────────────────────────────────

export type IntegrationSummaryDto = {
    totalAgencies: number;
    connected: number;
    feedErrors24h: number;
    syncingFeeds: number;
};

export type IntegrationListItemDto = {
    agencyId: string;
    agencyName: string;
    agencyStatus?: string;
    crmType?: string;
    webhookUrl?: string;
    connectionStatus: string;
    totalFeeds: number;
    errorFeeds: number;
    lastSyncAt?: string;
};

export type IntegrationPageDto = {
    data: IntegrationListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

export type IntegrationDetailDto = {
    agencyId: string;
    agencyName: string;
    agencyStatus?: string;
    crmType?: string;
    webhookUrl?: string;
    connectionStatus: string;
    totalFeeds: number;
    errorFeeds: number;
    lastSyncAt?: string;
    email?: string;
    phone?: string;
    apiAllowedIps?: string[];
    ftpAllowedIps?: string[];
};

export type IntegrationErrorDto = {
    id: string;
    listingId?: string;
    portal?: string;
    status?: string;
    externalId?: string;
    lastError?: string;
    lastSyncAt?: string;
    updatedAt?: string;
};

export type IntegrationErrorsDto = {
    data: IntegrationErrorDto[];
    limit: number;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type FeedStatus = "Healthy" | "Failing" | "Pending setup" | "Warning";
export type FeedMethod = "FTP" | "API" | "Internal";

export type Feed = {
    id: string;
    agencyName: string;
    crm: string;
    method: FeedMethod;
    status: FeedStatus;
    lastSync: string;
    listings24h: number | null;
    errors24h: number | null;
    distribution: string;
    onboarding: string;
};

export type FeedStats = {
    total: number;
    healthy: number;
    warning: number;
    failing: number;
};

export type IntegrationsData = {
    stats: FeedStats;
    feeds: Feed[];
    total: number;
};

export const ROWS_PER_PAGE = 10;

export const STATUS_FILTERS = [
    "All",
    "Healthy",
    "Warning",
    "Failing",
    "Pending setup",
] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];
