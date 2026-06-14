import { MoreHorizontal } from 'lucide-react';
import { Agency } from '@/actions/agenciesActions';
import { SubscriptionBadge, OnboardingBadge } from '@/components/Agencies/AgencyBadges';

interface AgencyHeaderProps {
    agency: Agency;
    abn: string;
    memberSince: string;
    initials: string;
}

const AgencyHeader = ({ agency, abn, memberSince, initials }: AgencyHeaderProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-page flex items-center justify-center text-[16px] font-bold text-text shrink-0">
                        {initials}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-[20px] font-bold text-text leading-tight">{agency?.name}</h1>
                        <div className="flex items-center gap-3 text-[12px] text-muted">
                            <span>{agency?.location}</span>
                            <span>ABN: {abn}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <SubscriptionBadge type={agency?.subscription ?? ''} />
                            <OnboardingBadge status={agency?.onboarding ?? ''} />
                            <div className="flex items-center gap-1.5 ml-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[11px] font-medium text-text">{agency?.feed}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="text-muted hover:text-text p-1 rounded transition-colors focus:outline-none border border-border cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 border-t border-border">
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted">Active listings</span>
                    <span className="text-[18px] font-bold text-text">{agency?.listings}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted">Active agents</span>
                    <span className="text-[18px] font-bold text-text">{agency?.agents}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted">MRR</span>
                    <span className="text-[18px] font-bold text-text">{agency?.mrr}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[12px] text-muted">Member since</span>
                    <span className="text-[18px] font-bold text-text">{memberSince}</span>
                </div>
            </div>
        </div>
    );
};

export default AgencyHeader;