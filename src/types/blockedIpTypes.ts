/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── API Response Types ──────────────────────────────────────────────

export type BlockedIpListItemDto = {
    key: string;
    ip?: string;
    identity?: string;
    strategy: string;
    reason: string;
    blockedAt: string;
    ttlSeconds?: number | null;
    meta: any;
};

export type BlockedIpPageDto = {
    data: BlockedIpListItemDto[];
    total: number;
    page: number;
    limit: number;
};

// ─── Frontend Types ──────────────────────────────────────────────────

export type BlockedIp = {
    id: string;
    ipOrUser: string;
    strategy: string;
    reason: string;
    blockedAt: string;
    ttl: string;
    meta: string;
};

export type BlockedIpsData = {
    entries: BlockedIp[];
    total: number;
};

export type BlockedIpFilters = {
    strategy?: string;
    reason?: string;
    filter?: string;
};

export type CreateBlockPayload = {
    ip: string;
    ttlSeconds?: number | null;
    reason: string;
};

export type CreateBlockResponse = {
    blocked: boolean;
    key: string;
};

export const ROWS_PER_PAGE = 20;

export const STRATEGY_OPTIONS = [
    { value: "", label: "All strategies" },
    { value: "ip", label: "IP" },
    { value: "user", label: "User" },
] as const;
export type StrategyValue = (typeof STRATEGY_OPTIONS)[number]["value"];

export const REASON_OPTIONS = [
    { value: "", label: "All reasons" },
    { value: "login-failure", label: "Login failure" },
    { value: "2fa-failure", label: "2FA failure" },
    { value: "rate-limit-ip", label: "Rate limit: IP" },
    { value: "rate-limit-user", label: "Rate limit: User" },
    { value: "honeypot", label: "Honeypot" },
    { value: "manual", label: "Manual" },
] as const;
export type ReasonValue = (typeof REASON_OPTIONS)[number]["value"];
