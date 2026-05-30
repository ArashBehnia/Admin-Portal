interface StatusBadgeProps {
    status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const colorMap: Record<string, string> = {
        Pending: "bg-orange-50 text-orange-700 border border-orange-200",
        Approved: "bg-green-50 text-green-700 border border-green-200",
        Rejected: "bg-red-50 text-red-700 border border-red-200",
        "Awaiting info": "bg-gray-100 text-gray-700 border border-gray-200",
    };

    return (
        <span
            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${colorMap[status] ?? "bg-gray-100 text-gray-600"}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
