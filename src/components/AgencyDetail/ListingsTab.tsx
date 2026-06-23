import { AlertTriangle } from "lucide-react";
import { ListingRow } from "@/actions/agenciesActions";

interface ListingsTabProps {
    listings: ListingRow[];
}

const STATUS_STYLES: Record<ListingRow["status"], string> = {
    Active: "bg-green-50 text-green-700 border-green-200",
    "Under offer": "bg-amber-50 text-amber-700 border-amber-200",
    Sold: "bg-page text-muted border-border",
};

const ListingsTab = ({ listings }: ListingsTabProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-[13px] text-amber-800">
                    Listing data is read-only in admin. Agents manage listings
                    through the agency portal.
                </span>
            </div>

            <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-[13px] whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th className="font-medium py-3 px-5">
                                    Address
                                </th>
                                <th className="font-medium py-3 px-5">Type</th>
                                <th className="font-medium py-3 px-5">
                                    Status
                                </th>
                                <th className="font-medium py-3 px-5">
                                    Listed price
                                </th>
                                <th className="font-medium py-3 px-5">
                                    Listed date
                                </th>
                                <th className="font-medium py-3 px-5">
                                    Distributed to
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                >
                                    <td className="py-3.5 px-5 font-medium text-text">
                                        {row?.address}
                                    </td>
                                    <td className="py-3.5 px-5 text-muted">
                                        {row?.type}
                                    </td>
                                    <td className="py-3.5 px-5">
                                        <span
                                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${STATUS_STYLES[row?.status] ?? ""}`}
                                        >
                                            {row?.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-text">
                                        {row?.price}
                                    </td>
                                    <td className="py-3.5 px-5 text-muted">
                                        {row?.date}
                                    </td>
                                    <td className="py-3.5 px-5 text-muted">
                                        {row?.dist}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListingsTab;
