interface Stats {
    total: number;
    pending: number;
    approvedThisMonth: number;
    rejected: number;
}

interface ApplicationStatsProps {
    stats: Stats;
}

const ApplicationStats = ({ stats }: ApplicationStatsProps) => {
    const cards = [
        { label: "Total applications", value: stats.total, dot: null },
        { label: "Pending review", value: stats.pending, dot: "bg-orange-400" },
        {
            label: "Approved this month",
            value: stats.approvedThisMonth,
            dot: "bg-green-500",
        },
        { label: "Rejected", value: stats.rejected, dot: "bg-red-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-2"
                >
                    <div className="flex items-center gap-1.5">
                        {card.dot && (
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${card.dot}`}
                            />
                        )}
                        <span className="text-[13px] text-muted font-medium">
                            {card.label}
                        </span>
                    </div>
                    <span className="text-[24px] font-bold text-text">
                        {card.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ApplicationStats;
