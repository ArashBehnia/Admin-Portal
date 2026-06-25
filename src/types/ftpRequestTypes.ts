// ─── API Response Types ──────────────────────────────────────────────

export type FtpRequestAgencyDto = {
    id: string;
    name: string;
};

export type FtpRequestAgentDto = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type FtpRequestListItemDto = {
    id: string;
    agency: FtpRequestAgencyDto;
    agent: FtpRequestAgentDto;
    email: string;
    allowedIp: string;
    ftpUsername: string;
    status: string;
    requestedAt: string;
};

export type FtpRequestPageDto = {
    data: FtpRequestListItemDto[];
    total: number;
    page: number;
    limit: number;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type FtpRequest = {
    id: string;
    agencyName: string;
    agentName: string;
    agentEmail: string;
    email: string;
    allowedIp: string;
    ftpUsername: string;
    status: string;
    requestedAt: string;
};

export type FtpRequestsData = {
    requests: FtpRequest[];
    total: number;
};

export type FtpRequestFilters = {
    status?: string;
    filter?: string;
};

export const ROWS_PER_PAGE = 20;

export const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;
export type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];
