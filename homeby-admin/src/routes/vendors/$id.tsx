import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { MoreHorizontal, Plus, Download, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type VendorTab = 'Overview' | 'Coverage' | 'Invoices' | 'Notes' | 'Audit';

// Mock vendor detail data keyed by id
const vendorData: Record<string, {
    id: number;
    name: string;
    initials: string;
    category: string;
    coverage: string;
    status: 'Active' | 'Expiring soon' | 'Paused' | 'Terminated';
    monthlyFee: string;
    contractSince: string;
    nextInvoice: string;
    // Overview fields
    companyLegalName: string;
    abn: string;
    contactPerson: string;
    email: string;
    phone: string;
    billingAddress: string;
    website: string;
    contractStart: string;
    contractEnd: string;
    paymentTerms: string;
    feeAmount: string;
    serviceType: string;
    connectionMethod: string;
    activeOnPropertyPages: boolean;
    referralUrl: string;
    // Coverage
    stateCoverage: { state: string; coverageType: string; status: 'Active' | 'Not covered'; addedDate: string }[];
    // Invoices
    invoices: { date: string; period: string; amount: string; status: 'Paid' | 'Upcoming'; notes: string }[];
    // Notes
    notes: string;
    notesLastEdited: string;
}> = {
    '1': {
        id: 1,
        name: 'BuildSafe Inspections',
        initials: 'BI',
        category: 'Building & Pest',
        coverage: 'NSW, VIC, QLD',
        status: 'Active',
        monthlyFee: '$800/mo',
        contractSince: 'Jan 2026',
        nextInvoice: '1 Jun 2026',
        companyLegalName: 'BuildSafe Inspections Pty Ltd',
        abn: '52 841 234 567',
        contactPerson: 'Mark Henderson',
        email: 'mark@buildsafe.com.au',
        phone: '+61 412 xxx xxx',
        billingAddress: 'Level 4, 100 Harris Street, Pyrmont NSW 2009',
        website: 'buildsafe.com.au',
        contractStart: '1 Jan 2026',
        contractEnd: '31 Dec 2026',
        paymentTerms: 'Net 14 days',
        feeAmount: '$800',
        serviceType: 'Building & Pest',
        connectionMethod: 'Deep link referral (UTM tracked)',
        activeOnPropertyPages: true,
        referralUrl: '...ldsafe.com.au/homeby',
        stateCoverage: [
            { state: 'NSW', coverageType: 'All suburbs', status: 'Active', addedDate: '1 Jan 2026' },
            { state: 'VIC', coverageType: 'All suburbs', status: 'Active', addedDate: '1 Jan 2026' },
            { state: 'QLD', coverageType: 'Brisbane metro only', status: 'Active', addedDate: '1 Mar 2026' },
            { state: 'SA', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'WA', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'TAS', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'NT', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'ACT', coverageType: '—', status: 'Not covered', addedDate: '—' },
        ],
        invoices: [
            { date: '1 May 2026', period: 'May 2026', amount: '$800', status: 'Paid', notes: '—' },
            { date: '1 Apr 2026', period: 'Apr 2026', amount: '$800', status: 'Paid', notes: '—' },
            { date: '1 Mar 2026', period: 'Mar 2026', amount: '$800', status: 'Paid', notes: '—' },
            { date: '1 Feb 2026', period: 'Feb 2026', amount: '$800', status: 'Paid', notes: '—' },
            { date: '1 Jan 2026', period: 'Jan 2026', amount: '$800', status: 'Paid', notes: 'Setup month' },
            { date: '15 Jun 2026', period: 'Jun 2026', amount: '$800', status: 'Upcoming', notes: '—' },
        ],
        notes: 'Signed Jan 2026. Primary contact Mark Henderson — very responsive. Interested in expanding to SA in Q3.\n\nDiscussed exclusivity arrangement for NSW — declined for now, review in Q4 2026.\n\nPayment always on time.',
        notesLastEdited: 'Arash · 28 Apr 2026',
    },
    '2': {
        id: 2,
        name: 'ConveyPro Legal',
        initials: 'CL',
        category: 'Conveyancing',
        coverage: 'NSW, VIC',
        status: 'Active',
        monthlyFee: '$650/mo',
        contractSince: 'Feb 2026',
        nextInvoice: '1 Jun 2026',
        companyLegalName: 'ConveyPro Legal Pty Ltd',
        abn: '31 902 345 678',
        contactPerson: 'Sarah Nguyen',
        email: 'sarah@conveypro.com.au',
        phone: '+61 422 xxx xxx',
        billingAddress: 'Suite 12, 200 George St, Sydney NSW 2000',
        website: 'conveypro.com.au',
        contractStart: '1 Feb 2026',
        contractEnd: '31 Jan 2027',
        paymentTerms: 'Net 14 days',
        feeAmount: '$650',
        serviceType: 'Conveyancing',
        connectionMethod: 'Direct referral form',
        activeOnPropertyPages: true,
        referralUrl: '...conveypro.com.au/homeby',
        stateCoverage: [
            { state: 'NSW', coverageType: 'All suburbs', status: 'Active', addedDate: '1 Feb 2026' },
            { state: 'VIC', coverageType: 'Metro only', status: 'Active', addedDate: '1 Feb 2026' },
            { state: 'QLD', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'SA', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'WA', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'TAS', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'NT', coverageType: '—', status: 'Not covered', addedDate: '—' },
            { state: 'ACT', coverageType: '—', status: 'Not covered', addedDate: '—' },
        ],
        invoices: [
            { date: '1 May 2026', period: 'May 2026', amount: '$650', status: 'Paid', notes: '—' },
            { date: '1 Apr 2026', period: 'Apr 2026', amount: '$650', status: 'Paid', notes: '—' },
            { date: '1 Mar 2026', period: 'Mar 2026', amount: '$650', status: 'Paid', notes: '—' },
            { date: '15 Jun 2026', period: 'Jun 2026', amount: '$650', status: 'Upcoming', notes: '—' },
        ],
        notes: 'Strong partner in NSW. Potential to expand to QLD next quarter.',
        notesLastEdited: 'Arash · 10 May 2026',
    },
};

// Fallback vendor for IDs not in the map
const fallbackVendor = vendorData['1'];

const statusBadgeClass: Record<string, string> = {
    Active: 'bg-green-50 text-green-700 border border-green-200',
    'Expiring soon': 'bg-orange-50 text-orange-700 border border-orange-200',
    Paused: 'bg-orange-50 text-orange-600 border border-orange-200',
    Terminated: 'bg-red-50 text-red-600 border border-red-200',
};

const TABS: VendorTab[] = ['Overview', 'Coverage', 'Invoices', 'Notes', 'Audit'];

const RouteComponent = () => {
    const { id } = Route.useParams();
    const vendor = vendorData[id] || { ...fallbackVendor, id: parseInt(id) };

    const [activeTab, setActiveTab] = useState<VendorTab>('Overview');
    const [notes, setNotes] = useState(vendor.notes);

    return (
        <div className="flex flex-col gap-0 w-full max-w-content mx-auto pb-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-5">
                <Link to="/vendors" className="hover:text-gray-700 transition-colors">Vendors</Link>
                <span>›</span>
                <span className="text-gray-900 font-medium">{vendor.name}</span>
            </div>

            {/* Vendor Header Card */}
            <div className="bg-white border border-gray-200 rounded shadow-sm px-6 py-5 mb-5">
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-[15px] font-bold text-gray-600 shrink-0">
                            {vendor.initials}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-[18px] font-bold text-gray-900 leading-tight">{vendor.name}</h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                    {vendor.category}
                                </span>
                                <span className="text-[13px] text-gray-500">{vendor.coverage}</span>
                                <span className={cn('inline-block px-2 py-0.5 rounded text-[11px] font-medium', statusBadgeClass[vendor.status])}>
                                    {vendor.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contract info */}
                    <div className="flex items-center gap-6 shrink-0">
                        <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-[11px] text-gray-400 font-medium">Monthly fee</span>
                            <span className="text-[14px] font-bold text-gray-900">{vendor.monthlyFee}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-[11px] text-gray-400 font-medium">Contract since</span>
                            <span className="text-[14px] font-bold text-gray-900">{vendor.contractSince}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-[11px] text-gray-400 font-medium">Next invoice</span>
                            <span className="text-[14px] font-bold text-gray-900">{vendor.nextInvoice}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-5">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'py-3 text-[13px] font-bold border-b-2 transition-colors',
                            activeTab === tab
                                ? 'border-[#2B5CE6] text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'Overview' && (
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Contract Details */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
                            <h2 className="text-[14px] font-bold text-gray-900 mb-4">Contract details</h2>
                            <div className="flex flex-col gap-3 text-[13px]">
                                {[
                                    { label: 'Company legal name', value: vendor.companyLegalName },
                                    { label: 'ABN', value: vendor.abn },
                                    { label: 'Contact person', value: vendor.contactPerson },
                                    { label: 'Email', value: vendor.email, isLink: 'email' },
                                    { label: 'Phone', value: vendor.phone },
                                    { label: 'Billing address', value: vendor.billingAddress },
                                    { label: 'Website', value: vendor.website, isLink: 'web' },
                                    { label: 'Contract start', value: vendor.contractStart },
                                    { label: 'Contract end', value: vendor.contractEnd },
                                    { label: 'Payment terms', value: vendor.paymentTerms },
                                    { label: 'Monthly fee', value: vendor.feeAmount },
                                ].map(({ label, value, isLink }) => (
                                    <div key={label} className="grid grid-cols-[160px_1fr] gap-x-3">
                                        <span className="text-gray-400">{label}</span>
                                        {isLink === 'email' ? (
                                            <a href={`mailto:${value}`} className="text-[#2B5CE6] hover:underline">{value}</a>
                                        ) : isLink === 'web' ? (
                                            <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-[#2B5CE6] hover:underline">{value}</a>
                                        ) : (
                                            <span className="text-gray-700">{value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
                            <h2 className="text-[14px] font-bold text-gray-900 mb-4">Service info</h2>
                            <div className="flex flex-col gap-3 text-[13px]">
                                <div className="grid grid-cols-[170px_1fr] gap-x-3">
                                    <span className="text-gray-400">Service type</span>
                                    <span className="text-gray-700 font-medium">{vendor.serviceType}</span>
                                </div>
                                <div className="grid grid-cols-[170px_1fr] gap-x-3">
                                    <span className="text-gray-400">Coverage</span>
                                    <span className="text-gray-700 font-medium">{vendor.coverage}</span>
                                </div>
                                <div className="grid grid-cols-[170px_1fr] gap-x-3">
                                    <span className="text-gray-400">Connection method</span>
                                    <span className="text-gray-700">{vendor.connectionMethod}</span>
                                </div>
                                <div className="grid grid-cols-[170px_1fr] gap-x-3 items-center">
                                    <span className="text-gray-400">Active on property pages</span>
                                    {vendor.activeOnPropertyPages ? (
                                        <span className="inline-block self-start px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                            Yes — showing to users
                                        </span>
                                    ) : (
                                        <span className="inline-block self-start px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                            No
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-[170px_1fr] gap-x-3">
                                    <span className="text-gray-400">Referral URL</span>
                                    <span className="text-gray-500 font-mono text-[12px] truncate">{vendor.referralUrl}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-orange-50 border border-orange-200 rounded p-4 flex items-start gap-3 text-[13px] text-orange-800">
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>
                            This vendor's button appears on property detail pages in covered regions. Users are redirected directly to the vendor's website. No transaction data is captured by HomeBy.
                        </span>
                    </div>
                </div>
            )}

            {/* Coverage Tab */}
            {activeTab === 'Coverage' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-bold text-gray-900">Service coverage</h2>
                            <p className="text-[13px] text-gray-500">Regions where this vendor's button is shown on HomeBy property pages</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-[13px] font-medium rounded hover:bg-gray-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            Add coverage
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                        <table className="w-full text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500 bg-white">
                                    <th className="font-medium py-3 pl-4 pr-3">State</th>
                                    <th className="font-medium py-3 px-3">Coverage type</th>
                                    <th className="font-medium py-3 px-3">Status</th>
                                    <th className="font-medium py-3 pl-3 pr-4">Added date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendor.stateCoverage.map((row) => (
                                    <tr key={row.state} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-3.5 pl-4 pr-3 font-bold text-gray-900">{row.state}</td>
                                        <td className="py-3.5 px-3 text-gray-600">{row.coverageType}</td>
                                        <td className="py-3.5 px-3">
                                            {row.status === 'Active' ? (
                                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-[13px] text-gray-400">Not covered</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 pl-3 pr-4 text-gray-700">{row.addedDate === '—' ? <span className="text-gray-400">—</span> : row.addedDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'Invoices' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[15px] font-bold text-gray-900">Invoice history</h2>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-[13px] font-medium rounded hover:bg-gray-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            Generate invoice
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                        <table className="w-full text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500 bg-white">
                                    <th className="font-medium py-3 pl-4 pr-3">Date</th>
                                    <th className="font-medium py-3 px-3">Period</th>
                                    <th className="font-medium py-3 px-3">Amount</th>
                                    <th className="font-medium py-3 px-3">Status</th>
                                    <th className="font-medium py-3 px-3">Notes</th>
                                    <th className="font-medium py-3 pl-3 pr-4 text-right">Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendor.invoices.map((inv, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-3.5 pl-4 pr-3 text-gray-700">{inv.date}</td>
                                        <td className="py-3.5 px-3 text-gray-700">{inv.period}</td>
                                        <td className="py-3.5 px-3 text-gray-700">{inv.amount}</td>
                                        <td className="py-3.5 px-3">
                                            {inv.status === 'Paid' ? (
                                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    Upcoming
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-3 text-gray-500">{inv.notes}</td>
                                        <td className="py-3.5 pl-3 pr-4 text-right">
                                            {inv.status === 'Paid' ? (
                                                <button className="flex items-center gap-1.5 text-[#2B5CE6] hover:underline text-[13px] font-medium ml-auto">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download
                                                </button>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'Notes' && (
                <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-4">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-[220px] bg-white border border-gray-200 rounded p-3 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-gray-400">Last edited: {vendor.notesLastEdited}</span>
                        <button className="px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded hover:bg-gray-700 transition-colors">
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Audit Tab */}
            {activeTab === 'Audit' && (
                <div className="bg-white border border-gray-200 rounded shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[200px] gap-2">
                    <span className="text-[14px] font-bold text-gray-700">Audit log</span>
                    <p className="text-[13px] text-gray-400 max-w-sm">
                        Full audit trail for this vendor — contract changes, invoice actions, coverage edits, and admin notes.
                    </p>
                    <p className="text-[12px] text-gray-300 mt-2">Coming soon</p>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute('/vendors/$id')({
    component: RouteComponent,
});
