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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map(({ label, value, dot }) => (
                <div
                    key={label}
                    className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-1"
                >
                    <p className="text-xs text-muted font-medium flex items-center gap-1.5">
                        {dot && (
                            <span
                                className={`w-2 h-2 rounded-full ${dot} inline-block`}
                            />
                        )}
                        {label}
                    </p>
                    <p className="text-3xl font-bold text-text">{value}</p>
                </div>
            ))}
        </div>
    );
};

export default EmailTemplatesStats;
