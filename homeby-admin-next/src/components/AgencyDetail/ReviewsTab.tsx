import { Star } from "lucide-react";
import { ReviewRow } from "@/actions/agenciesActions";

interface ReviewsTabProps {
    reviews: ReviewRow[];
}

const STATUS_STYLES: Record<ReviewRow["status"], string> = {
    Approved: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-orange-50 text-orange-700 border-orange-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
};

const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left text-[13px]">
                    <thead>
                        <tr className="border-b border-border text-muted">
                            <th className="font-medium py-3 px-5">Reviewer</th>
                            <th className="font-medium py-3 px-5">
                                Agent reviewed
                            </th>
                            <th className="font-medium py-3 px-5">Rating</th>
                            <th className="font-medium py-3 px-5">Comment</th>
                            <th className="font-medium py-3 px-5">Status</th>
                            <th className="font-medium py-3 px-5">Submitted</th>
                            <th className="font-medium py-3 px-5 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-border/60 last:border-0 hover:bg-page/40 transition-colors"
                            >
                                <td className="py-3 px-5 font-medium text-text">
                                    {row?.name}
                                </td>
                                <td className="py-3 px-5 text-text">
                                    {row?.agent}
                                </td>
                                <td className="py-3 px-5">
                                    <div className="flex gap-0.5 text-orange-400">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className="w-3.5 h-3.5"
                                                fill={
                                                    index < row?.rating
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3 px-5 text-muted">
                                    {row?.comment}
                                </td>
                                <td className="py-3 px-5">
                                    <span
                                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${STATUS_STYLES[row?.status] ?? ""}`}
                                    >
                                        {row?.status}
                                    </span>
                                </td>
                                <td className="py-3 px-5 text-muted">
                                    {row?.date}
                                </td>
                                <td className="py-3 px-5 text-right">
                                    <button className="text-accent font-medium hover:underline cursor-pointer">
                                        {row?.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewsTab;
