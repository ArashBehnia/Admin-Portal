import { AgentRow } from "@/actions/agenciesActions";

interface AgentsTabProps {
    agents: AgentRow[];
    isLoading?: boolean;
}

const STATUS_STYLES: Record<AgentRow["status"], { dot: string; text: string }> =
    {
        Active: { dot: "bg-green-500", text: "text-green-700" },
        Inactive: { dot: "bg-gray-400", text: "text-muted" },
        Pending: { dot: "bg-orange-400", text: "text-orange-700" },
    };

const AgentsTab = ({ agents, isLoading }: AgentsTabProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-text">
                    Agents at this agency
                </h2>
                <button disabled className="bg-accent/50 text-white/70 px-3 py-1.5 rounded text-[12px] font-medium cursor-not-allowed">
                    + Invite agent
                </button>
            </div>

            <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-[13px] text-muted">
                            Loading agents...
                        </div>
                    ) : agents.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-[13px] text-muted">
                            No agents found for this agency.
                        </div>
                    ) : (
                    <table className="w-full text-left text-[13px] table-auto">
                        <thead>
                            <tr className="border-b border-border text-muted bg-card">
                                <th className="font-medium py-3 pl-4 pr-3">
                                    Name
                                </th>
                                <th className="font-medium py-3 px-3">Role</th>
                                <th className="font-medium py-3 px-3">Email</th>
                                <th className="font-medium py-3 px-3">Phone</th>
                                <th className="font-medium py-3 px-3">
                                    Licence
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Last login
                                </th>
                                <th className="font-medium py-3 px-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map((agent, i) => {
                                const style =
                                    STATUS_STYLES[agent?.status] ??
                                    STATUS_STYLES.Active;
                                return (
                                    <tr
                                        key={i}
                                        className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                    >
                                        <td className="py-3 pl-4 pr-3 font-medium whitespace-nowrap">
                                            <span className="text-accent hover:underline cursor-pointer">
                                                {agent?.name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-text whitespace-nowrap">
                                            {agent?.role}
                                        </td>
                                        <td
                                            className="py-3 px-3 text-muted truncate max-w-[180px] lg:max-w-none"
                                            title={agent?.email}
                                        >
                                            {agent?.email}
                                        </td>
                                        <td className="py-3 px-3 text-muted whitespace-nowrap">
                                            {agent?.phone}
                                        </td>
                                        <td className="py-3 px-3 text-muted whitespace-nowrap">
                                            {agent?.licence}
                                        </td>
                                        <td className="py-3 px-3 text-muted whitespace-nowrap">
                                            {agent?.lastLogin}
                                        </td>
                                        <td className="py-3 px-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                                                />
                                                <span
                                                    className={`text-[12px] ${style.text}`}
                                                >
                                                    {agent?.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentsTab;
