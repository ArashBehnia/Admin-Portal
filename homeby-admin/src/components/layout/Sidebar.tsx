/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
} from 'lucide-react';

export type SidebarItemType = {
    title: string;
    icon: React.ElementType;
    path?: string;
    badge?: number | string;
    badgeColor?: 'yellow' | 'gray';
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
            { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        ],
    },
    {
        label: 'OPERATIONS',
        items: [
            { title: 'Integrations & Feed', icon: Plug, path: '/integrations', badge: 2, badgeColor: 'yellow' },
            { title: 'Agencies', icon: Building2, path: '/agencies' },
            { title: 'Agents', icon: UserCircle, path: '/agents' },
            { title: 'Applications', icon: ClipboardList, path: '/applications', badge: 8, badgeColor: 'yellow' },
            { title: 'Users', icon: Users, path: '/users' },
            { title: 'Segments', icon: Layers, soon: true },
            { title: 'Vendors', icon: Store, path: '/vendors' },
        ],
    },
    {
        label: 'MODERATION',
        items: [
            { title: 'Review Moderation', icon: MessageSquare, path: '/moderation/reviews', badge: 12, badgeColor: 'gray' },
            { title: 'Listing Moderation', icon: Flag, soon: true, badge: 3, badgeColor: 'gray' },
            { title: 'Listing Corrections', icon: FileEdit, soon: true, badge: 7, badgeColor: 'gray' },
        ],
    },
    {
        label: 'COMMERCIAL',
        items: [
            { title: 'Billing & Revenue', icon: CreditCard, soon: true },
            { title: 'Lead Distribution', icon: Send, soon: true },
        ],
    },
    {
        label: 'CONTENT',
        items: [
            { title: 'Insights CMS', icon: BookOpen, soon: true },
            { title: 'Email Templates', icon: Mail, path: '/email-templates' },
        ],
    },
    {
        label: 'SYSTEM',
        items: [
            { title: 'Staff & Roles', icon: Shield, path: '/staff', roles: ['superadmin'] },
            { title: 'Audit Log', icon: History, soon: true },
            { title: 'Blocked IPs', icon: Ban, soon: true },
            { title: 'System Health', icon: Activity, soon: true, path: '/system-health' },
            { title: 'Auth Settings', icon: Key, soon: true },
            { title: 'Feature Flags', icon: Eye, soon: true },
        ],
    },
];

interface SidebarProps {
    onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
    const { role } = useAuth();
    const router = useRouterState();
    const currentPath = router.location.pathname;

    const { data: reviews = [] } = useQuery<any[]>({
        queryKey: ["reviews"],
        queryFn: async () => {
            const response = await axios.get("/data/reviews.json");
            return response.data;
        },
    });
    const pendingReviewsCount = reviews.filter((r: any) => r.status === 'Pending').length;

    return (
        <div className="xl:w-[300px] lg:w-[200px] h-screen bg-card border-r border-border flex flex-col">
            <div className="h-[64px] flex items-center justify-between px-5 border-b border-border/50 shrink-0">
                <div className="font-bold text-lg text-text">HomeBy Admin</div>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-muted hover:text-text transition-colors">
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto pt-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {sidebarConfig.map((group, index) => (
                    <div key={index} className="mb-6 last:mb-0 px-3">
                        {group.label && (
                            <h3 className="px-3 mb-2 text-[11px] font-bold tracking-wider text-muted/70 uppercase">
                                {group.label}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item, itemIndex) => {
                                if (item.roles && role && !item.roles.includes(role)) {
                                    return null;
                                }

                                const Icon = item.icon;
                                const isSoon = item.soon;
                                const isActive = currentPath === item.path;
                                const displayBadge = item.path === '/moderation/reviews' ? pendingReviewsCount : item.badge;

                                const innerContent = (
                                    <>
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Icon size={18} className={`${isSoon ? "text-muted/40" : isActive ? "text-text" : "text-muted group-hover:text-text"} shrink-0`} />
                                            <span className="truncate">{item.title}</span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {isSoon && (
                                                <span className="px-2 py-[2px] text-[10px] font-medium bg-muted/10 text-muted/75 rounded-full">
                                                    Soon
                                                </span>
                                            )}
                                            {displayBadge !== undefined && displayBadge !== null && (typeof displayBadge === 'number' ? displayBadge > 0 : displayBadge !== '') && (
                                                <span className={`flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-medium rounded-full ${item.badgeColor === 'yellow'
                                                        ? 'bg-warning/10 text-warning'
                                                        : 'bg-muted/10 text-muted'
                                                    }`}>
                                                    {displayBadge}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                );

                                const itemClasses = `group flex items-center justify-between px-3 py-2 rounded-md transition-all text-base ${isSoon
                                        ? 'text-muted/50 cursor-not-allowed'
                                        : isActive
                                            ? 'bg-page text-text font-medium'
                                            : 'text-muted hover:text-text font-medium'
                                    }`;

                                // If it's a soon item, or no path is provided, render a div
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

                                // Otherwise render a TanStack router Link
                                return (
                                    <Link
                                        key={itemIndex}
                                        to={item.path as any}
                                        className={itemClasses}
                                    >
                                        {innerContent}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-border shrink-0 text-meta text-muted">
                v0.1 · {role || 'superadmin'}
            </div>
        </div>
    );
}

