'use client';

interface StaffTabsProps {
    activeTab: 'Staff' | 'Roles';
    onChange: (tab: 'Staff' | 'Roles') => void;
}

const StaffTabs = ({ activeTab, onChange }: StaffTabsProps) => {
    return (
        <div className="flex gap-8 border-b border-border mt-3">
            {(['Staff', 'Roles'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-all relative cursor-pointer ${
                        activeTab === tab
                            ? 'border-accent text-accent'
                            : 'border-transparent text-muted hover:text-text'
                    }`}
                >
                    {tab}
                    {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default StaffTabs;