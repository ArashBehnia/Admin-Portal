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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cards.map(({ label, value, dot }) => (
                <div
                    key={label}
                    className="bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-1.5"
                >
                    <div className="flex items-center gap-1.5">
                        {dot && (
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${dot} inline-block shrink-0`}
                            />
                        )}
                        <span className="text-[12px] text-muted">{label}</span>
                    </div>
                    <span className="text-[24px] font-bold text-text">{value}</span>
                </div>
            ))}
        </div>
    );
};

export default EmailTemplatesStats;
