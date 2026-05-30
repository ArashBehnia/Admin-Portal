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

export type DashboardData = {
    kpis: {
        activeAgencies: KPIMetric;
        pendingApplications: KPIMetric;
        feedFailures: KPIMetric;
        mrr: KPIMetric;
    };
    attentionRequired: AttentionItem[];
    onboardingPipeline: OnboardingPipeline;
    userActivity: UserActivityPoint[];
    demandHotspots: Hotspot[];
    systemHealth: SystemHealth;
};

export type Timeframe = "7d" | "30d" | "90d" | "YTD" | "Custom";

export const fetchDashboardData = async (): Promise<DashboardData> => {
    return {
        kpis: {
            activeAgencies: {
                value: "1,247",
                trend: "+12 net this month",
                trendType: "success",
            },
            pendingApplications: {
                value: "8",
                trend: "3 new today",
                trendType: "warning",
            },
            feedFailures: {
                value: "2",
                trend: "↑ from 0 yesterday",
                trendType: "warning",
            },
            mrr: {
                value: "$184,200",
                trend: "+4.1% MoM",
                trendType: "success",
            },
        },
        attentionRequired: [
            { id: "feeds", label: "2 feeds failing", type: "danger" },
            {
                id: "blocked",
                label: "3 agencies onboarding blocked",
                type: "warning",
            },
            { id: "reviews", label: "12 reviews pending", type: "warning" },
            {
                id: "applications",
                label: "8 applications pending",
                type: "warning",
            },
        ],
        onboardingPipeline: {
            stages: [
                { stage: "Applied", count: 14 },
                { stage: "Approved", count: 9 },
                { stage: "CRM Connected", count: 6 },
                { stage: "Syncing", count: 4 },
                { stage: "Live", count: 847 },
            ],
            blockedMessage: "3 agencies blocked >48h",
        },
        userActivity: [
            { day: 1, active: 8200 },
            { day: 2, active: 8500 },
            { day: 3, active: 8900 },
            { day: 4, active: 9500 },
            { day: 5, active: 9900 },
            { day: 6, active: 9950 },
            { day: 7, active: 10200 },
            { day: 8, active: 9900 },
            { day: 9, active: 9800 },
            { day: 10, active: 9850 },
            { day: 11, active: 9400 },
            { day: 12, active: 8800 },
            { day: 13, active: 8600 },
            { day: 14, active: 8300 },
            { day: 15, active: 8000 },
            { day: 16, active: 8100 },
            { day: 17, active: 7900 },
            { day: 18, active: 8400 },
            { day: 19, active: 8700 },
            { day: 20, active: 8650 },
            { day: 21, active: 9600 },
            { day: 22, active: 10300 },
            { day: 23, active: 10550 },
            { day: 24, active: 11200 },
            { day: 25, active: 11100 },
            { day: 26, active: 11300 },
            { day: 27, active: 11500 },
            { day: 28, active: 10850 },
            { day: 29, active: 10700 },
            { day: 30, active: 9750 },
        ],
        demandHotspots: [
            {
                suburb: "Bondi",
                state: "NSW",
                activeUsers: "4,820",
                searches: "12,400",
                enquiries: 340,
            },
            {
                suburb: "Surry Hills",
                state: "NSW",
                activeUsers: "3,914",
                searches: "9,800",
                enquiries: 287,
            },
            {
                suburb: "Carlton",
                state: "VIC",
                activeUsers: "3,602",
                searches: "8,900",
                enquiries: 241,
            },
            {
                suburb: "South Yarra",
                state: "VIC",
                activeUsers: "3,380",
                searches: "8,100",
                enquiries: 198,
            },
            {
                suburb: "New Farm",
                state: "QLD",
                activeUsers: "2,987",
                searches: "7,200",
                enquiries: 176,
            },
            {
                suburb: "Cottesloe",
                state: "WA",
                activeUsers: "2,104",
                searches: "5,100",
                enquiries: 143,
            },
            {
                suburb: "Richmond",
                state: "VIC",
                activeUsers: "1,950",
                searches: "4,800",
                enquiries: 130,
            },
            {
                suburb: "Paddington",
                state: "NSW",
                activeUsers: "1,820",
                searches: "4,500",
                enquiries: 121,
            },
            {
                suburb: "Fitzroy",
                state: "VIC",
                activeUsers: "1,710",
                searches: "4,200",
                enquiries: 115,
            },
            {
                suburb: "Subiaco",
                state: "WA",
                activeUsers: "1,540",
                searches: "3,900",
                enquiries: 98,
            },
        ],
        systemHealth: {
            apiStatus: { status: "Operational", type: "success" },
            queueDepth: 47,
            failedJobs: 2,
            staleFeeds: 1,
            feedsHealthy: { healthy: 11, total: 13 },
        },
    };
};
