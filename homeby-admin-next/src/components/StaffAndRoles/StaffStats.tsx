'use client';

interface Stats {
    total: number;
    active: number;
    mfaEnabled: number;
    mfaNotSetUp: number;
}

interface StaffStatsProps {
    stats: Stats;
    isLoading: boolean;
}

const StaffStats = ({ stats, isLoading }: StaffStatsProps) => {
    const cards = [
        { label: 'Total staff', value: stats.total, dot: null, hover: 'hover:border-accent/40' },
        { label: 'Active', value: stats.active, dot: 'bg-success', hover: 'hover:border-success/40' },
        { label: 'MFA enabled', value: stats.mfaEnabled, dot: 'bg-success', hover: 'hover:border-success/40' },
        { label: 'MFA not set up', value: stats.mfaNotSetUp, dot: 'bg-warning', hover: 'hover:border-warning/40' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card) => (
                <div key={card.label} className={`bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col gap-2 ${card.hover} transition-colors`}>
                    <div className="flex items-center gap-2">
                        {card.dot && <span className={`w-2 h-2 rounded-full ${card.dot} inline-block`} />}
                        <span className="text-[13px] text-muted font-medium">{card.label}</span>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[28px] font-bold text-text leading-none font-sans">{card.value}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StaffStats;