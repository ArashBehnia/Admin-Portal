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
        <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Attention required
            </span>
            <div className="flex flex-wrap items-center gap-3">
                {items.map((item, idx) => {
                    const href = idx === 0 ? "/integrations" : idx === 1 ? "/agencies" : idx === 2 ? "/applications" : getAttentionLink(item.id);
                    return (
                        <Link
                            key={item.id ?? idx}
                            href={href}
                            className="bg-[#FFF8F3] hover:bg-[#FFF2EA] border border-[#FFDCC3] text-[#E05C00] rounded px-3 py-1.5 flex items-center gap-2 text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
                        >
                            {renderAttentionIcon(item.id)}
                            <span>{item.label}</span>
                            <ArrowRight size={14} className="stroke-[2.5]" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default AttentionAlerts;
