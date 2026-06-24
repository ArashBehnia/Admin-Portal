"use client";

import { TABS, AgencyTab } from "@/actions/agenciesActions";

const COMING_SOON_TABS: AgencyTab[] = [
    "Subscription & Billing",
    "Reviews",
    "Audit",
];

interface AgencyTabsProps {
    activeTab: AgencyTab;
    onChange: (tab: AgencyTab) => void;
}

const AgencyTabs = ({ activeTab, onChange }: AgencyTabsProps) => {
    return (
        <div className="border-b border-border">
            <div className="flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {TABS.map((tab) => {
                    const isComingSoon = COMING_SOON_TABS.includes(tab);
                    return (
                        <button
                            key={tab}
                            onClick={() => !isComingSoon && onChange(tab)}
                            disabled={isComingSoon}
                            className={`pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                                isComingSoon
                                    ? "border-transparent text-muted/50 cursor-not-allowed"
                                    : activeTab === tab
                                      ? "border-accent text-text cursor-pointer"
                                      : "border-transparent text-muted hover:text-text cursor-pointer"
                            }`}
                        >
                            {tab}
                            {isComingSoon && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                    Soon
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AgencyTabs;
