import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Plus, X, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const ROWS_PER_PAGE = 10;

const fetchFeedsData = async () => {
    const res = await axios.get("/data/integrations.json");
    return res.data;
};

/* ── small reusable badge ── */
const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Healthy") return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Healthy</span>;
    if (status === "Failing") return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">Failing</span>;
    return <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">Pending</span>;
};

const MethodBadge = ({ method }: { method: string }) => (
    <span className={cn(
        "inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border",
        method === "Internal" ? "bg-blue-50 text-blue-600 border-blue-200"
            : method === "API" ? "bg-violet-50 text-violet-600 border-violet-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
    )}>{method}</span>
);

const OnboardingBadge = ({ value }: { value: string }) => {
    if (value === "Not set up") return <span className="text-gray-400 text-[11px]">Not set up</span>;
    return (
        <span className={cn(
            "inline-block px-1.5 py-0.5 text-[11px] rounded font-medium border",
            value === "Live" ? "text-green-700 bg-green-50 border-green-200"
                : value === "Approved" ? "text-gray-600 bg-gray-100 border-gray-200"
                    : value === "HomeBy only" ? "text-blue-700 bg-blue-50 border-blue-200"
                        : "text-gray-700 bg-gray-100 border-gray-200"
        )}>{value}</span>
    );
};

/* ── Integration Details Panel (Slide-out) ── */
const IntegrationDetailsPanel = ({ feed, onClose }: { feed: any; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!feed) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-[60] transition-opacity" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-xl z-[60] flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="flex flex-col gap-2 p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">{feed.agencyName}</h2>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[12px] text-gray-500">{feed.crm}</span>
                                <MethodBadge method={feed.method} />
                                <StatusBadge status={feed.status} />
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Tabs */}
                    <div className="flex items-center gap-5 mt-4 border-b border-gray-100">
                        {["Overview", "Sync history", "Errors", "Validation"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={cn(
                                    "pb-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                                    activeTab === tab.toLowerCase() ? "border-[#2B5CE6] text-[#2B5CE6]" : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Onboarding stage */}
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-semibold text-gray-700">Onboarding stage</h3>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div key={step} className={cn("h-1.5 flex-1 rounded-full", step <= 4 ? "bg-[#2B5CE6]" : "bg-gray-200")} />
                                    ))}
                                </div>
                                <p className="text-[13px] font-medium text-gray-900 mt-1">Live</p>
                            </div>

                            {/* Assigned admin */}
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-semibold text-gray-700">Assigned admin</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">SC</div>
                                    <span className="text-[13px] text-gray-900">Sarah Chen</span>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[12px] font-semibold text-gray-700">Notes</h3>
                                    <button className="text-[#2B5CE6] text-[11px] font-medium hover:underline flex items-center gap-1">
                                        Edit
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-3 rounded border border-gray-100 text-[12px] text-gray-600 leading-relaxed">
                                    Onboarding contact: Mark Henderson. CRM credentials confirmed 12 May. Initial sync passed validation; monitoring for first full daily import.
                                </div>
                            </div>

                            {/* Sync info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-gray-700">Last sync</h3>
                                    <p className="text-[13px] text-gray-900">{feed.lastSync}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[12px] font-semibold text-gray-700">Sync frequency</h3>
                                    <p className="text-[13px] text-gray-900">1 hour</p>
                                </div>
                            </div>

                            {/* Feed endpoint */}
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-semibold text-gray-700">Feed endpoint</h3>
                                <p className="text-[12px] text-gray-500 font-mono break-all">https://feeds.boxdice.com.au/raywhite-bondi/reaxm...</p>
                            </div>

                            {/* Listing distribution */}
                            <div className="space-y-2">
                                <h3 className="text-[12px] font-semibold text-gray-700">Listing distribution</h3>
                                <p className="text-[11px] text-gray-500 -mt-1">Outbound push status to external portals</p>
                                <div className="space-y-1.5 text-[12px]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> <span className="font-medium">HomeBy</span> - Active</div>
                                        <span className="text-gray-500">247 listings</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> <span className="font-medium">REA Group</span> - Connected</div>
                                        <span className="text-gray-500">247 published</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> <span className="font-medium">Domain</span> - Connected</div>
                                        <span className="text-gray-500">247 published</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> <span className="font-medium">View.com.au</span> - Connected</div>
                                        <span className="text-gray-500">247 published</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-400">
                                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"/> <span className="font-medium text-gray-500">Homely</span> - Not connected</div>
                                        <span>0 published</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-2">Distribution connections are managed by the agency in their portal. Admin view is read-only.</p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <button className="w-full bg-[#2B5CE6] hover:bg-blue-700 text-white rounded py-2 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors">
                                    <RefreshCw className="w-4 h-4" /> Retry sync
                                </button>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 rounded py-2 text-[12px] font-medium hover:bg-gray-50 transition-colors">
                                        Edit configuration
                                    </button>
                                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 rounded py-2 text-[12px] font-medium hover:bg-gray-50 transition-colors">
                                        Pause feed
                                    </button>
                                </div>
                                <button className="w-full text-gray-600 py-2 text-[12px] font-medium hover:bg-gray-50 transition-colors rounded">
                                    Mark resolved
                                </button>
                                <button className="w-full text-red-600 py-2 text-[12px] font-medium hover:bg-red-50 transition-colors rounded flex items-center justify-center gap-1.5">
                                    Remove feed
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === "sync history" && (
                        <div className="text-[12px]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500">
                                        <th className="font-medium py-2">Timestamp</th>
                                        <th className="font-medium py-2">Duration</th>
                                        <th className="font-medium py-2 text-right">ProcessedStatus</th>
                                        <th className="font-medium py-2 text-center">Errors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { time: "Today 14:02", dur: "1.4s", proc: 47, status: "Success", err: 0 },
                                        { time: "Today 12:58", dur: "1.2s", proc: 12, status: "Success", err: 0 },
                                        { time: "Today 11:54", dur: "1.5s", proc: 19, status: "Success", err: 0 },
                                        { time: "Today 10:51", dur: "1.3s", proc: 8, status: "Success", err: 0 },
                                        { time: "Today 09:47", dur: "9.8s", proc: 0, status: "Failed", err: 3 },
                                        { time: "Today 08:44", dur: "1.1s", proc: 22, status: "Success", err: 0 },
                                        { time: "Yesterday 23:40", dur: "1.6s", proc: 14, status: "Success", err: 0 },
                                        { time: "Yesterday 22:36", dur: "1.4s", proc: 9, status: "Success", err: 0 },
                                        { time: "Yesterday 21:33", dur: "12.4s", proc: 0, status: "Failed", err: 7 },
                                        { time: "Yesterday 20:29", dur: "1.5s", proc: 18, status: "Success", err: 0 },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0">
                                            <td className="py-2.5 text-gray-700">{row.time}</td>
                                            <td className="py-2.5 text-gray-600">{row.dur}</td>
                                            <td className="py-2.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <span className="font-medium">{row.proc}</span>
                                                    <span className={cn("text-[10px] px-1 rounded font-medium border", row.status === "Success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200")}>{row.status}</span>
                                                </div>
                                            </td>
                                            <td className={cn("py-2.5 text-center font-medium", row.err > 0 ? "text-red-600" : "text-gray-400")}>{row.err}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "errors" && (
                        <div className="space-y-3">
                            {[
                                { type: "Auth failure", time: "Today 09:47", msg: "401 Unauthorized: invalid_grant. Refresh token rejected by VaultRE OAuth endpoint at /oauth/token. Re-authentication required by agency admin." },
                                { type: "Parse error", time: "Yesterday 21:33", msg: "Unexpected closing tag </listing> at line 4821, column 14. REAXML feed appears truncated mid-document.", listing: "RW-BON-44218" },
                                { type: "Parse error", time: "Yesterday 21:33", msg: "Invalid <price> node: non-numeric value '$AUCTION'. Expected integer or decimal.", listing: "RW-BON-44217" },
                                { type: "Missing field", time: "Yesterday 14:12", msg: "Required field <suburb> missing from listing payload.", listing: "RW-BON-44209" },
                                { type: "Missing field", time: "Yesterday 11:08", msg: "Required field <postcode> missing from listing payload.", listing: "RW-BON-44284" },
                                { type: "Timeout", time: "Yesterday 09:55", msg: "Connection to feed endpoint timed out after 30s. Server did not respond." },
                                { type: "Duplicate listing", time: "2 days ago 22:14", msg: "Listing already imported under different ID: RW-BON-44182.", listing: "RW-BON-44188" },
                            ].map((err, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded p-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 rounded">{err.type}</span>
                                        <span className="text-[11px] text-gray-400">{err.time}</span>
                                    </div>
                                    <p className="text-[12px] text-gray-700 leading-relaxed font-mono mt-2">{err.msg}</p>
                                    {err.listing && <p className="text-[11px] text-gray-500 mt-2">Listing: <span className="text-gray-700 font-medium">{err.listing}</span></p>}
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === "validation" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-gray-200 rounded p-3 bg-white">
                                    <h3 className="text-[12px] text-gray-500 mb-1">Total imported</h3>
                                    <p className="text-[18px] font-bold text-gray-900">847</p>
                                </div>
                                <div className="border border-gray-200 rounded p-3 bg-white">
                                    <h3 className="text-[12px] text-gray-500 mb-1">Valid</h3>
                                    <p className="text-[18px] font-bold text-gray-900">819</p>
                                </div>
                                <div className="border border-gray-200 rounded p-3 bg-white">
                                    <h3 className="text-[12px] text-gray-500 mb-1">Issues</h3>
                                    <p className="text-[18px] font-bold text-gray-900">28</p>
                                </div>
                                <div className="border border-gray-200 rounded p-3 bg-white">
                                    <h3 className="text-[12px] text-gray-500 mb-1">Duplicates</h3>
                                    <p className="text-[18px] font-bold text-gray-900">6</p>
                                </div>
                            </div>
                            
                            <div>
                                <table className="w-full text-left text-[12px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-500">
                                            <th className="font-medium py-2">Issue type</th>
                                            <th className="font-medium py-2 text-right">Count</th>
                                            <th className="font-medium py-2 text-center">Severity</th>
                                            <th className="font-medium py-2">Last seen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { type: "Missing suburb", count: 12, severity: "High", lastSeen: "2 hours ago" },
                                            { type: "Missing images", count: 8, severity: "Medium", lastSeen: "4 hours ago" },
                                            { type: "Malformed price", count: 5, severity: "High", lastSeen: "1 hour ago" },
                                            { type: "Duplicate listing ID", count: 6, severity: "Low", lastSeen: "3 hours ago" },
                                            { type: "Missing agent mapping", count: 3, severity: "Medium", lastSeen: "6 hours ago" },
                                        ].map((issue, i) => (
                                            <tr key={i} className="border-b border-gray-50 last:border-0">
                                                <td className="py-2.5 text-gray-900 font-medium">{issue.type}</td>
                                                <td className="py-2.5 text-right font-medium text-gray-700">{issue.count}</td>
                                                <td className="py-2.5 text-center">
                                                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium border inline-block", 
                                                        issue.severity === "High" ? "bg-red-50 text-red-700 border-red-200" : 
                                                        issue.severity === "Medium" ? "bg-orange-50 text-orange-700 border-orange-200" : 
                                                        "bg-gray-100 text-gray-600 border-gray-200"
                                                    )}>{issue.severity}</span>
                                                </td>
                                                <td className="py-2.5 text-gray-500">{issue.lastSeen}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const RouteComponent = () => {
    const [activeTab, setActiveTab] = useState<"inbound" | "distribution">("inbound");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<any | null>(null);

    const { data, isLoading } = useQuery({ queryKey: ["feedsData"], queryFn: fetchFeedsData });

    const stats = data?.stats || { total: 0, healthy: 0, warning: 0, failing: 0 };
    const feeds = data?.feeds || [];

    const filteredFeeds = feeds.filter((feed: any) => {
        const matchesSearch =
            feed.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feed.crm.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || feed.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filteredFeeds.length / ROWS_PER_PAGE));
    const paginatedFeeds = filteredFeeds.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, filterStatus]);

    return (
        <div className="w-full flex flex-col gap-4">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-900 leading-snug">
                        Integrations &amp; Feed Operations
                    </h1>
                    <p className="text-gray-500 text-[12px] sm:text-[13px] mt-0.5 leading-relaxed">
                        Monitor agency CRM connections, inbound feed health, and outbound listing distribution.
                        Read-only — feed setup is managed by agencies through the portal.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="self-start sm:shrink-0 bg-[#2B5CE6] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                    <Plus className="w-3.5 h-3.5" />
                    + Add integration
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="border-b border-gray-200">
                <div className="flex gap-5">
                    {(["inbound", "distribution"] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors",
                                activeTab === tab ? "border-[#2B5CE6] text-[#2B5CE6]" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}>
                            {tab === "inbound" ? "Inbound feeds" : "Distribution"}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "inbound" && (
                <>
                    {/* ── Stats Cards: 2-col on mobile, 4-col on md+ ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                        <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm">
                            <span className="text-gray-500 text-[11px] sm:text-[12px]">Total feeds</span>
                            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-none">{stats.total}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                <span className="text-gray-500 text-[11px] sm:text-[12px]">Healthy</span>
                            </div>
                            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-none">{stats.healthy}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                                <span className="text-gray-500 text-[11px] sm:text-[12px]">Warning &gt;24h</span>
                            </div>
                            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-none">{stats.warning}</span>
                        </div>
                        <div className="bg-white border border-gray-200 border-l-[3px] border-l-red-500 rounded p-3 sm:p-4 flex flex-col gap-1.5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                <span className="text-gray-500 text-[11px] sm:text-[12px]">Failing</span>
                            </div>
                            <span className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-none">{stats.failing}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-[11px] sm:text-[12px] -mt-1">
                        Includes 1 HomeBy Internal connection (no external feed required)
                    </p>

                    {/* ── Filters: stacked on mobile ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div className="relative w-full sm:w-[240px]">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search agency or CRM provider..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-gray-400 bg-white"
                            />
                        </div>
                        {/* horizontally scrollable filter pills on mobile */}
                        <div className="flex items-center overflow-x-auto border-b border-gray-200 pb-0 scrollbar-none sm:overflow-visible">
                            {["All", "Healthy", "Warning", "Failing", "Pending setup"].map((status) => (
                                <button key={status} onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 text-[12px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0",
                                        filterStatus === status ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Desktop Table (md+) ── */}
                    <div className="hidden md:block bg-white rounded border border-gray-200 shadow-sm w-full overflow-hidden">
                        <table className="table-fixed w-full text-left text-[12px]">
                            <colgroup>
                                <col style={{ width: "17%" }} />
                                <col style={{ width: "9%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "9%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "19%" }} />
                            </colgroup>
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500">
                                    <th className="font-medium py-2.5 px-3">Agency</th>
                                    <th className="font-medium py-2.5 px-2">CRM</th>
                                    <th className="font-medium py-2.5 px-2">Method</th>
                                    <th className="font-medium py-2.5 px-2">Status</th>
                                    <th className="font-medium py-2.5 px-2 leading-tight">Last sync</th>
                                    <th className="font-medium py-2.5 px-2 text-center leading-tight">Listings<br />(24h)</th>
                                    <th className="font-medium py-2.5 px-2 text-center leading-tight">Errors<br />(24h)</th>
                                    <th className="font-medium py-2.5 px-2">Distrib.</th>
                                    <th className="font-medium py-2.5 px-2">Onboarding</th>
                                    <th className="font-medium py-2.5 px-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={10} className="py-10 text-center text-gray-400">Loading…</td></tr>
                                ) : paginatedFeeds.length === 0 ? (
                                    <tr><td colSpan={10} className="py-10 text-center text-gray-400">No feeds found.</td></tr>
                                ) : paginatedFeeds.map((feed: any) => (
                                    <tr key={feed.id} className={cn(
                                        "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors",
                                        feed.status === "Failing" && "border-l-[3px] border-l-red-500"
                                    )}>
                                        <td className="py-2.5 px-3 font-semibold text-gray-900"><span className="block truncate" title={feed.agencyName}>{feed.agencyName}</span></td>
                                        <td className="py-2.5 px-2 text-gray-600"><span className="block truncate">{feed.crm}</span></td>
                                        <td className="py-2.5 px-2"><MethodBadge method={feed.method} /></td>
                                        <td className="py-2.5 px-2"><StatusBadge status={feed.status} /></td>
                                        <td className="py-2.5 px-2 text-gray-600"><span className="block truncate">{feed.lastSync}</span></td>
                                        <td className="py-2.5 px-2 text-center text-gray-900">{feed.listings24h === 0 ? "0" : feed.listings24h ?? "—"}</td>
                                        <td className="py-2.5 px-2">
                                            <div className="flex items-center justify-center gap-1">
                                                {feed.errors24h !== null && <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", feed.errors24h > 0 ? "bg-red-500" : "bg-green-500")} />}
                                                <span className={feed.errors24h > 0 ? "text-red-600 font-semibold" : "text-gray-900"}>{feed.errors24h !== null ? feed.errors24h : "—"}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-2 text-gray-700"><span className="block truncate">{feed.distribution || "—"}</span></td>
                                        <td className="py-2.5 px-2"><OnboardingBadge value={feed.onboarding} /></td>
                                        <td className="py-2.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedFeed(feed)} className="text-[#2B5CE6] hover:underline font-medium text-[11px] whitespace-nowrap">View details</button>
                                                {feed.status === "Pending setup" ? (
                                                    <button className="text-[#2B5CE6] hover:underline font-medium text-[11px] whitespace-nowrap">Send setup</button>
                                                ) : (
                                                    <button className="text-gray-500 hover:text-gray-800 flex items-center gap-0.5 font-medium text-[11px] whitespace-nowrap">
                                                        <RefreshCw className="w-2.5 h-2.5" />Retry sync
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card List (< md) ── */}
                    <div className="flex md:hidden flex-col gap-2">
                        {isLoading ? (
                            <div className="py-10 text-center text-gray-400 text-[13px]">Loading…</div>
                        ) : paginatedFeeds.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 text-[13px]">No feeds found.</div>
                        ) : paginatedFeeds.map((feed: any) => (
                            <div key={feed.id} className={cn(
                                "bg-white rounded border border-gray-200 shadow-sm p-3 flex flex-col gap-2",
                                feed.status === "Failing" && "border-l-[3px] border-l-red-500"
                            )}>
                                {/* Row 1: Agency + Status */}
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-semibold text-gray-900 text-[13px] leading-snug">{feed.agencyName}</span>
                                    <StatusBadge status={feed.status} />
                                </div>
                                {/* Row 2: CRM + Method + Onboarding */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-gray-500 text-[12px]">{feed.crm}</span>
                                    <MethodBadge method={feed.method} />
                                    <OnboardingBadge value={feed.onboarding} />
                                </div>
                                {/* Row 3: Stats */}
                                <div className="grid grid-cols-3 gap-2 text-[12px]">
                                    <div>
                                        <p className="text-gray-400 text-[11px]">Last sync</p>
                                        <p className="text-gray-700 truncate">{feed.lastSync}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px]">Listings (24h)</p>
                                        <p className="text-gray-900">{feed.listings24h === 0 ? "0" : feed.listings24h ?? "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[11px]">Errors (24h)</p>
                                        <div className="flex items-center gap-1">
                                            {feed.errors24h !== null && <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", feed.errors24h > 0 ? "bg-red-500" : "bg-green-500")} />}
                                            <span className={feed.errors24h > 0 ? "text-red-600 font-semibold" : "text-gray-900"}>{feed.errors24h !== null ? feed.errors24h : "—"}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Row 4: Distribution + Actions */}
                                <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-gray-100">
                                    <span className="text-gray-500 text-[12px]">{feed.distribution || "—"}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setSelectedFeed(feed)} className="text-[#2B5CE6] hover:underline font-medium text-[12px]">View details</button>
                                        {feed.status === "Pending setup" ? (
                                            <button className="text-[#2B5CE6] hover:underline font-medium text-[12px]">Send setup</button>
                                        ) : (
                                            <button className="text-gray-500 flex items-center gap-1 font-medium text-[12px]">
                                                <RefreshCw className="w-3 h-3" />Retry sync
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Pagination ── */}
                    {!isLoading && filteredFeeds.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-1">
                            <p className="text-[12px] text-gray-500">
                                Showing <span className="font-medium text-gray-700">{(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredFeeds.length)}</span> of <span className="font-medium text-gray-700">{filteredFeeds.length}</span> feeds
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeft className="w-3.5 h-3.5" />Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                                        acc.push(p); return acc;
                                    }, [])
                                    .map((item, idx) => item === "…" ? (
                                        <span key={`e${idx}`} className="px-1.5 text-gray-400 text-[12px]">…</span>
                                    ) : (
                                        <button key={item} onClick={() => setCurrentPage(item as number)}
                                            className={cn("w-7 h-7 rounded text-[12px] font-medium border transition-colors",
                                                currentPage === item ? "bg-[#2B5CE6] text-white border-[#2B5CE6]" : "text-gray-600 border-gray-200 hover:bg-gray-50"
                                            )}>{item}</button>
                                    ))}
                                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    Next<ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeTab === "distribution" && (
                <div className="flex flex-col gap-5">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex flex-col gap-1.5">
                            <span className="text-gray-500 text-[12px]">Total agencies distributing</span>
                            <span className="text-[24px] font-bold text-gray-900">12</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                <span className="text-gray-500 text-[12px]">All portals healthy</span>
                            </div>
                            <span className="text-[24px] font-bold text-gray-900">9</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                                <span className="text-gray-500 text-[12px]">Issues detected</span>
                            </div>
                            <span className="text-[24px] font-bold text-gray-900">2</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold text-gray-900 leading-snug">Outbound listing distribution by agency</h2>
                        <p className="text-gray-500 text-[12px] mt-0.5">Read-only. Distribution connections are configured by agencies in their portal.</p>
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm w-full overflow-x-auto">
                        <table className="w-full text-left text-[12px] whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500">
                                    <th className="font-medium py-3 px-4">Agency</th>
                                    <th className="font-medium py-3 px-3 text-center">REA Group</th>
                                    <th className="font-medium py-3 px-3 text-center">Domain</th>
                                    <th className="font-medium py-3 px-3 text-center">View.com.au</th>
                                    <th className="font-medium py-3 px-3 text-center">Homely</th>
                                    <th className="font-medium py-3 px-4 text-right">Total published</th>
                                    <th className="font-medium py-3 px-4 text-right">Last push</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { agency: "Ray White Bondi", rea: "green", domain: "green", view: "green", homely: "green", total: "988", lastPush: "2 hours ago" },
                                    { agency: "McGrath Surry Hills", rea: "green", domain: "green", view: "green", homely: "-", total: "549", lastPush: "4 hours ago" },
                                    { agency: "Belle Property Mosman", rea: "green", domain: "green", view: "green", homely: "green", total: "426", lastPush: "1 day ago" },
                                    { agency: "LJ Hooker Parramatta", rea: "green", domain: "green", view: "-", homely: "-", total: "196", lastPush: "2 days ago" },
                                    { agency: "Harcourts Melbourne", rea: "green", domain: "green", view: "green", homely: "green", total: "936", lastPush: "3 hours ago" },
                                    { agency: "Jellis Craig Fitzroy", rea: "orange", domain: "orange", view: "orange", homely: "-", total: "0", lastPush: "1 day ago", highlight: "orange" },
                                    { agency: "Barry Plant Doncaster", status: "HomeBy only", total: "14", lastPush: "Real-time" },
                                    { agency: "Stone Real Estate Newtown", rea: "green", domain: "green", view: "green", homely: "-", total: "402", lastPush: "6 hours ago" },
                                    { agency: "Nelson Alexander", rea: "green", domain: "green", view: "-", homely: "-", total: "352", lastPush: "5 hours ago" },
                                    { agency: "First National Geelong", rea: "red", domain: "red", view: "-", homely: "-", total: "0", lastPush: "5 days ago", highlight: "red" },
                                    { agency: "Hocking Stuart Richmond", rea: "green", domain: "-", view: "-", homely: "-", total: "0", lastPush: "3 days ago" },
                                    { agency: "First Home Buyers Melbourne", status: "Not set up", total: "0", lastPush: "Never" },
                                ].map((row, i) => (
                                    <tr key={i} className={cn(
                                        "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors",
                                        row.highlight === "orange" && "border-l-[3px] border-l-orange-400",
                                        row.highlight === "red" && "border-l-[3px] border-l-red-500"
                                    )}>
                                        <td className="py-3 px-4 font-semibold text-gray-900">{row.agency}</td>
                                        {row.status ? (
                                            <td colSpan={4} className="py-3 px-3 text-center text-gray-400 text-[12px]">{row.status}</td>
                                        ) : (
                                            <>
                                                <td className="py-3 px-3 text-center">
                                                    {row.rea === "green" ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto" /> : row.rea === "orange" ? <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto" /> : row.rea === "red" ? <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto" /> : <span className="text-gray-400">—</span>}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {row.domain === "green" ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto" /> : row.domain === "orange" ? <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto" /> : row.domain === "red" ? <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto" /> : <span className="text-gray-400">—</span>}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {row.view === "green" ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto" /> : row.view === "orange" ? <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto" /> : row.view === "red" ? <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto" /> : <span className="text-gray-400">—</span>}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {row.homely === "green" ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto" /> : row.homely === "orange" ? <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto" /> : row.homely === "red" ? <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto" /> : <span className="text-gray-400">—</span>}
                                                </td>
                                            </>
                                        )}
                                        <td className="py-3 px-4 text-right text-gray-900 font-medium">{row.total}</td>
                                        <td className="py-3 px-4 text-right text-gray-500">{row.lastPush}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Modal ── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
                    <div className="bg-white rounded-t-xl sm:rounded shadow-xl w-full sm:w-[480px] max-h-[92vh] sm:max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
                            <h2 className="text-[15px] font-semibold text-gray-900">Add new integration</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="px-5 py-4 space-y-3.5 overflow-y-auto">
                            {[
                                { label: "Agency", type: "input", placeholder: "Select or enter agency name" },
                                { label: "Feed URL or API endpoint", type: "input", placeholder: "https://feeds.example.com.au/agency/reaxml.xml" },
                            ].map(({ label, placeholder }) => (
                                <div key={label} className="space-y-1">
                                    <label className="block text-[12px] font-semibold text-gray-700">{label}</label>
                                    <input type="text" placeholder={placeholder} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                </div>
                            ))}
                            {[
                                { label: "CRM provider", opts: ["Box+Dice", "VaultRE", "AgentBox"] },
                                { label: "Connection type", opts: ["REAXML", "API"] },
                            ].map(({ label, opts }) => (
                                <div key={label} className="space-y-1">
                                    <label className="block text-[12px] font-semibold text-gray-700">{label}</label>
                                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
                                        {opts.map((o) => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                            <div className="space-y-1">
                                <label className="block text-[12px] font-semibold text-gray-700">Sync frequency</label>
                                <div className="flex flex-wrap gap-1">
                                    {["Every 15 min", "1 hour", "4 hours", "Daily"].map((opt, i) => (
                                        <button key={opt} className={cn("px-3 py-1.5 text-[12px] font-medium rounded border transition-colors", i === 0 ? "bg-gray-100 border-gray-300 text-gray-800" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50")}>{opt}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <button className="px-3 py-1.5 border border-gray-200 text-gray-400 bg-gray-50 rounded text-[12px] font-medium cursor-not-allowed">Test connection</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="skip" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600" />
                                <label htmlFor="skip" className="text-[12px] text-gray-600 cursor-pointer">Skip test and save anyway</label>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-gray-100 shrink-0">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                            <button className="px-4 py-2 bg-[#2B5CE6] hover:bg-blue-700 text-white rounded text-[13px] font-medium transition-colors">Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Details Panel ── */}
            <IntegrationDetailsPanel feed={selectedFeed} onClose={() => setSelectedFeed(null)} />
        </div>
    );
};

export const Route = createFileRoute("/integrations")({
    component: RouteComponent,
});
