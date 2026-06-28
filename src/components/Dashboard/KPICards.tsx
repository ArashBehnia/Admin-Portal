import { OverviewData } from "@/actions/dashboardActions";

interface KPICardsProps {
    kpis?: OverviewData["kpis"];
    getTrendClass: (type: "success" | "warning" | "danger") => string;
}

const KPICards = ({ kpis, getTrendClass }: KPICardsProps) => {
    if (!kpis) return null;

    const cards = [
        { label: "Active agencies", data: kpis.activeAgencies, warning: false, comingSoon: false },
        {
            label: "Pending applications",
            data: kpis.pendingApplications,
            warning: false,
            comingSoon: false,
        },
        {
            label: "Feed failures (24h)",
            data: kpis.feedFailures,
            warning: true,
            comingSoon: false,
        },
        { label: "MRR", data: kpis.mrr, warning: false, comingSoon: true },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {cards.map(({ label, data, warning, comingSoon }) => (
                <div
                    key={label}
                    className={`bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px] relative ${
                        warning && !comingSoon ? "border-l-2 border-l-warning" : ""
                    } ${comingSoon ? "opacity-50" : ""}`}
                >
                    {comingSoon && (
                        <span className="absolute top-2 right-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            Coming soon
                        </span>
                    )}
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            {label}
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {comingSoon ? "–" : data.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${comingSoon ? "text-muted" : getTrendClass(data.trendType)}`}
                    >
                        {comingSoon ? "Billing integration pending" : data.trend}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default KPICards;
