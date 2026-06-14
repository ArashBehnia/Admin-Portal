import { Download } from "lucide-react";
import { Agency } from "@/actions/agenciesActions";
import { InvoiceRow } from "@/actions/agenciesActions";

interface BillingTabProps {
    agency: Agency;
    invoices: InvoiceRow[];
}

const BillingTab = ({ agency, invoices }: BillingTabProps) => {
    return (
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Current Plan */}
            <div className="w-full lg:w-[350px] bg-card border border-border rounded shadow-sm p-6 flex flex-col gap-6">
                <div>
                    <span className="text-[13px] text-muted font-medium">
                        Current plan
                    </span>
                    <div className="mt-1">
                        <span className="text-[20px] font-bold text-text">
                            {agency?.subscription}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-[24px] font-bold text-text">
                            {agency?.mrr?.split("/")[0]}
                        </span>
                        <span className="text-[13px] text-muted">/month</span>
                    </div>
                </div>

                <div className="border-t border-border pt-5 flex flex-col gap-3">
                    <div className="flex justify-between text-[13px]">
                        <span className="text-muted">Next renewal</span>
                        <span className="text-text font-medium">
                            1 June 2026
                        </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                        <span className="text-muted">Payment</span>
                        <span className="text-text font-medium">
                            Visa ····4242
                        </span>
                    </div>
                    <div className="flex justify-between text-[13px] items-center">
                        <span className="text-muted">Status</span>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                            Active
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="px-4 py-2 border border-border rounded text-[13px] font-medium text-text hover:bg-page transition-colors cursor-pointer">
                        Change plan
                    </button>
                    <button className="px-4 py-2 border border-border rounded text-[13px] font-medium text-text hover:bg-page transition-colors cursor-pointer">
                        Update payment method
                    </button>
                </div>
            </div>

            {/* Invoices */}
            <div className="flex-1 bg-card border border-border rounded shadow-sm flex flex-col">
                <div className="px-6 py-5 border-b border-border">
                    <h2 className="text-[14px] font-bold text-text">
                        Invoices
                    </h2>
                </div>
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-[13px]">
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th className="font-medium py-3 px-6">Date</th>
                                <th className="font-medium py-3 px-6">
                                    Period
                                </th>
                                <th className="font-medium py-3 px-6">
                                    Amount
                                </th>
                                <th className="font-medium py-3 px-6">
                                    Status
                                </th>
                                <th className="font-medium py-3 px-6 text-right">
                                    Download
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                                >
                                    <td className="py-4 px-6 font-medium text-text">
                                        {row?.date}
                                    </td>
                                    <td className="py-4 px-6 text-muted">
                                        {row?.period}
                                    </td>
                                    <td className="py-4 px-6 text-text font-medium">
                                        {row?.amount}
                                    </td>
                                    <td className="py-4 px-6">
                                        {row?.status === "Paid" ? (
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                                Overdue
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-accent font-medium hover:underline inline-flex items-center gap-1 cursor-pointer">
                                            <Download className="w-3.5 h-3.5" />{" "}
                                            PDF
                                        </button>
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

export default BillingTab;
