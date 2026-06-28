import { AgencyStats } from "@/types/agencyTypes";

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
            label: "Onboarding",
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
        {
            label: "Trial",
            value: stats?.trial ?? "0",
            dot: "bg-blue-400",
            warning: false,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3">
            {cards.map(({ label, value, dot, warning }) => (
                <div
                    key={label}
                    className={`bg-card border border-border rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm ${
                        warning ? "border-l-[3px] border-l-red-500" : ""
                    }`}
                >
                    <div className="flex items-center gap-1.5">
                        {dot && (
                            <div
                                className={`w-2 h-2 rounded-full ${dot} shrink-0`}
                            />
                        )}
                        <span className="text-muted text-[11px] sm:text-[12px]">{label}</span>
                    </div>
                    <span className="text-[22px] sm:text-[26px] font-bold text-text leading-none">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AgenciesStats;
