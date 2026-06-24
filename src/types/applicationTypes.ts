// ─── API Response Types ──────────────────────────────────────────────

export type ApplicationSummaryDto = {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    newToday: number;
};

export type ApplicationListItemDto = {
    id: string;
    name: string;
    email: string;
    agency: string;
    crm: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
    phone?: string;
};

export type ApplicationPageDto = {
    data: ApplicationListItemDto[];
    total: number;
    offset: number;
    limit: number;
};

export type ApplicationTimelineItemDto = {
    id: string;
    action: string;
    description: string;
    performedBy: string;
    timestamp: string;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Awaiting info";

export type Application = {
    id: string;
    name: string;
    email: string;
    agency: string;
    crm: string;
    submitted: string;
    status: ApplicationStatus;
    phone?: string;
    rawData?: Record<string, unknown>;
};

export type ApplicationStats = {
    total: number;
    pending: number;
    approvedThisMonth: number;
    rejected: number;
};

export type ApplicationNote = {
    id: string;
    note: string;
    createdAt: string;
    author: string;
};

export type ApplicationTimeline = ApplicationTimelineItemDto[];

export type DrawerTab = "Application" | "Verification" | "Notes";
