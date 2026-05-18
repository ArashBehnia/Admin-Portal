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
    const res = await axios.get("http://localhost:3000/integrations/feeds");
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

const RouteComponent = () => {
    const [activeTab, setActiveTab] = useState<"inbound" | "distribution">("inbound");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                                                <button className="text-[#2B5CE6] hover:underline font-medium text-[11px] whitespace-nowrap">View details</button>
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
                                        <button className="text-[#2B5CE6] hover:underline font-medium text-[12px]">View details</button>
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
                <div className="flex items-center justify-center h-48 text-gray-400 text-[13px]">Distribution view coming soon.</div>
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
        </div>
    );
};

export const Route = createFileRoute("/integrations")({
    component: RouteComponent,
});
