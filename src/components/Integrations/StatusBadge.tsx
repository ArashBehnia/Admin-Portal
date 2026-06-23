// import { FeedStatus, FeedMethod } from "@/actions/integrationsActions";

export const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Healthy")
        return (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                Healthy
            </span>
        );
    if (status === "Failing")
        return (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                Failing
            </span>
        );
    return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Pending
        </span>
    );
};

export const MethodBadge = ({ method }: { method: string }) => {
    const styles =
        method === "Internal"
            ? "bg-blue-50 text-blue-600 border-blue-200"
            : method === "API"
              ? "bg-violet-50 text-violet-600 border-violet-200"
              : "bg-gray-100 text-gray-600 border-gray-200";

    return (
        <span
            className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${styles}`}
        >
            {method}
        </span>
    );
};

export const OnboardingBadge = ({ value }: { value: string }) => {
    if (value === "Not set up")
        return <span className="text-gray-400 text-[11px]">Not set up</span>;

    const styles =
        value === "Live"
            ? "text-green-700 bg-green-50 border-green-200"
            : value === "Approved"
              ? "text-gray-600 bg-gray-100 border-gray-200"
              : value === "HomeBy only"
                ? "text-blue-700 bg-blue-50 border-blue-200"
                : "text-gray-700 bg-gray-100 border-gray-200";

    return (
        <span
            className={`inline-block px-1.5 py-0.5 text-[11px] rounded font-medium border ${styles}`}
        >
            {value}
        </span>
    );
};
