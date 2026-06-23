import { AuditRow } from "@/actions/agenciesActions";

interface AuditTabProps {
    auditLog: AuditRow[];
}

const AuditTab = ({ auditLog }: AuditTabProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left text-[13px]">
                    <thead>
                        <tr className="border-b border-border text-muted">
                            <th className="font-medium py-3 px-5">Timestamp</th>
                            <th className="font-medium py-3 px-5">Action</th>
                            <th className="font-medium py-3 px-5">
                                Performed by
                            </th>
                            <th className="font-medium py-3 px-5">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLog.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                            >
                                <td className="py-3.5 px-5 text-muted">
                                    {row?.time}
                                </td>
                                <td className="py-3.5 px-5 font-bold text-text">
                                    {row?.action}
                                </td>
                                <td className="py-3.5 px-5 text-text">
                                    {row?.user}
                                </td>
                                <td className="py-3.5 px-5 text-muted">
                                    {row?.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditTab;
