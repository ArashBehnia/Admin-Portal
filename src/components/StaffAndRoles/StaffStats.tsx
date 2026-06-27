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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {cards.map((card) => (
                <div key={card.label} className={`bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-1.5 ${card.hover} transition-colors`}>
                    <div className="flex items-center gap-1.5">
                        {card.dot && <span className={`w-1.5 h-1.5 rounded-full ${card.dot} inline-block shrink-0`} />}
                        <span className="text-[12px] text-muted">{card.label}</span>
                    </div>
                    {isLoading ? (
                        <div className="h-6 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[24px] font-bold text-text">{card.value}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StaffStats;