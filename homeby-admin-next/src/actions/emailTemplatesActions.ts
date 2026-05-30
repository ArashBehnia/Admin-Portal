export type TemplateCategory =
    | "Auth"
    | "Account"
    | "Agency"
    | "Reviews"
    | "Billing"
    | "System";
export type TemplateChannel = "Email" | "SMS";
export type TemplateStatus = "Active" | "Draft";

export type Template = {
    id: string;
    name: string;
    category: TemplateCategory;
    channels: TemplateChannel[];
    lastModified: string;
    modifiedBy: string;
    status: TemplateStatus;
};

export const CATEGORIES = [
    "All categories",
    "Auth",
    "Account",
    "Agency",
    "Reviews",
    "Billing",
    "System",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const fetchEmailTemplates = async (): Promise<Template[]> => {
    return [
        {
            id: "1",
            name: "signup",
            category: "Auth",
            channels: ["Email"],
            lastModified: "2 days ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "2",
            name: "otp",
            category: "Auth",
            channels: ["Email", "SMS"],
            lastModified: "2 days ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "3",
            name: "verify",
            category: "Auth",
            channels: ["Email"],
            lastModified: "2 days ago",
            modifiedBy: "Hirad",
            status: "Active",
        },
        {
            id: "4",
            name: "password-reset",
            category: "Auth",
            channels: ["Email"],
            lastModified: "1 week ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "5",
            name: "welcome-user",
            category: "Account",
            channels: ["Email"],
            lastModified: "3 days ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "6",
            name: "account-suspended",
            category: "Account",
            channels: ["Email"],
            lastModified: "2 weeks ago",
            modifiedBy: "Sarah Chen",
            status: "Active",
        },
        {
            id: "7",
            name: "agency-approved",
            category: "Agency",
            channels: ["Email"],
            lastModified: "1 day ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "8",
            name: "agency-rejected",
            category: "Agency",
            channels: ["Email"],
            lastModified: "1 week ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "9",
            name: "agent-welcome",
            category: "Agency",
            channels: ["Email"],
            lastModified: "1 day ago",
            modifiedBy: "Arash",
            status: "Active",
        },
        {
            id: "10",
            name: "review-approved",
            category: "Reviews",
            channels: ["Email"],
            lastModified: "3 weeks ago",
            modifiedBy: "Sarah Chen",
            status: "Active",
        },
        {
            id: "11",
            name: "review-rejected",
            category: "Reviews",
            channels: ["Email"],
            lastModified: "3 weeks ago",
            modifiedBy: "Sarah Chen",
            status: "Active",
        },
        {
            id: "12",
            name: "invoice-generated",
            category: "Billing",
            channels: ["Email"],
            lastModified: "1 month ago",
            modifiedBy: "Hirad",
            status: "Active",
        },
        {
            id: "13",
            name: "payment-failed",
            category: "Billing",
            channels: ["Email"],
            lastModified: "1 month ago",
            modifiedBy: "Hirad",
            status: "Draft",
        },
        {
            id: "14",
            name: "feed-failure-alert",
            category: "System",
            channels: ["Email"],
            lastModified: "2 weeks ago",
            modifiedBy: "Hirad",
            status: "Draft",
        },
    ];
};
