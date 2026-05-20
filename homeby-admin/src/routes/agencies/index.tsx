import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Plus, X, MoreHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const fetchAgenciesData = async () => {
    const res = await axios.get('/data/agencies.json');
    return res.data;
};

/* ── Badges ── */
const SubscriptionBadge = ({ type }: { type: string }) => {
    if (type === 'Founding Partner') return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700">Founding Partner</span>;
    if (type === 'Premier') return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700">Premier</span>;
    if (type === 'Professional') return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">Professional</span>;
    if (type === 'Essential') return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700">Essential</span>;
    return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">Trial</span>;
};

const OnboardingBadge = ({ status }: { status: string }) => {
    if (status === 'Live') return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Live</span>;
    return <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
};

const FeedStatus = ({ status }: { status: string }) => {
    if (status === 'Healthy') return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/><span className="text-[12px] text-gray-900">Healthy</span></div>;
    if (status === 'Warning') return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"/><span className="text-[12px] text-gray-900">Warning</span></div>;
    if (status === 'Failing') return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/><span className="text-[12px] text-gray-900">Failing</span></div>;
    return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"/><span className="text-[12px] text-gray-500">Not configured</span></div>;
};

const SendInvitationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-[500px] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-[16px] font-bold text-gray-900">Send agency invitation</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-gray-900">Contact name</label>
                        <input type="text" placeholder="Jane Smith" className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2B5CE6] focus:ring-1 focus:ring-[#2B5CE6]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-gray-900">Agency name</label>
                        <input type="text" placeholder="Ray White Bondi" className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2B5CE6] focus:ring-1 focus:ring-[#2B5CE6]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-gray-900">Email address</label>
                        <input type="email" placeholder="jane@agency.com.au" className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2B5CE6] focus:ring-1 focus:ring-[#2B5CE6]" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-gray-900">Personal message (optional)</label>
                        <textarea rows={3} placeholder="Add a personal message to the invitation email..." className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2B5CE6] focus:ring-1 focus:ring-[#2B5CE6] resize-none"></textarea>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 transition-colors">Cancel</button>
                    <button className="px-4 py-2 bg-[#2B5CE6] hover:bg-blue-700 text-white rounded text-[13px] font-medium transition-colors">Send invitation</button>
                </div>
            </div>
        </div>
    );
};

const RouteComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { data, isLoading } = useQuery({ queryKey: ['agenciesData'], queryFn: fetchAgenciesData });

    const stats = data?.stats || { total: '0', active: '0', onboarding: '0', suspended: '0' };
    const agencies = data?.agencies || [];

    const filters = ["All", "Active", "Onboarding", "Pending", "Suspended", "Trial"];

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 leading-snug">Agencies</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5">Manage agency accounts, onboarding status and CRM connections.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#2B5CE6] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded text-[13px] font-medium flex items-center gap-1.5 transition-colors self-start shrink-0"
                >
                    <Plus className="w-4 h-4" /> Send invitation
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-1.5">
                    <span className="text-[12px] text-gray-500">Total agencies</span>
                    <span className="text-[24px] font-bold text-gray-900">{stats.total}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        <span className="text-[12px] text-gray-500">Active (Live)</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">{stats.active}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        <span className="text-[12px] text-gray-500">Onboarding in progress</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">{stats.onboarding}</span>
                </div>
                <div className="bg-white border border-gray-200 border-l-[3px] border-l-red-500 rounded shadow-sm p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-[12px] text-gray-500">Suspended</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">{stats.suspended}</span>
                </div>
            </div>

            <p className="text-[12px] text-gray-500 -mt-1">Showing demo dataset of 12 agencies below.</p>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-[320px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search agency name, ABN, contact email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-gray-400 bg-white shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-3 py-1.5 rounded text-[12px] font-medium whitespace-nowrap transition-colors border",
                                activeFilter === filter
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-[12px] whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white text-gray-500">
                                <th className="font-medium py-3 px-4">Agency</th>
                                <th className="font-medium py-3 px-3">Subscription</th>
                                <th className="font-medium py-3 px-3">Onboarding</th>
                                <th className="font-medium py-3 px-3 text-right">Listings</th>
                                <th className="font-medium py-3 px-3 text-right">Agents</th>
                                <th className="font-medium py-3 px-3">Feed</th>
                                <th className="font-medium py-3 px-3 text-right">MRR</th>
                                <th className="font-medium py-3 px-4 text-right">Last activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} className="py-10 text-center text-gray-400">Loading...</td></tr>
                            ) : agencies.length === 0 ? (
                                <tr><td colSpan={8} className="py-10 text-center text-gray-400">No agencies found.</td></tr>
                            ) : agencies.map((agency: any) => (
                                <tr key={agency.id} className={cn(
                                    "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors group",
                                    agency.highlight === 'orange' && "border-l-[3px] border-l-orange-400",
                                    agency.highlight === 'red' && "border-l-[3px] border-l-red-500"
                                )}>
                                    <td className="py-2.5 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 leading-tight">{agency.name}</span>
                                            <span className="text-[11px] text-gray-500">{agency.location}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3"><SubscriptionBadge type={agency.subscription} /></td>
                                    <td className="py-2.5 px-3"><OnboardingBadge status={agency.onboarding} /></td>
                                    <td className="py-2.5 px-3 text-right text-gray-900 font-medium">{agency.listings}</td>
                                    <td className="py-2.5 px-3 text-right text-gray-900 font-medium">{agency.agents}</td>
                                    <td className="py-2.5 px-3"><FeedStatus status={agency.feed} /></td>
                                    <td className="py-2.5 px-3 text-right text-gray-900 font-medium">{agency.mrr}</td>
                                    <td className="py-2.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-3 relative">
                                            <span className="text-gray-500">{agency.lastActivity}</span>
                                            <Link to={`/agencies/$id`} params={{ id: agency.id }} className="text-[#2B5CE6] hover:underline font-medium opacity-0 group-hover:opacity-100 transition-opacity">View</Link>
                                            <div className="relative">
                                                <button onClick={() => setOpenMenuId(openMenuId === agency.id ? null : agency.id)} className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors focus:outline-none">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                {openMenuId === agency.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded shadow-lg z-10 py-1 overflow-hidden" onMouseLeave={() => setOpenMenuId(null)}>
                                                        <Link to={`/agencies/$id`} params={{ id: agency.id }} className="block px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-gray-900">View details</Link>
                                                        <button className="w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-gray-900">Edit</button>
                                                        <button className="w-full text-left px-4 py-2 text-[12px] text-orange-600 hover:bg-orange-50 hover:text-orange-700">Suspend</button>
                                                        <button className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 hover:text-red-700">Archive</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SendInvitationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export const Route = createFileRoute('/agencies/')({
    component: RouteComponent,
});
