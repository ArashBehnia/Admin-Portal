interface Stats {
    total: number;
    active: number;
    draft: number;
}

interface EmailTemplatesStatsProps {
    stats: Stats;
}

const EmailTemplatesStats = ({ stats }: EmailTemplatesStatsProps) => {
    const cards = [
        { label: "Total templates", value: stats.total, dot: null },
        { label: "Active", value: stats.active, dot: "bg-success" },
        {
            label: "Draft (not yet active)",
            value: stats.draft,
            dot: "bg-warning",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
            {cards.map(({ label, value, dot }) => (
                <div
                    key={label}
                    className="bg-card border border-border rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm"
                >
                    <div className="flex items-center gap-1.5">
                        {dot && (
                            <span
                                className={`w-2 h-2 rounded-full ${dot} inline-block shrink-0`}
                            />
                        )}
                        <span className="text-muted text-[11px] sm:text-[12px]">{label}</span>
                    </div>
                    <span className="text-[22px] sm:text-[26px] font-bold text-text leading-none">{value}</span>
                </div>
            ))}
        </div>
    );
};

export default EmailTemplatesStats;
