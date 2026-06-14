"use client";

import { TABS, AgencyTab } from "@/actions/agenciesActions";

interface AgencyTabsProps {
    activeTab: AgencyTab;
    onChange: (tab: AgencyTab) => void;
}

const AgencyTabs = ({ activeTab, onChange }: AgencyTabsProps) => {
    return (
        <div className="border-b border-border">
            <div className="flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={`pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer ${
                            activeTab === tab
                                ? "border-accent text-text"
                                : "border-transparent text-muted hover:text-text"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AgencyTabs;
