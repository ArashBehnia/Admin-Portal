import { SystemHealth as SystemHealthType } from "@/actions/dashboardActions";

interface SystemHealthProps {
    health: SystemHealthType;
}

const SystemHealth = ({ health }: SystemHealthProps) => {
    const cards = [
        {
            label: "API status",
            content: (
                <div className="flex items-center gap-2 mt-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${health.apiStatus.status === "operational" ? "bg-success" : health.apiStatus.status === "maintenance" ? "bg-warning" : "bg-danger"} animate-pulse`} />
                    <span className="text-xl font-bold text-text">
                        {health.apiStatus.status}
                    </span>
                </div>
            ),
            warning: false,
        },
        {
            label: "Queue depth (REAXML)",
            content: (
                <span className="text-2xl font-bold text-text mt-2 block">
                    {health.queueDepth}
                </span>
            ),
            warning: false,
        },
        {
            label: "Failed jobs (24h)",
            content: (
                <span className="text-2xl font-bold text-text mt-2 block">
                    {health.failedJobs}
                </span>
            ),
            warning: false,
        },
        {
            label: "Stale feeds >24h",
            content: (
                <div className="flex items-center gap-2 mt-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                    <span className="text-2xl font-bold text-text">
                        {health.staleFeeds}
                    </span>
                </div>
            ),
            warning: true,
        },
        {
            label: "Feeds healthy",
            content: (
                <div className="flex items-center gap-2 mt-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-success" />
                    <span className="text-2xl font-bold text-text">
                        {health.feedsHealthy.healthy} /{" "}
                        {health.feedsHealthy.total}
                    </span>
                </div>
            ),
            warning: false,
        },
    ];

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    System health
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                    Coming soon
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 opacity-50 pointer-events-none">
                {cards.map(({ label, content, warning }) => (
                    <div
                        key={label}
                        className={`bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[85px] ${
                            warning ? "border-l-2 border-l-warning" : ""
                        }`}
                    >
                        <span className="text-[12px] text-text font-semibold">
                            {label}
                        </span>
                        {content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemHealth;
