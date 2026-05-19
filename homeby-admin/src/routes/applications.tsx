import { createFileRoute } from '@tanstack/react-router';
import { Search, Check, X, X as CloseIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const mockApplications = [
    { id: 1, name: "James Wilson", email: "james.wilson@century21bondi.com.au", agency: "Century 21 Bondi", crm: "Box+Dice", submitted: "2 hours ago", status: "Pending", phone: "+61 412 308 991" },
    { id: 2, name: "Melissa Park", email: "melissa.park@ljhooker.com.au", agency: "LJ Hooker Chatswood", crm: "VaultRE", submitted: "5 hours ago", status: "Pending" },
    { id: 3, name: "Robert Chen", email: "robert.chen@raywhite.com.au", agency: "Ray White Newtown", crm: "AgentBox", submitted: "1 day ago", status: "Pending" },
    { id: 4, name: "Sophie Anderson", email: "sophie.anderson@harcourts.com.au", agency: "Harcourts Brisbane", crm: "Rex Software", submitted: "1 day ago", status: "Pending" },
    { id: 5, name: "David Kumar", email: "david.kumar@belleproperty.com.au", agency: "Belle Property Paddington", crm: "PropertyMe", submitted: "2 days ago", status: "Pending" },
    { id: 6, name: "Emma Thompson", email: "emma.t@mcgrath.com.au", agency: "McGrath Double Bay", crm: "VaultRE", submitted: "2 days ago", status: "Awaiting info" },
    { id: 7, name: "Michael Brown", email: "michael.b@stonerealestate.com.au", agency: "Stone Real Estate", crm: "Console Cloud", submitted: "3 days ago", status: "Awaiting info" },
    { id: 8, name: "Lisa Zhang", email: "lisa.zhang@jellis.com.au", agency: "Jellis Craig Fitzroy", crm: "Rex Software", submitted: "3 days ago", status: "Pending" },
    { id: 9, name: "Tom Harris", email: "tom.harris@nre.com.au", agency: "Nelson Alexander", crm: "MyDesktop", submitted: "5 days ago", status: "Approved" },
    { id: 10, name: "Priya Patel", email: "priya.patel@barryplant.com.au", agency: "Barry Plant", crm: "HomeBy Direct", submitted: "6 days ago", status: "Approved" },
    { id: 11, name: "Chris O'Brien", email: "chris.obrien@firstnational.com.au", agency: "First National", crm: "Manual / FTP Upload", submitted: "1 week ago", status: "Rejected" },
    { id: 12, name: "Sarah Nguyen", email: "sarah.nguyen@hockingstuart.com.au", agency: "Hocking Stuart", crm: "Reapit", submitted: "1 week ago", status: "Approved" }
];

const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = "";
    switch (status) {
        case "Pending":
            colorClass = "bg-orange-50 text-orange-700 border border-orange-200";
            break;
        case "Approved":
            colorClass = "bg-green-50 text-green-700 border border-green-200";
            break;
        case "Rejected":
            colorClass = "bg-red-50 text-red-700 border border-red-200";
            break;
        case "Awaiting info":
            colorClass = "bg-gray-100 text-gray-700 border border-gray-200";
            break;
    }

    return (
        <span className={cn("inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap", colorClass)}>
            {status}
        </span>
    );
};

const RouteComponent = () => {
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"Application" | "Verification" | "Notes">("Application");

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Applications</h1>
                <p className="text-[13px] text-gray-500">Review and process incoming agent registration requests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                    <span className="text-[13px] text-gray-500 font-medium">Total applications</span>
                    <span className="text-[24px] font-bold text-gray-900">47</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="text-[13px] text-gray-500 font-medium">Pending review</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">8</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[13px] text-gray-500 font-medium">Approved this month</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">12</span>
                </div>
                <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[13px] text-gray-500 font-medium">Rejected</span>
                    </div>
                    <span className="text-[24px] font-bold text-gray-900">3</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search applicant name, agency, email..." 
                        className="w-full pl-9 pr-4 py-2 text-[13px] bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-[12px] font-medium bg-gray-900 text-white rounded">All</button>
                    <button className="px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Pending</button>
                    <button className="px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Approved</button>
                    <button className="px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Rejected</button>
                    <button className="px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Awaiting info</button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left text-[13px] table-auto">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 bg-white">
                                <th className="font-medium py-3 pl-4 pr-3">Applicant</th>
                                <th className="font-medium py-3 px-3">Agency</th>
                                <th className="font-medium py-3 px-3">CRM</th>
                                <th className="font-medium py-3 px-3">Submitted</th>
                                <th className="font-medium py-3 px-3">Status</th>
                                <th className="font-medium py-3 pl-3 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockApplications.map((app) => (
                                <tr key={app.id} className={cn(
                                    "border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors",
                                    selectedApp?.id === app.id && "bg-gray-50 border-l-2 border-l-[#2B5CE6]"
                                )}>
                                    <td className="py-3 pl-4 pr-3 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{app.name}</span>
                                            <span className="text-gray-500 text-[12px]">{app.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-gray-700 whitespace-nowrap">{app.agency}</td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                            {app.crm}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{app.submitted}</td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="py-3 pl-3 pr-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                className="text-[#2B5CE6] font-medium hover:underline text-[13px]"
                                                onClick={() => { setSelectedApp(app); setActiveTab("Application"); }}
                                            >
                                                Review
                                            </button>
                                            <button className="text-green-500 hover:text-green-700 transition-colors">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Side Drawer */}
            {selectedApp && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-[60] transition-opacity" onClick={() => setSelectedApp(null)} />
                    <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-200 overflow-hidden animate-in slide-in-from-right duration-200">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 relative">
                            <button 
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
                                onClick={() => setSelectedApp(null)}
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                            
                            <h2 className="text-[18px] font-bold text-gray-900 mb-1">{selectedApp.name}</h2>
                            <div className="text-[13px] text-gray-500 flex flex-col gap-0.5 mb-3">
                                <span>{selectedApp.email}</span>
                                <span>{selectedApp.phone || "+61 412 308 991"}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-[12px]">
                                <StatusBadge status={selectedApp.status} />
                                <span className="text-gray-500">Submitted {selectedApp.submitted}</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 border-b border-gray-200 bg-white shrink-0">
                            <div className="flex gap-6">
                                {["Application", "Verification", "Notes"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={cn(
                                            "py-3 text-[13px] font-medium border-b-2 transition-colors",
                                            activeTab === tab ? "border-[#2B5CE6] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 sidebar-scrollbar">
                            {activeTab === "Application" && (
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Agency Details</h3>
                                        <div className="flex flex-col gap-3 text-[13px]">
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Legal name</span>
                                                <span className="text-gray-900">{selectedApp.agency}</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Agency email</span>
                                                <span className="text-gray-900">admin@{selectedApp.agency.toLowerCase().replace(/\s/g, "")}.com.au</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Address</span>
                                                <span className="text-gray-900">142 Campbell Parade, Bondi NSW 2026</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2 items-center">
                                                <span className="text-gray-500">CRM</span>
                                                <div>
                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                        {selectedApp.crm}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Licence number</span>
                                                <span className="text-gray-900">LIC-NSW-28441</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">ABN (optional)</span>
                                                <span className="text-gray-900">45 123 456 789</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Agent Details</h3>
                                        <div className="flex flex-col gap-3 text-[13px]">
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Name</span>
                                                <span className="text-gray-900">{selectedApp.name}</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Email</span>
                                                <span className="text-gray-900">{selectedApp.email}</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Licence</span>
                                                <span className="text-gray-900">LIC-NSW-28441</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Interested in</span>
                                                <span className="text-gray-900">Residential sales</span>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-x-2">
                                                <span className="text-gray-500">Message</span>
                                                <span className="text-gray-900">We are a boutique agency looking to expand our digital presence. HomeBy looks like a great fit.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Verification" && (
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-2">Verification checks</h3>
                                    
                                    <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[13px] font-bold text-gray-900">ABN Lookup</h4>
                                            <span className="text-green-600 text-[11px] font-bold bg-green-50 px-1.5 py-0.5 rounded">Verified</span>
                                        </div>
                                        <div className="text-[13px] text-gray-900 mt-1">45 123 456 789</div>
                                        <div className="text-[12px] text-gray-500">Entity: {selectedApp.agency} Pty Ltd · GST registered: Yes</div>
                                        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-[12px] font-medium hover:bg-gray-50 self-start mt-2">
                                            Re-check ABN
                                        </button>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded shadow-sm p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[13px] font-bold text-gray-900">Agent Licence</h4>
                                            <span className="text-orange-600 text-[11px] font-bold bg-orange-50 px-1.5 py-0.5 rounded">Manual check required</span>
                                        </div>
                                        <div className="text-[13px] text-gray-900 mt-1">LIC-NSW-28441</div>
                                        <div className="text-[12px] text-gray-500 leading-relaxed">
                                            Auto-verification unavailable for NSW. Please verify manually at NSW Fair Trading.
                                        </div>
                                        <button className="text-[#2B5CE6] text-[12px] font-medium hover:underline self-start">
                                            NSW Fair Trading →
                                        </button>
                                        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded text-[12px] font-medium hover:bg-gray-50 self-start mt-2">
                                            Mark as verified
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Notes" && (
                                <div className="flex flex-col gap-4 h-full">
                                    <textarea 
                                        placeholder="Add internal notes about this application..."
                                        className="w-full h-[200px] bg-white border border-gray-200 rounded p-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    />
                                    <button className="px-4 py-2 bg-[#2B5CE6] text-white hover:bg-blue-700 rounded text-[13px] font-medium self-end transition-colors">
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-2 shrink-0">
                            <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-[13px] font-medium transition-colors">
                                Approve application
                            </button>
                            <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded text-[13px] font-medium transition-colors">
                                Request more information
                            </button>
                            <button className="w-full py-2.5 bg-white text-red-500 hover:text-red-700 rounded text-[13px] font-medium transition-colors">
                                Reject application
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const Route = createFileRoute("/applications")({
    component: RouteComponent,
});
