export const SubscriptionBadge = ({ type }: { type: string }) => {
    const styles: Record<string, string> = {
        "Founding Partner": "bg-purple-50 text-purple-700",
        Premier: "bg-indigo-50 text-indigo-700",
        Professional: "bg-blue-50 text-blue-700",
        Essential: "bg-sky-50 text-sky-700",
    };

    return (
        <span
            className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium ${styles[type] ?? "bg-gray-100 text-gray-600"}`}
        >
            {type ?? "Trial"}
        </span>
    );
};

export const OnboardingBadge = ({ status }: { status: string }) => {
    if (status === "Live")
        return (
            <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                Live
            </span>
        );
    return (
        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {status}
        </span>
    );
};

export const FeedStatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { dot: string; label: string; text: string }> =
        {
            Healthy: {
                dot: "bg-green-500",
                label: "Healthy",
                text: "text-text",
            },
            Warning: {
                dot: "bg-orange-400",
                label: "Warning",
                text: "text-text",
            },
            Failing: { dot: "bg-red-500", label: "Failing", text: "text-text" },
        };

    const item = config[status];

    if (!item)
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span className="text-[12px] text-muted">Not configured</span>
            </div>
        );

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
            <span className={`text-[12px] ${item.text}`}>{item.label}</span>
        </div>
    );
};
