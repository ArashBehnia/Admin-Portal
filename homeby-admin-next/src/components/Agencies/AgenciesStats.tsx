import { AgencyStats } from "@/actions/agenciesActions";

interface AgenciesStatsProps {
    stats: AgencyStats;
}

const AgenciesStats = ({ stats }: AgenciesStatsProps) => {
    const cards = [
        {
            label: "Total agencies",
            value: stats?.total ?? "0",
            dot: null,
            warning: false,
        },
        {
            label: "Active (Live)",
            value: stats?.active ?? "0",
            dot: "bg-green-500",
            warning: false,
        },
        {
            label: "Onboarding in progress",
            value: stats?.onboarding ?? "0",
            dot: "bg-orange-400",
            warning: false,
        },
        {
            label: "Suspended",
            value: stats?.suspended ?? "0",
            dot: "bg-red-500",
            warning: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {cards.map(({ label, value, dot, warning }) => (
                <div
                    key={label}
                    className={`bg-card border border-border rounded shadow-sm p-4 flex flex-col gap-1.5 ${
                        warning ? "border-l-[3px] border-l-red-500" : ""
                    }`}
                >
                    <div className="flex items-center gap-1.5">
                        {dot && (
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`}
                            />
                        )}
                        <span className="text-[12px] text-muted">{label}</span>
                    </div>
                    <span className="text-[24px] font-bold text-text">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AgenciesStats;
