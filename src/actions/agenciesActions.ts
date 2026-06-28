// ─── Re-exports from types (no server deps) ─────────────────────────

export type {
    AgencyHighlight,
    Agency,
    AgencyStats,
    AgenciesData,
    AgencyFilter,
    AgencyListItemDto,
    AgencySummaryDto,
    AgencyOnboardingStepDto,
} from "../types/agencyTypes";
export { AGENCY_FILTERS, ROWS_PER_PAGE } from "../types/agencyTypes";

import type { AgencyOnboardingStepDto } from "../types/agencyTypes";

// ─── Detail Types (no server deps) ──────────────────────────────────

export type ActivityEvent = {
    title: string;
    date: string;
    color: string;
};

export type Portal = {
    name: string;
    icon: string;
    color: string;
    status: string;
    listings: string;
    active: boolean;
};

export type AuditRow = {
    time: string;
    action: string;
    user: string;
    details: string;
};

export type ReviewRow = {
    name: string;
    agent: string;
    rating: number;
    comment: string;
    status: "Approved" | "Pending" | "Rejected";
    date: string;
    action: string;
};

export type InvoiceRow = {
    date: string;
    period: string;
    amount: string;
    status: "Paid" | "Overdue";
};

export type ListingRow = {
    address: string;
    type: string;
    status: "Active" | "Under offer" | "Sold";
    price: string;
    date: string;
    dist: string;
};

export type AgentRow = {
    name: string;
    role: string;
    email: string;
    phone: string;
    licence: string;
    lastLogin: string;
    status: "Active" | "Inactive" | "Pending";
};

export type AgencyDetailData = {
    abn: string;
    memberSince: string;
    email: string;
    phone: string;
    website: string;
    activeListings: number;
    activeStaff: number;
    activityTimeline: ActivityEvent[];
    distributionPortals: Portal[];
    internalNotes: string;
    auditLog: AuditRow[];
    reviews: ReviewRow[];
    invoices: InvoiceRow[];
    listings: ListingRow[];
    agents: AgentRow[];
    crmProvider: string;
    feedLastSynced: string;
    onboardingSteps?: AgencyOnboardingStepDto[];
    billing?: { available: boolean; reason?: string };
};

export const TABS = [
    "Overview",
    "Agents",
    "Listings",
    "Subscription & Billing",
    "Reviews",
    "Notes",
    "Audit",
] as const;
export type AgencyTab = (typeof TABS)[number];

export const ONBOARDING_STEPS = [
    "APPLIED",
    "APPROVED",
    "CRM CONNECTED",
    "SYNCING",
    "VALIDATION",
] as const;

// ─── Detail Mock Data ────────────────────────────────────────────────

export const fetchAgencyDetailData = async (): Promise<AgencyDetailData> => {
    return {
        abn: "51 824 753 556",
        memberSince: "Dec 2024",
        email: "james@gatewayresidential.com.au",
        phone: "+61412345678",
        website: "https://gatewayresidential.com.au",
        activeListings: 5,
        activeStaff: 6,
        crmProvider: "Box+Dice",
        feedLastSynced: "14 min ago",
        activityTimeline: [
            { title: "Subscription upgraded to Founding Partner", date: "10 Jan 2026", color: "bg-accent" },
            { title: "Feed recovered — syncing resumed", date: "8 Jan 2026", color: "bg-green-500" },
            { title: "Feed warning — stale >24h", date: "7 Jan 2026", color: "bg-orange-400" },
            { title: "First sync completed — 47 listings imported", date: "20 Dec 2024", color: "bg-green-500" },
            { title: "CRM connected — Box+Dice REAXML", date: "18 Dec 2024", color: "bg-green-500" },
            { title: "Welcome email sent with temporary credentials", date: "15 Dec 2024", color: "bg-accent" },
            { title: "Application approved by Arash", date: "15 Dec 2024", color: "bg-green-500" },
            { title: "Agency application received", date: "10 Dec 2024", color: "bg-green-500" },
        ],
        distributionPortals: [
            { name: "HomeBy", icon: "H", color: "text-accent bg-blue-50", status: "Connected", listings: "247 published", active: true },
            { name: "Realestate.com", icon: "R", color: "text-red-600 bg-red-50", status: "Connected", listings: "247 published", active: true },
            { name: "Domain", icon: "D", color: "text-green-600 bg-green-50", status: "Connected", listings: "247 published", active: true },
            { name: "View", icon: "V", color: "text-purple-600 bg-purple-50", status: "Connected", listings: "247 published", active: true },
            { name: "Homely", icon: "H", color: "text-muted bg-page", status: "Not connected", listings: "0 published", active: false },
        ],
        internalNotes: "Founding partner — onboarded Dec 2024. Primary contact: James Mitchell. CRM: Box+Dice, REAXML feed configured by Hirad on 15 Dec 2024.",
        auditLog: [
            { time: "8 May 2026 14:22", action: "Review flagged", user: "Arash", details: "Review ID #4821 flagged for moderation" },
            { time: "2 May 2026 14:32", action: "Notes updated", user: "Arash", details: "Internal notes edited" },
            { time: "15 Apr 2026 09:11", action: "Tier changed", user: "Sarah Chen", details: "Professional → Founding Partner" },
            { time: "20 Jan 2026 11:44", action: "Feed paused", user: "Hirad", details: "Manual pause for maintenance window" },
            { time: "15 Dec 2024 16:30", action: "Agency approved", user: "Arash", details: "Application approved, welcome email sent" },
        ],
        reviews: [
            { name: "David K.", agent: "James Mitchell", rating: 5, comment: "James made the entire process...", status: "Approved", date: "3 May 2026", action: "View" },
            { name: "Anonymous", agent: "Sarah Chen", rating: 3, comment: "Good communication but...", status: "Pending", date: "8 May 2026", action: "Review" },
            { name: "Mark T.", agent: "Michael Torres", rating: 2, comment: "Unfortunately our experience...", status: "Rejected", date: "1 Apr 2026", action: "View" },
        ],
        invoices: [
            { date: "1 May 2026", period: "May 2026", amount: "$890", status: "Paid" },
            { date: "1 Apr 2026", period: "Apr 2026", amount: "$890", status: "Paid" },
            { date: "1 Mar 2026", period: "Mar 2026", amount: "$890", status: "Paid" },
            { date: "1 Feb 2026", period: "Feb 2026", amount: "$890", status: "Overdue" },
        ],
        listings: [
            { address: "14/8 Campbell Parade, Bondi NSW", type: "For Sale", status: "Active", price: "$1,850,000", date: "12 Jan 2026", dist: "REA, Domain, View" },
            { address: "3 Blair Street, Bondi NSW", type: "For Sale", status: "Active", price: "$2,100,000", date: "28 Jan 2026", dist: "REA, Domain" },
            { address: "7/22 Hall Street, Bondi NSW", type: "For Rent", status: "Active", price: "$850/wk", date: "3 Feb 2026", dist: "HomeBy only" },
            { address: "91 Curlewis Street, Bondi NSW", type: "For Sale", status: "Under offer", price: "$3,200,000", date: "15 Mar 2026", dist: "REA, Domain, View, Homely" },
            { address: "2/5 Consett Avenue, Bondi NSW", type: "Sold", status: "Sold", price: "$1,620,000", date: "8 Nov 2025", dist: "REA, Domain" },
        ],
        agents: [
            { name: "James Mitchell", role: "Owner", email: "james@raywhitebondi.com.au", phone: "+61 412 xxx xxx", licence: "LIC-NSW-28441", lastLogin: "Today 9:14am", status: "Active" },
            { name: "Sarah Chen", role: "Admin", email: "sarah@raywhitebondi.com.au", phone: "+61 423 xxx xxx", licence: "LIC-NSW-31205", lastLogin: "Yesterday", status: "Active" },
            { name: "Michael Torres", role: "Agent", email: "michael@raywhitebondi.com.au", phone: "+61 434 xxx xxx", licence: "LIC-NSW-29103", lastLogin: "2 days ago", status: "Active" },
            { name: "Emma Williams", role: "Agent", email: "emma@raywhitebondi.com.au", phone: "+61 445 xxx xxx", licence: "LIC-NSW-33847", lastLogin: "3 days ago", status: "Active" },
            { name: "David Park", role: "Agent", email: "david@raywhitebondi.com.au", phone: "+61 456 xxx xxx", licence: "LIC-NSW-30291", lastLogin: "1 week ago", status: "Active" },
            { name: "Lisa Johnson", role: "Agent", email: "lisa@raywhitebondi.com.au", phone: "+61 467 xxx xxx", licence: "LIC-NSW-35122", lastLogin: "2 weeks ago", status: "Inactive" },
            { name: "Tom Baker", role: "Assistant", email: "tom@raywhitebondi.com.au", phone: "—", licence: "—", lastLogin: "Never", status: "Pending" },
            { name: "Priya Sharma", role: "Agent", email: "priya@raywhitebondi.com.au", phone: "+61 489 xxx xxx", licence: "LIC-NSW-36201", lastLogin: "Today 11:32am", status: "Active" },
        ],
        billing: { available: false, reason: "Subscription and billing models are not available in St1 yet." },
    };
};
