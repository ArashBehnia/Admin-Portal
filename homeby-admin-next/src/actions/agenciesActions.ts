// ─────────────────────────────────────────────────────────────────────
// AGENCIES LIST TYPES & DATA
// ─────────────────────────────────────────────────────────────────────

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
};

export const AGENCY_FILTERS = [
    "All",
    "Active",
    "Onboarding",
    "Pending",
    "Suspended",
    "Trial",
] as const;
export type AgencyFilter = (typeof AGENCY_FILTERS)[number];

export const fetchAgenciesData = async (): Promise<AgenciesData> => {
    return {
        stats: {
            total: "1,247",
            active: "847",
            onboarding: "23",
            suspended: "4",
        },
        agencies: [
            {
                id: "1",
                name: "Ray White Bondi",
                location: "Bondi, NSW",
                subscription: "Founding Partner",
                onboarding: "Live",
                listings: 247,
                agents: 8,
                feed: "Healthy",
                mrr: "$890/mo",
                lastActivity: "2 hours ago",
                highlight: null,
            },
            {
                id: "2",
                name: "McGrath Surry Hills",
                location: "Surry Hills, NSW",
                subscription: "Founding Partner",
                onboarding: "Live",
                listings: 183,
                agents: 6,
                feed: "Healthy",
                mrr: "$890/mo",
                lastActivity: "4 hours ago",
                highlight: null,
            },
            {
                id: "3",
                name: "Belle Property Mosman",
                location: "Mosman, NSW",
                subscription: "Premier",
                onboarding: "Live",
                listings: 142,
                agents: 5,
                feed: "Healthy",
                mrr: "$650/mo",
                lastActivity: "1 day ago",
                highlight: null,
            },
            {
                id: "4",
                name: "LJ Hooker Parramatta",
                location: "Parramatta, NSW",
                subscription: "Professional",
                onboarding: "Live",
                listings: 98,
                agents: 4,
                feed: "Healthy",
                mrr: "$450/mo",
                lastActivity: "2 days ago",
                highlight: null,
            },
            {
                id: "5",
                name: "Harcourts Melbourne",
                location: "Melbourne, VIC",
                subscription: "Founding Partner",
                onboarding: "Live",
                listings: 312,
                agents: 11,
                feed: "Healthy",
                mrr: "$890/mo",
                lastActivity: "3 hours ago",
                highlight: null,
            },
            {
                id: "6",
                name: "Jellis Craig Fitzroy",
                location: "Fitzroy, VIC",
                subscription: "Professional",
                onboarding: "Validation",
                listings: 0,
                agents: 3,
                feed: "Warning",
                mrr: "$450/mo",
                lastActivity: "1 day ago",
                highlight: "orange",
            },
            {
                id: "7",
                name: "Barry Plant Doncaster",
                location: "Doncaster, VIC",
                subscription: "Trial",
                onboarding: "Syncing",
                listings: 0,
                agents: 2,
                feed: "Warning",
                mrr: "$0/mo",
                lastActivity: "31 hours ago",
                highlight: "orange",
            },
            {
                id: "8",
                name: "Nelson Alexander",
                location: "Carlton, VIC",
                subscription: "Essential",
                onboarding: "Live",
                listings: 176,
                agents: 7,
                feed: "Healthy",
                mrr: "$290/mo",
                lastActivity: "5 hours ago",
                highlight: null,
            },
            {
                id: "9",
                name: "Stone Real Estate Newtown",
                location: "Newtown, NSW",
                subscription: "Professional",
                onboarding: "Live",
                listings: 134,
                agents: 5,
                feed: "Healthy",
                mrr: "$450/mo",
                lastActivity: "6 hours ago",
                highlight: null,
            },
            {
                id: "10",
                name: "First National Geelong",
                location: "Geelong, VIC",
                subscription: "Trial",
                onboarding: "Approved",
                listings: 0,
                agents: 1,
                feed: "Failing",
                mrr: "$0/mo",
                lastActivity: "5 days ago",
                highlight: "red",
            },
            {
                id: "11",
                name: "Hocking Stuart Richmond",
                location: "Richmond, VIC",
                subscription: "Trial",
                onboarding: "CRM Connected",
                listings: 0,
                agents: 2,
                feed: "Failing",
                mrr: "$0/mo",
                lastActivity: "3 days ago",
                highlight: "red",
            },
            {
                id: "12",
                name: "First Home Buyers Melbourne",
                location: "South Yarra, VIC",
                subscription: "Trial",
                onboarding: "Approved",
                listings: 0,
                agents: 1,
                feed: "Not configured",
                mrr: "$0/mo",
                lastActivity: "1 week ago",
                highlight: null,
            },
        ],
    };
};

// ─────────────────────────────────────────────────────────────────────
// AGENCY DETAIL TYPES & DATA
// ─────────────────────────────────────────────────────────────────────

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

export const fetchAgencyDetailData = async (): Promise<AgencyDetailData> => {
    return {
        abn: "51 824 753 556",
        memberSince: "Dec 2024",
        crmProvider: "Box+Dice",
        feedLastSynced: "14 min ago",
        activityTimeline: [
            {
                title: "Subscription upgraded to Founding Partner",
                date: "10 Jan 2026",
                color: "bg-accent",
            },
            {
                title: "Feed recovered — syncing resumed",
                date: "8 Jan 2026",
                color: "bg-green-500",
            },
            {
                title: "Feed warning — stale >24h",
                date: "7 Jan 2026",
                color: "bg-orange-400",
            },
            {
                title: "First sync completed — 47 listings imported",
                date: "20 Dec 2024",
                color: "bg-green-500",
            },
            {
                title: "CRM connected — Box+Dice REAXML",
                date: "18 Dec 2024",
                color: "bg-green-500",
            },
            {
                title: "Welcome email sent with temporary credentials",
                date: "15 Dec 2024",
                color: "bg-accent",
            },
            {
                title: "Application approved by Arash",
                date: "15 Dec 2024",
                color: "bg-green-500",
            },
            {
                title: "Agency application received",
                date: "10 Dec 2024",
                color: "bg-green-500",
            },
        ],
        distributionPortals: [
            {
                name: "HomeBy",
                icon: "H",
                color: "text-accent bg-blue-50",
                status: "Connected",
                listings: "247 published",
                active: true,
            },
            {
                name: "Realestate.com",
                icon: "R",
                color: "text-red-600 bg-red-50",
                status: "Connected",
                listings: "247 published",
                active: true,
            },
            {
                name: "Domain",
                icon: "D",
                color: "text-green-600 bg-green-50",
                status: "Connected",
                listings: "247 published",
                active: true,
            },
            {
                name: "View",
                icon: "V",
                color: "text-purple-600 bg-purple-50",
                status: "Connected",
                listings: "247 published",
                active: true,
            },
            {
                name: "Homely",
                icon: "H",
                color: "text-muted bg-page",
                status: "Not connected",
                listings: "0 published",
                active: false,
            },
        ],
        internalNotes:
            "Founding partner — onboarded Dec 2024. Primary contact: James Mitchell (james@raywhitebondi.com.au, +61 412 xxx xxx). CRM: Box+Dice, REAXML feed configured by Hirad on 15 Dec 2024. Agency expressed interest in Domain exclusivity deal — follow up Q3 2026. High-volume agency, priority support.",
        auditLog: [
            {
                time: "8 May 2026 14:22",
                action: "Review flagged",
                user: "Arash",
                details: "Review ID #4821 flagged for moderation",
            },
            {
                time: "2 May 2026 14:32",
                action: "Notes updated",
                user: "Arash",
                details: "Internal notes edited",
            },
            {
                time: "15 Apr 2026 09:11",
                action: "Tier changed",
                user: "Sarah Chen",
                details: "Professional → Founding Partner",
            },
            {
                time: "20 Jan 2026 11:44",
                action: "Feed paused",
                user: "Hirad",
                details: "Manual pause for maintenance window",
            },
            {
                time: "15 Dec 2024 16:30",
                action: "Agency approved",
                user: "Arash",
                details: "Application approved, welcome email sent",
            },
        ],
        reviews: [
            {
                name: "David K.",
                agent: "James Mitchell",
                rating: 5,
                comment: "James made the entire process...",
                status: "Approved",
                date: "3 May 2026",
                action: "View",
            },
            {
                name: "Anonymous",
                agent: "Sarah Chen",
                rating: 3,
                comment: "Good communication but...",
                status: "Pending",
                date: "8 May 2026",
                action: "Review",
            },
            {
                name: "Mark T.",
                agent: "Michael Torres",
                rating: 2,
                comment: "Unfortunately our experience...",
                status: "Rejected",
                date: "1 Apr 2026",
                action: "View",
            },
        ],
        invoices: [
            {
                date: "1 May 2026",
                period: "May 2026",
                amount: "$890",
                status: "Paid",
            },
            {
                date: "1 Apr 2026",
                period: "Apr 2026",
                amount: "$890",
                status: "Paid",
            },
            {
                date: "1 Mar 2026",
                period: "Mar 2026",
                amount: "$890",
                status: "Paid",
            },
            {
                date: "1 Feb 2026",
                period: "Feb 2026",
                amount: "$890",
                status: "Overdue",
            },
        ],
        listings: [
            {
                address: "14/8 Campbell Parade, Bondi NSW",
                type: "For Sale",
                status: "Active",
                price: "$1,850,000",
                date: "12 Jan 2026",
                dist: "REA, Domain, View",
            },
            {
                address: "3 Blair Street, Bondi NSW",
                type: "For Sale",
                status: "Active",
                price: "$2,100,000",
                date: "28 Jan 2026",
                dist: "REA, Domain",
            },
            {
                address: "7/22 Hall Street, Bondi NSW",
                type: "For Rent",
                status: "Active",
                price: "$850/wk",
                date: "3 Feb 2026",
                dist: "HomeBy only",
            },
            {
                address: "91 Curlewis Street, Bondi NSW",
                type: "For Sale",
                status: "Under offer",
                price: "$3,200,000",
                date: "15 Mar 2026",
                dist: "REA, Domain, View, Homely",
            },
            {
                address: "2/5 Consett Avenue, Bondi NSW",
                type: "Sold",
                status: "Sold",
                price: "$1,620,000",
                date: "8 Nov 2025",
                dist: "REA, Domain",
            },
        ],
        agents: [
            {
                name: "James Mitchell",
                role: "Owner",
                email: "james@raywhitebondi.com.au",
                phone: "+61 412 xxx xxx",
                licence: "LIC-NSW-28441",
                lastLogin: "Today 9:14am",
                status: "Active",
            },
            {
                name: "Sarah Chen",
                role: "Admin",
                email: "sarah@raywhitebondi.com.au",
                phone: "+61 423 xxx xxx",
                licence: "LIC-NSW-31205",
                lastLogin: "Yesterday",
                status: "Active",
            },
            {
                name: "Michael Torres",
                role: "Agent",
                email: "michael@raywhitebondi.com.au",
                phone: "+61 434 xxx xxx",
                licence: "LIC-NSW-29103",
                lastLogin: "2 days ago",
                status: "Active",
            },
            {
                name: "Emma Williams",
                role: "Agent",
                email: "emma@raywhitebondi.com.au",
                phone: "+61 445 xxx xxx",
                licence: "LIC-NSW-33847",
                lastLogin: "3 days ago",
                status: "Active",
            },
            {
                name: "David Park",
                role: "Agent",
                email: "david@raywhitebondi.com.au",
                phone: "+61 456 xxx xxx",
                licence: "LIC-NSW-30291",
                lastLogin: "1 week ago",
                status: "Active",
            },
            {
                name: "Lisa Johnson",
                role: "Agent",
                email: "lisa@raywhitebondi.com.au",
                phone: "+61 467 xxx xxx",
                licence: "LIC-NSW-35122",
                lastLogin: "2 weeks ago",
                status: "Inactive",
            },
            {
                name: "Tom Baker",
                role: "Assistant",
                email: "tom@raywhitebondi.com.au",
                phone: "—",
                licence: "—",
                lastLogin: "Never",
                status: "Pending",
            },
            {
                name: "Priya Sharma",
                role: "Agent",
                email: "priya@raywhitebondi.com.au",
                phone: "+61 489 xxx xxx",
                licence: "LIC-NSW-36201",
                lastLogin: "Today 11:32am",
                status: "Active",
            },
        ],
    };
};
