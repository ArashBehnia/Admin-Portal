import { OverviewData } from "@/actions/dashboardActions";

interface KPICardsProps {
    kpis?: OverviewData["kpis"];
    getTrendClass: (type: "success" | "warning" | "danger") => string;
}

const KPICards = ({ kpis, getTrendClass }: KPICardsProps) => {
    if (!kpis) return null;

    const cards = [
        { label: "Active agencies", data: kpis.activeAgencies, warning: false },
        {
            label: "Pending applications",
            data: kpis.pendingApplications,
            warning: false,
        },
        {
            label: "Feed failures (24h)",
            data: kpis.feedFailures,
            warning: true,
        },
        { label: "MRR", data: kpis.mrr, warning: false },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ label, data, warning }) => (
                <div
                    key={label}
                    className={`bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px] ${
                        warning ? "border-l-2 border-l-warning" : ""
                    }`}
                >
                    <div>
                        <span className="text-[13px] text-muted font-bold">
                            {label}
                        </span>
                        <p className="text-3xl font-black text-text mt-1">
                            {data.value}
                        </p>
                    </div>
                    <p
                        className={`text-[12px] font-bold mt-2 ${getTrendClass(data.trendType)}`}
                    >
                        {data.trend}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default KPICards;
