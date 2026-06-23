type DotColor = "green" | "orange" | "red" | "-";

type DistributionRow = {
    agency: string;
    rea?: DotColor;
    domain?: DotColor;
    view?: DotColor;
    homely?: DotColor;
    total: string;
    lastPush: string;
    status?: string;
    highlight?: "orange" | "red";
};

const DOT_COLORS: Record<string, string> = {
    green: "bg-green-500",
    orange: "bg-orange-400",
    red: "bg-red-500",
};

const DotCell = ({ value }: { value?: DotColor }) => {
    if (!value || value === "-") return <span className="text-muted">—</span>;
    return (
        <div
            className={`w-1.5 h-1.5 rounded-full mx-auto ${DOT_COLORS[value] ?? ""}`}
        />
    );
};

const DISTRIBUTION_DATA: DistributionRow[] = [
    {
        agency: "Ray White Bondi",
        rea: "green",
        domain: "green",
        view: "green",
        homely: "green",
        total: "988",
        lastPush: "2 hours ago",
    },
    {
        agency: "McGrath Surry Hills",
        rea: "green",
        domain: "green",
        view: "green",
        total: "549",
        lastPush: "4 hours ago",
    },
    {
        agency: "Belle Property Mosman",
        rea: "green",
        domain: "green",
        view: "green",
        homely: "green",
        total: "426",
        lastPush: "1 day ago",
    },
    {
        agency: "LJ Hooker Parramatta",
        rea: "green",
        domain: "green",
        total: "196",
        lastPush: "2 days ago",
    },
    {
        agency: "Harcourts Melbourne",
        rea: "green",
        domain: "green",
        view: "green",
        homely: "green",
        total: "936",
        lastPush: "3 hours ago",
    },
    {
        agency: "Jellis Craig Fitzroy",
        rea: "orange",
        domain: "orange",
        view: "orange",
        total: "0",
        lastPush: "1 day ago",
        highlight: "orange",
    },
    {
        agency: "Barry Plant Doncaster",
        status: "HomeBy only",
        total: "14",
        lastPush: "Real-time",
    },
    {
        agency: "Stone Real Estate Newtown",
        rea: "green",
        domain: "green",
        view: "green",
        total: "402",
        lastPush: "6 hours ago",
    },
    {
        agency: "Nelson Alexander",
        rea: "green",
        domain: "green",
        total: "352",
        lastPush: "5 hours ago",
    },
    {
        agency: "First National Geelong",
        rea: "red",
        domain: "red",
        total: "0",
        lastPush: "5 days ago",
        highlight: "red",
    },
    {
        agency: "Hocking Stuart Richmond",
        rea: "green",
        total: "0",
        lastPush: "3 days ago",
    },
    {
        agency: "First Home Buyers Melbourne",
        status: "Not set up",
        total: "0",
        lastPush: "Never",
    },
];

const DistributionTab = () => {
    const statsCards = [
        { label: "Total agencies distributing", value: "12", dot: null },
        { label: "All portals healthy", value: "9", dot: "bg-green-500" },
        { label: "Issues detected", value: "2", dot: "bg-orange-400" },
    ];

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {statsCards.map(({ label, value, dot }) => (
                    <div
                        key={label}
                        className="bg-card border border-border rounded p-4 shadow-sm flex flex-col gap-1.5"
                    >
                        <div className="flex items-center gap-1.5">
                            {dot && (
                                <div
                                    className={`w-2 h-2 rounded-full ${dot} shrink-0`}
                                />
                            )}
                            <span className="text-muted text-[12px]">
                                {label}
                            </span>
                        </div>
                        <span className="text-[24px] font-bold text-text">
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-[15px] font-bold text-text leading-snug">
                    Outbound listing distribution by agency
                </h2>
                <p className="text-muted text-[12px] mt-0.5">
                    Read-only. Distribution connections are configured by
                    agencies in their portal.
                </p>
            </div>

            <div className="bg-card rounded border border-border shadow-sm w-full overflow-x-auto">
                <table className="w-full text-left text-[12px] whitespace-nowrap min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border bg-page/50 text-muted">
                            <th className="font-medium py-3 px-4">Agency</th>
                            <th className="font-medium py-3 px-3 text-center">
                                REA Group
                            </th>
                            <th className="font-medium py-3 px-3 text-center">
                                Domain
                            </th>
                            <th className="font-medium py-3 px-3 text-center">
                                View.com.au
                            </th>
                            <th className="font-medium py-3 px-3 text-center">
                                Homely
                            </th>
                            <th className="font-medium py-3 px-4 text-right">
                                Total published
                            </th>
                            <th className="font-medium py-3 px-4 text-right">
                                Last push
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {DISTRIBUTION_DATA.map((row, i) => (
                            <tr
                                key={i}
                                className={`border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors ${
                                    row?.highlight === "orange"
                                        ? "border-l-[3px] border-l-orange-400"
                                        : row?.highlight === "red"
                                          ? "border-l-[3px] border-l-red-500"
                                          : ""
                                }`}
                            >
                                <td className="py-3 px-4 font-semibold text-text">
                                    {row?.agency}
                                </td>
                                {row?.status ? (
                                    <td
                                        colSpan={4}
                                        className="py-3 px-3 text-center text-muted text-[12px]"
                                    >
                                        {row?.status}
                                    </td>
                                ) : (
                                    <>
                                        <td className="py-3 px-3 text-center">
                                            <DotCell value={row?.rea} />
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <DotCell value={row?.domain} />
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <DotCell value={row?.view} />
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <DotCell value={row?.homely} />
                                        </td>
                                    </>
                                )}
                                <td className="py-3 px-4 text-right text-text font-medium">
                                    {row?.total}
                                </td>
                                <td className="py-3 px-4 text-right text-muted">
                                    {row?.lastPush}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DistributionTab;
