// ─── API Response Types ──────────────────────────────────────────────

export type AgentSummaryDto = {
    total: number;
    active: number;
    inactive: number;
    ftp_enabled: number;
    active_listings: number;
};

export type AgentListItemDto = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    role?: string;
    status?: string;
    isActive?: boolean;
    agencyId?: string;
    agencyName?: string;
    licence?: string;
    licenceStatus?: string;
    lastLoggedIn?: string;
    createdAt?: string;
    totalListings?: number;
    activeListings?: number;
    sales12m?: number;
};

export type AgentPageDto = {
    data: AgentListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

export type AgentOverviewDto = {
    id: string;
    email?: string;
    mobile?: string;
    role?: string;
    status: string;
    isActive: boolean;
    firstName?: string;
    lastName?: string;
    agencyId?: string;
    agencyName?: string;
    activeListings: number;
    totalListings: number;
    sales12m: number;
    performanceValue: number;
    totalViews: number;
};

export type AgentActivityItemDto = {
    type: string;
    entityId: string;
    label?: string;
    createdAt?: string;
};

export type AgentActivityDto = {
    data: AgentActivityItemDto[];
    limit: number;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type Agent = {
    id: string;
    agencyId: string;
    name: string;
    email: string;
    phone: string;
    agency: string;
    role: string;
    licence: string;
    licenceStatus: string;
    joined: string;
    lastLogin: string;
    status: "Active" | "Inactive" | "Pending";
    activities: Activity[];
};

export type Activity = {
    event: string;
    time: string;
};

export type DrawerTab = "profile" | "activity" | "actions";

export type AgentsData = {
    agents: Agent[];
    total: number;
};
