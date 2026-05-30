"use client";

import Link from "next/link";
import {
    AlertTriangle,
    Clock,
    MessageSquare,
    User,
    ArrowRight,
} from "lucide-react";
import { AttentionItem } from "@/actions/dashboardActions";

interface AttentionAlertsProps {
    items: AttentionItem[];
    getAttentionLink: (id: string) => string;
}

const renderAttentionIcon = (id: string) => {
    switch (id) {
        case "feeds":
            return <AlertTriangle size={15} />;
        case "blocked":
            return <Clock size={15} />;
        case "reviews":
            return <MessageSquare size={15} />;
        default:
            return <User size={15} />;
    }
};

const AttentionAlerts = ({ items, getAttentionLink }: AttentionAlertsProps) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted/90">
                Attention required
            </span>
            <div className="flex flex-wrap items-center gap-3">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={getAttentionLink(item.id)}
                        className="bg-warning/10 hover:bg-warning/15 border border-warning/20 text-warning rounded-md px-3.5 py-2 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer"
                    >
                        {renderAttentionIcon(item.id)}
                        <span>{item.label}</span>
                        <ArrowRight size={13} className="stroke-[2.5]" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AttentionAlerts;
