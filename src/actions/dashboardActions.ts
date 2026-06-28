export type KPIMetric = {
    value: string;
    trend: string;
    trendType: "success" | "warning" | "danger";
};

export type AttentionItem = {
    id: string;
    label: string;
    type: "success" | "warning" | "danger";
};

export type OnboardingPipeline = {
    stages: { stage: string; count: number }[];
    blockedMessage: string;
};

export type UserActivityPoint = {
    day: number;
    active: number;
};

export type Hotspot = {
    suburb: string;
    state: string;
    activeUsers: string;
    searches: string;
    enquiries: number;
};

export type SystemHealth = {
    apiStatus: { status: string; type: "success" | "warning" | "danger" };
    queueDepth: number;
    failedJobs: number;
    staleFeeds: number;
    feedsHealthy: { healthy: number; total: number };
};

export type OverviewData = {
    kpis: {
        activeAgencies: KPIMetric;
        pendingApplications: KPIMetric;
        feedFailures: KPIMetric;
        mrr: KPIMetric;
    };
    systemHealth: SystemHealth;
};

export type Timeframe = "7d" | "30d" | "90d" | "YTD";

export const TIMEFRAME_DAYS: Record<Exclude<Timeframe, "YTD">, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
};
