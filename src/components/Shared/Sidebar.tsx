"use client";
import Link from "next/link";
import {
    LayoutDashboard,
    Plug,
    Building2,
    UserCircle,
    ClipboardList,
    Users,
    Layers,
    Store,
    MessageSquare,
    Flag,
    FileEdit,
    CreditCard,
    Send,
    BookOpen,
    Mail,
    Shield,
    History,
    Ban,
    Activity,
    Key,
    Eye,
    X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { User } from "@/lib/auth";

export type SidebarItemType = {
    title: string;
    icon: React.ElementType;
    path?: string;
    badge?: number | string;
    badgeColor?: "yellow" | "gray";
    soon?: boolean;
    roles?: string[];
};

export type SidebarGroupType = {
    label?: string;
    items: SidebarItemType[];
};

const sidebarConfig: SidebarGroupType[] = [
    {
        items: [
            { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        ],
    },
    {
        label: "OPERATIONS",
        items: [
            {
                title: "Integrations & Feed",
                icon: Plug,
                path: "/integrations",
            },
            { title: "Agencies", icon: Building2, path: "/agencies" },
            { title: "Agents", icon: UserCircle, path: "/agents" },
            {
                title: "Applications",
                icon: ClipboardList,
                path: "/applications",
            },
            // { title: "Users", icon: Users, path: "/users" },
            // { title: "Segments", icon: Layers, path: "/segments" },
            // { title: "Vendors", icon: Store, path: "/vendors" },
        ],
    },
    // {
    //     label: "MODERATION",
    //     items: [
    //         {
    //             title: "Review Moderation",
    //             icon: MessageSquare,
    //             path: "/moderation/reviews",
    //         },
    //         {
    //             title: "Listing Moderation",
    //             icon: Flag,
    //             path: "/moderation/listings",
    //         },
    //         {
    //             title: "Listing Corrections",
    //             icon: FileEdit,
    //             path: "/moderation/corrections",
    //         },
    //     ],
    // },
    // {
    //     label: "COMMERCIAL",
    //     items: [
    //         { title: "Billing & Revenue", icon: CreditCard, path: "/billing" },
    //         { title: "Lead Distribution", icon: Send, path: "/leads" },
    //     ],
    // },
    {
        label: "CONTENT",
        items: [
            // { title: "Insights CMS", icon: BookOpen, path: "/insights" },
            { title: "Email Templates", icon: Mail, path: "/email-templates" },
        ],
    },
    {
        label: "SYSTEM",
        items: [
            {
                title: "Staff & Roles",
                icon: Shield,
                path: "/staff",
            },
            // { title: "Audit Log", icon: History, path: "/audit-log" },
            // { title: "Blocked IPs", icon: Ban, path: "/blocked-ips" },
            // {
            //     title: "System Health",
            //     icon: Activity,
            //     path: "/system-health",
            // },
            // { title: "Auth Settings", icon: Key, path: "/auth-settings" },
            // { title: "Feature Flags", icon: Eye, path: "/feature-flags" },
        ],
    },
];

interface SidebarProps {
    onClose?: () => void;
    user: User | null;
}

const Sidebar = ({ onClose, user }: SidebarProps) => {
    const currentPath = usePathname();
    const userRole = (user?.role as string) || "user";

    const hasAccess = (item: SidebarItemType) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.includes(userRole);
    };

    return (
        <div className="xl:w-[300px] lg:w-[200px] h-screen bg-card border-r border-border flex flex-col">
            <div className="h-[64px] flex items-center justify-between px-5 border-b border-border/50 shrink-0">
                <div className="font-bold text-lg text-text">HomeBy Admin</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden text-muted hover:text-text transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto pt-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {sidebarConfig.map((group, index) => {
                    const visibleItems = group.items.filter(hasAccess);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={index} className="mb-6 last:mb-0 px-3">
                            {group.label && (
                                <h3 className="px-3 mb-2 text-[11px] font-bold tracking-wider text-muted/70 uppercase">
                                    {group.label}
                                </h3>
                            )}
                            <div className="space-y-0.5">
                                {visibleItems.map((item, itemIndex) => {
                                    const Icon = item.icon;
                                    const isSoon = item.soon;
                                    const isActive = currentPath === item.path;
                                    const displayBadge = item.badge;

                                    const itemClasses = `group flex items-center justify-between px-3 py-2 rounded-md transition-all text-base ${
                                        isSoon
                                            ? "text-muted/50 cursor-not-allowed"
                                            : isActive
                                              ? "bg-page text-text font-medium"
                                              : "text-muted hover:text-text font-medium"
                                    }`;

                                    const innerContent = (
                                        <>
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Icon
                                                    size={18}
                                                    className={`${
                                                        isSoon
                                                            ? "text-muted/40"
                                                            : isActive
                                                              ? "text-text"
                                                              : "text-muted group-hover:text-text"
                                                    } shrink-0`}
                                                />
                                                <span className="truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isSoon && (
                                                    <span className="px-2 py-[2px] text-[10px] font-medium bg-muted/10 text-muted/75 rounded-full">
                                                        Soon
                                                    </span>
                                                )}
                                                {displayBadge !== undefined &&
                                                    displayBadge !== null &&
                                                    (typeof displayBadge ===
                                                    "number"
                                                        ? displayBadge > 0
                                                        : displayBadge !==
                                                          "") && (
                                                        <span
                                                            className={`flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-medium rounded-full ${
                                                                item.badgeColor ===
                                                                "yellow"
                                                                    ? "bg-warning/10 text-warning"
                                                                    : "bg-muted/10 text-muted"
                                                            }`}
                                                        >
                                                            {displayBadge}
                                                        </span>
                                                    )}
                                            </div>
                                        </>
                                    );

                                    if (isSoon || !item.path) {
                                        return (
                                            <div
                                                key={itemIndex}
                                                className={itemClasses}
                                            >
                                                {innerContent}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={itemIndex}
                                            href={item.path}
                                            className={itemClasses}
                                        >
                                            {innerContent}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border shrink-0 text-meta text-muted">
                v0.1 · {userRole}
            </div>
        </div>
    );
};

export default Sidebar;
