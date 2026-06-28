import { Hotspot } from "@/actions/dashboardActions";

interface DemandHotspotsProps {
    hotspots: Hotspot[];
}

const DemandHotspots = ({ hotspots }: DemandHotspotsProps) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="mb-4">
                <h2 className="text-[15px] font-bold text-text">
                    Demand hotspots
                </h2>
                <p className="text-xs text-muted mt-0.5">
                    Top suburbs by activity, last 7 days
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[var(--min-table-width)]">
                    <thead>
                        <tr className="border-b border-border bg-card text-[12px] text-muted font-bold uppercase tracking-wider">
                            <th className="pb-3 pt-1">Suburb</th>
                            <th className="pb-3 pt-1">State</th>
                            <th className="pb-3 pt-1 text-right">
                                Active users
                            </th>
                            <th className="pb-3 pt-1 text-right">
                                Searches this week
                            </th>
                            <th className="pb-3 pt-1 text-right">
                                Enquiries this week
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {hotspots.map((row, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-page/20 transition-colors"
                            >
                                <td className="py-3.5 text-text font-bold">
                                    {row.suburb}
                                </td>
                                <td className="py-3.5 text-muted font-semibold">
                                    {row.state}
                                </td>
                                <td className="py-3.5 text-text text-right font-medium">
                                    {row.activeUsers}
                                </td>
                                <td className="py-3.5 text-text text-right font-medium">
                                    {row.searches}
                                </td>
                                <td className="py-3.5 text-text text-right font-medium">
                                    {row.enquiries}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DemandHotspots;
