import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ContractStatus = 'Active' | 'Expiring soon' | 'Paused' | 'Terminated';
type FilterTab = 'All' | 'Active' | 'Paused' | 'Terminated';

interface Vendor {
    id: number;
    name: string;
    category: string;
    coverage: string;
    monthlyFee: string;
    contractStatus: ContractStatus;
    nextInvoice: string;
    lastActivity: string;
}

const mockVendors: Vendor[] = [
    { id: 1, name: 'BuildSafe Inspections', category: 'Building & Pest', coverage: 'NSW, VIC, QLD', monthlyFee: '$800/mo', contractStatus: 'Active', nextInvoice: '1 Jun 2026', lastActivity: '2 days ago' },
    { id: 2, name: 'ConveyPro Legal', category: 'Conveyancing', coverage: 'NSW, VIC', monthlyFee: '$650/mo', contractStatus: 'Active', nextInvoice: '1 Jun 2026', lastActivity: '1 week ago' },
    { id: 3, name: 'HomeLoan Express', category: 'Mortgage broking', coverage: 'All states', monthlyFee: '$900/mo', contractStatus: 'Active', nextInvoice: '1 Jun 2026', lastActivity: '3 days ago' },
    { id: 4, name: 'PropertyShield Insurance', category: 'Insurance', coverage: 'All states', monthlyFee: '$550/mo', contractStatus: 'Active', nextInvoice: '1 Jun 2026', lastActivity: '4 days ago' },
    { id: 5, name: 'LensWork Photography', category: 'Photography & Styling', coverage: 'NSW, VIC', monthlyFee: '$400/mo', contractStatus: 'Active', nextInvoice: '1 Jun 2026', lastActivity: '1 week ago' },
    { id: 6, name: 'MoveIt Removalists', category: 'Moving & Removalist', coverage: 'NSW, VIC, QLD', monthlyFee: '$350/mo', contractStatus: 'Expiring soon', nextInvoice: '15 Jun 2026', lastActivity: '2 weeks ago' },
    { id: 7, name: 'TitleGuard Legal', category: 'Conveyancing', coverage: 'QLD, WA', monthlyFee: '$500/mo', contractStatus: 'Paused', nextInvoice: '—', lastActivity: '1 month ago' },
    { id: 8, name: 'FastMove Logistics', category: 'Moving & Removalist', coverage: 'VIC, SA', monthlyFee: '$300/mo', contractStatus: 'Terminated', nextInvoice: '—', lastActivity: '3 months ago' },
];

const statusConfig: Record<ContractStatus, { label: string; className: string }> = {
    'Active': { label: 'Active', className: 'bg-green-50 text-green-700 border border-green-200' },
    'Expiring soon': { label: 'Expiring soon', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
    'Paused': { label: 'Paused', className: 'bg-orange-50 text-orange-600 border border-orange-200' },
    'Terminated': { label: 'Terminated', className: 'bg-red-50 text-red-600 border border-red-200' },
};

const StatusBadge = ({ status }: { status: ContractStatus }) => {
    const config = statusConfig[status];
    return (
        <span className={cn('inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap', config.className)}>
            {config.label}
        </span>
    );
};

const RouteComponent = () => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

    const filtered = mockVendors.filter((v) => {
        const matchSearch =
            search === '' ||
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.category.toLowerCase().includes(search.toLowerCase()) ||
            v.coverage.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            activeFilter === 'All' ||
            (activeFilter === 'Active' && (v.contractStatus === 'Active' || v.contractStatus === 'Expiring soon')) ||
            (activeFilter === 'Paused' && v.contractStatus === 'Paused') ||
            (activeFilter === 'Terminated' && v.contractStatus === 'Terminated');
        return matchSearch && matchFilter;
    });

    const activeCount = mockVendors.filter(v => v.contractStatus === 'Active' || v.contractStatus === 'Expiring soon').length;
    const expiringCount = mockVendors.filter(v => v.contractStatus === 'Expiring soon').length;
    const totalRevenue = mockVendors
        .filter(v => v.contractStatus === 'Active' || v.contractStatus === 'Expiring soon')
        .reduce((sum, v) => sum + parseInt(v.monthlyFee.replace(/[^0-9]/g, '')), 0);

    const filterTabs: FilterTab[] = ['All', 'Active', 'Paused', 'Terminated'];

    return (
        <div className="flex flex-col gap-6 w-full max-w-content mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Vendors</h1>
                <p className="text-[13px] text-gray-500">Manage third-party service partners and their contracts.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[13px] text-gray-500 font-medium">Active vendors</span>
                    </div>
                    <span className="text-[30px] font-bold text-gray-900 leading-none">{activeCount}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-[13px] text-gray-500 font-medium">Contracts expiring (30d)</span>
                    </div>
                    <span className="text-[30px] font-bold text-gray-900 leading-none">{expiringCount}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-2">
                    <span className="text-[13px] text-gray-500 font-medium">Monthly vendor revenue</span>
                    <span className="text-[30px] font-bold text-gray-900 leading-none">
                        ${totalRevenue.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search vendor name, category, region..."
                        className="w-full pl-9 pr-4 py-2 text-[13px] bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-1">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={cn(
                                'px-3 py-1.5 text-[12px] font-medium rounded transition-colors',
                                activeFilter === tab
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left text-[13px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 bg-white">
                                <th className="font-medium py-3 pl-4 pr-3">Vendor</th>
                                <th className="font-medium py-3 px-3">Coverage</th>
                                <th className="font-medium py-3 px-3">Monthly fee</th>
                                <th className="font-medium py-3 px-3">Contract status</th>
                                <th className="font-medium py-3 px-3">Next invoice</th>
                                <th className="font-medium py-3 px-3">Last activity</th>
                                <th className="font-medium py-3 pl-3 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((vendor) => (
                                <tr
                                    key={vendor.id}
                                    className={cn(
                                        'border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors',
                                        vendor.contractStatus === 'Terminated' && 'opacity-60'
                                    )}
                                >
                                    <td className="py-3.5 pl-4 pr-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={cn(
                                                'font-bold text-gray-900',
                                                vendor.contractStatus === 'Terminated' && 'text-gray-500'
                                            )}>
                                                {vendor.name}
                                            </span>
                                            <span className="inline-block self-start px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                                {vendor.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">{vendor.coverage}</td>
                                    <td className="py-3.5 px-3 text-gray-700 whitespace-nowrap">{vendor.monthlyFee}</td>
                                    <td className="py-3.5 px-3 whitespace-nowrap">
                                        <StatusBadge status={vendor.contractStatus} />
                                    </td>
                                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">{vendor.nextInvoice}</td>
                                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">{vendor.lastActivity}</td>
                                    <td className="py-3.5 pl-3 pr-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                to={`/vendors/$id` as any}
                                                params={{ id: String(vendor.id) } as any}
                                                className="text-[#2B5CE6] font-medium hover:underline text-[13px]"
                                            >
                                                View
                                            </Link>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[13px] text-gray-400">
                                        No vendors match your search or filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute('/vendors/')({
    component: RouteComponent,
});
