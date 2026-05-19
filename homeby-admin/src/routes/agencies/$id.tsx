import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight, MoreHorizontal, AlertTriangle, Download, Star } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const RouteComponent = () => {
    const [activeTab, setActiveTab] = useState("Overview");

    const tabs = ["Overview", "Agents", "Listings", "Subscription & Billing", "Reviews", "Notes", "Audit"];

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Link to="/agencies" className="hover:text-gray-900 transition-colors">Agencies</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-medium">Ray White Bondi</span>
            </div>

            {/* Header Card */}
            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[16px] font-bold text-gray-700 shrink-0">
                            RW
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Ray White Bondi</h1>
                            <div className="flex items-center gap-3 text-[12px] text-gray-500">
                                <span>Bondi, NSW</span>
                                <span>ABN: 51 824 753 556</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700">Founding Partner</span>
                                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Live</span>
                                <div className="flex items-center gap-1.5 ml-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[11px] font-medium text-gray-900">Healthy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors focus:outline-none border border-gray-200">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-6 pt-5 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-gray-500">Active listings</span>
                        <span className="text-[18px] font-bold text-gray-900">247</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-gray-500">Active agents</span>
                        <span className="text-[18px] font-bold text-gray-900">8</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-gray-500">MRR</span>
                        <span className="text-[18px] font-bold text-gray-900">$890/mo</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] text-gray-500">Member since</span>
                        <span className="text-[18px] font-bold text-gray-900">Dec 2024</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                                activeTab === tab ? "border-[#2B5CE6] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === "Overview" && (
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Onboarding status */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-6">
                            <h2 className="text-[14px] font-bold text-gray-900">Onboarding status</h2>
                            
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1">
                                    {["APPLIED", "APPROVED", "CRM CONNECTED", "SYNCING", "VALIDATION"].map((step) => (
                                        <div key={step} className="flex-1 flex flex-col gap-1.5 relative">
                                            <div className="h-1.5 w-full bg-green-500 rounded-full" />
                                            <span className="text-[9px] font-bold text-green-600">{step}</span>
                                        </div>
                                    ))}
                                    <div className="flex-1 flex flex-col gap-1.5 relative">
                                        <div className="h-1.5 w-full bg-[#2B5CE6] rounded-full" />
                                        <span className="text-[9px] font-bold text-[#2B5CE6]">LIVE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[12px] pt-2">
                                <span className="text-gray-500">Assigned admin</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">SC</div>
                                    <span className="text-gray-900 font-medium">Sarah Chen</span>
                                </div>

                                <span className="text-gray-500">CRM provider</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2B5CE6] border border-blue-100 font-medium text-[11px]">Box+Dice</span>
                                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-medium text-[11px]">REAXML</span>
                                </div>

                                <span className="text-gray-500">Feed status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-gray-900 font-medium">Healthy</span>
                                    <span className="text-gray-500">— last synced 14 min ago</span>
                                </div>
                            </div>

                            <button className="text-[#2B5CE6] text-[12px] font-medium hover:underline self-start mt-2">
                                View feed details ↗
                            </button>
                        </div>

                        {/* Listing distribution */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-4">
                            <div className="flex flex-col">
                                <h2 className="text-[14px] font-bold text-gray-900">Listing distribution</h2>
                                <p className="text-[11px] text-gray-500">Portals this agency publishes listings to</p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    { name: "HomeBy", icon: "H", color: "text-[#2B5CE6] bg-blue-50", status: "Connected", listings: "247 published", active: true },
                                    { name: "Realestate.com", icon: "R", color: "text-red-600 bg-red-50", status: "Connected", listings: "247 published", active: true },
                                    { name: "Domain", icon: "D", color: "text-green-600 bg-green-50", status: "Connected", listings: "247 published", active: true },
                                    { name: "View", icon: "V", color: "text-purple-600 bg-purple-50", status: "Connected", listings: "247 published", active: true },
                                    { name: "Homely", icon: "H", color: "text-gray-500 bg-gray-100", status: "Not connected", listings: "0 published", active: false },
                                ].map(portal => (
                                    <div key={portal.name} className="border border-gray-200 rounded p-3 flex flex-col gap-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold", portal.color)}>
                                                {portal.icon}
                                            </div>
                                            <span className="text-[12px] font-bold text-gray-900">{portal.name}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn("w-1 h-1 rounded-full", portal.active ? "bg-green-500" : "bg-gray-300")} />
                                                <span className="text-[11px] text-gray-900 font-medium">{portal.status}</span>
                                            </div>
                                            <span className="text-[11px] text-gray-500 pl-2.5">{portal.listings}</span>
                                        </div>
                                        {!portal.active && (
                                            <button className="text-[#2B5CE6] text-[11px] font-medium hover:underline self-start mt-1">Set up</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Internal notes */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[14px] font-bold text-gray-900">Internal notes</h2>
                                <button onClick={() => setActiveTab("Notes")} className="text-[#2B5CE6] text-[11px] font-medium hover:underline">Edit notes →</button>
                            </div>
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                                Founding partner — onboarded Dec 2024. Primary contact: James Mitchell (james@raywhitebondi.com.au, +61 412 xxx xxx). CRM: Box+Dice, REAXML feed configured by Hirad on 15 Dec 2024.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Activity Timeline */}
                    <div className="w-full lg:w-[320px] bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col h-[500px]">
                        <h2 className="text-[14px] font-bold text-gray-900 mb-4 shrink-0">Activity timeline</h2>
                        <div className="flex-1 overflow-y-auto pr-2 relative sidebar-scrollbar">
                            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-200 z-0" />
                            <div className="flex flex-col gap-5 relative z-10">
                                {[
                                    { title: "Subscription upgraded to Founding Partner", date: "10 Jan 2026", color: "bg-[#2B5CE6]" },
                                    { title: "Feed recovered — syncing resumed", date: "8 Jan 2026", color: "bg-green-500" },
                                    { title: "Feed warning — stale >24h", date: "7 Jan 2026", color: "bg-orange-400" },
                                    { title: "First sync completed — 47 listings imported", date: "20 Dec 2024", color: "bg-green-500" },
                                    { title: "CRM connected — Box+Dice REAXML", date: "18 Dec 2024", color: "bg-green-500" },
                                    { title: "Welcome email sent with temporary credentials", date: "15 Dec 2024", color: "bg-[#2B5CE6]" },
                                    { title: "Application approved by Arash", date: "15 Dec 2024", color: "bg-green-500" },
                                    { title: "Agency application received", date: "10 Dec 2024", color: "bg-green-500" },
                                ].map((event, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="mt-1 relative">
                                            <div className="w-3 h-3 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", event.color)} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] font-medium text-gray-900 leading-snug">{event.title}</span>
                                            <span className="text-[11px] text-gray-500">{event.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Audit" && (
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500">
                                    <th className="font-medium py-3 px-5">Timestamp</th>
                                    <th className="font-medium py-3 px-5">Action</th>
                                    <th className="font-medium py-3 px-5">Performed by</th>
                                    <th className="font-medium py-3 px-5">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { time: "8 May 2026 14:22", action: "Review flagged", user: "Arash", details: "Review ID #4821 flagged for moderation" },
                                    { time: "2 May 2026 14:32", action: "Notes updated", user: "Arash", details: "Internal notes edited" },
                                    { time: "15 Apr 2026 09:11", action: "Tier changed", user: "Sarah Chen", details: "Professional → Founding Partner" },
                                    { time: "20 Jan 2026 11:44", action: "Feed paused", user: "Hirad", details: "Manual pause for maintenance window" },
                                    { time: "15 Dec 2024 16:30", action: "Agency approved", user: "Arash", details: "Application approved, welcome email sent" },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-3.5 px-5 text-gray-500">{row.time}</td>
                                        <td className="py-3.5 px-5 font-bold text-gray-900">{row.action}</td>
                                        <td className="py-3.5 px-5 text-gray-900">{row.user}</td>
                                        <td className="py-3.5 px-5 text-gray-500">{row.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "Notes" && (
                <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-[14px] font-bold text-gray-900">Internal notes</h2>
                    </div>
                    <div className="p-5">
                        <textarea 
                            className="w-full min-h-[250px] border border-gray-200 rounded p-4 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
                            defaultValue="Founding partner — onboarded Dec 2024. Primary contact: James Mitchell (james@raywhitebondi.com.au, +61 412 xxx xxx). CRM: Box+Dice, REAXML feed configured by Hirad on 15 Dec 2024. Agency expressed interest in Domain exclusivity deal — follow up Q3 2026. High-volume agency, priority support."
                        />
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-[12px] text-gray-500">Last edited: Arash · 2 May 2026 14:32</span>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-[13px] font-medium transition-colors">Save changes</button>
                    </div>
                </div>
            )}

            {activeTab === "Reviews" && (
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500">
                                    <th className="font-medium py-3 px-5">Reviewer</th>
                                    <th className="font-medium py-3 px-5">Agent reviewed</th>
                                    <th className="font-medium py-3 px-5">Rating</th>
                                    <th className="font-medium py-3 px-5">Comment</th>
                                    <th className="font-medium py-3 px-5">Status</th>
                                    <th className="font-medium py-3 px-5">Submitted</th>
                                    <th className="font-medium py-3 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "David K.", agent: "James Mitchell", rating: 5, comment: "James made the entire process...", status: "Approved", date: "3 May 2026", action: "View" },
                                    { name: "Anonymous", agent: "Sarah Chen", rating: 3, comment: "Good communication but...", status: "Pending", date: "8 May 2026", action: "Review" },
                                    { name: "Mark T.", agent: "Michael Torres", rating: 2, comment: "Unfortunately our experience...", status: "Rejected", date: "1 Apr 2026", action: "View" },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-5 font-medium text-gray-900">{row.name}</td>
                                        <td className="py-3 px-5 text-gray-900">{row.agent}</td>
                                        <td className="py-3 px-5">
                                            <div className="flex gap-0.5 text-orange-400">
                                                {[...Array(5)].map((_, index) => (
                                                    <Star key={index} className="w-3.5 h-3.5" fill={index < row.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-5 text-gray-500">{row.comment}</td>
                                        <td className="py-3 px-5">
                                            {row.status === "Approved" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Approved</span>}
                                            {row.status === "Pending" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">Pending</span>}
                                            {row.status === "Rejected" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">Rejected</span>}
                                        </td>
                                        <td className="py-3 px-5 text-gray-500">{row.date}</td>
                                        <td className="py-3 px-5 text-right">
                                            <button className="text-[#2B5CE6] font-medium hover:underline">{row.action}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "Subscription & Billing" && (
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left: Current Plan */}
                    <div className="w-full lg:w-[350px] bg-white border border-gray-200 rounded shadow-sm p-6 flex flex-col gap-6">
                        <div>
                            <span className="text-[13px] text-gray-500 font-medium">Current plan</span>
                            <div className="mt-1">
                                <span className="text-[20px] font-bold text-gray-900">Founding Partner</span>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-[24px] font-bold text-gray-900">$890</span>
                                <span className="text-[13px] text-gray-500">/month</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500">Next renewal</span>
                                <span className="text-gray-900 font-medium">1 June 2026</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500">Payment</span>
                                <span className="text-gray-900 font-medium">Visa ····4242</span>
                            </div>
                            <div className="flex justify-between text-[13px] items-center">
                                <span className="text-gray-500">Status</span>
                                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Active</span>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button className="px-4 py-2 border border-gray-200 rounded text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Change plan</button>
                            <button className="px-4 py-2 border border-gray-200 rounded text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">Update payment method</button>
                        </div>
                    </div>

                    {/* Right: Invoices */}
                    <div className="flex-1 bg-white border border-gray-200 rounded shadow-sm flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-[14px] font-bold text-gray-900">Invoices</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px]">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500">
                                        <th className="font-medium py-3 px-6">Date</th>
                                        <th className="font-medium py-3 px-6">Period</th>
                                        <th className="font-medium py-3 px-6">Amount</th>
                                        <th className="font-medium py-3 px-6">Status</th>
                                        <th className="font-medium py-3 px-6 text-right">Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { date: "1 May 2026", period: "May 2026", amount: "$890", status: "Paid" },
                                        { date: "1 Apr 2026", period: "Apr 2026", amount: "$890", status: "Paid" },
                                        { date: "1 Mar 2026", period: "Mar 2026", amount: "$890", status: "Paid" },
                                        { date: "1 Feb 2026", period: "Feb 2026", amount: "$890", status: "Overdue" },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-medium text-gray-900">{row.date}</td>
                                            <td className="py-4 px-6 text-gray-500">{row.period}</td>
                                            <td className="py-4 px-6 text-gray-900 font-medium">{row.amount}</td>
                                            <td className="py-4 px-6">
                                                {row.status === "Paid" ? (
                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Paid</span>
                                                ) : (
                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">Overdue</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-[#2B5CE6] font-medium hover:underline inline-flex items-center gap-1">
                                                    <Download className="w-3.5 h-3.5" /> PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Listings" && (
                <div className="flex flex-col gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-[13px] text-amber-800">Listing data is read-only in admin. Agents manage listings through the agency portal.</span>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500">
                                        <th className="font-medium py-3 px-5">Address</th>
                                        <th className="font-medium py-3 px-5">Type</th>
                                        <th className="font-medium py-3 px-5">Status</th>
                                        <th className="font-medium py-3 px-5">Listed price</th>
                                        <th className="font-medium py-3 px-5">Listed date</th>
                                        <th className="font-medium py-3 px-5">Distributed to</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { address: "14/8 Campbell Parade, Bondi NSW", type: "For Sale", status: "Active", price: "$1,850,000", date: "12 Jan 2026", dist: "REA, Domain, View" },
                                        { address: "3 Blair Street, Bondi NSW", type: "For Sale", status: "Active", price: "$2,100,000", date: "28 Jan 2026", dist: "REA, Domain" },
                                        { address: "7/22 Hall Street, Bondi NSW", type: "For Rent", status: "Active", price: "$850/wk", date: "3 Feb 2026", dist: "HomeBy only" },
                                        { address: "91 Curlewis Street, Bondi NSW", type: "For Sale", status: "Under offer", price: "$3,200,000", date: "15 Mar 2026", dist: "REA, Domain, View, Homely" },
                                        { address: "2/5 Consett Avenue, Bondi NSW", type: "Sold", status: "Sold", price: "$1,620,000", date: "8 Nov 2025", dist: "REA, Domain" },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-3.5 px-5 font-medium text-gray-900">{row.address}</td>
                                            <td className="py-3.5 px-5 text-gray-600">{row.type}</td>
                                            <td className="py-3.5 px-5">
                                                {row.status === "Active" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">Active</span>}
                                                {row.status === "Under offer" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Under offer</span>}
                                                {row.status === "Sold" && <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">Sold</span>}
                                            </td>
                                            <td className="py-3.5 px-5 font-medium text-gray-900">{row.price}</td>
                                            <td className="py-3.5 px-5 text-gray-500">{row.date}</td>
                                            <td className="py-3.5 px-5 text-gray-500">{row.dist}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === "Agents" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[14px] font-bold text-gray-900">Agents at this agency</h2>
                        <button className="bg-[#2B5CE6] hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[12px] font-medium transition-colors">
                            + Invite agent
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500 bg-white">
                                        <th className="font-medium py-3 px-5">Name</th>
                                        <th className="font-medium py-3 px-5">Role</th>
                                        <th className="font-medium py-3 px-5">Email</th>
                                        <th className="font-medium py-3 px-5">Phone</th>
                                        <th className="font-medium py-3 px-5">Licence</th>
                                        <th className="font-medium py-3 px-5">Last login</th>
                                        <th className="font-medium py-3 px-5">Status</th>
                                        <th className="font-medium py-3 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: "James Mitchell", role: "Owner", email: "james@raywhitebondi.com.au", phone: "+61 412 xxx xxx", licence: "LIC-NSW-28441", lastLogin: "Today 9:14am", status: "Active" },
                                        { name: "Sarah Chen", role: "Admin", email: "sarah@raywhitebondi.com.au", phone: "+61 423 xxx xxx", licence: "LIC-NSW-31205", lastLogin: "Yesterday", status: "Active" },
                                        { name: "Michael Torres", role: "Agent", email: "michael@raywhitebondi.com.au", phone: "+61 434 xxx xxx", licence: "LIC-NSW-29103", lastLogin: "2 days ago", status: "Active" },
                                        { name: "Emma Williams", role: "Agent", email: "emma@raywhitebondi.com.au", phone: "+61 445 xxx xxx", licence: "LIC-NSW-33847", lastLogin: "3 days ago", status: "Active" },
                                        { name: "David Park", role: "Agent", email: "david@raywhitebondi.com.au", phone: "+61 456 xxx xxx", licence: "LIC-NSW-30291", lastLogin: "1 week ago", status: "Active" },
                                        { name: "Lisa Johnson", role: "Agent", email: "lisa@raywhitebondi.com.au", phone: "+61 467 xxx xxx", licence: "LIC-NSW-35122", lastLogin: "2 weeks ago", status: "Inactive" },
                                        { name: "Tom Baker", role: "Assistant", email: "tom@raywhitebondi.com.au", phone: "—", licence: "—", lastLogin: "Never", status: "Pending" },
                                        { name: "Priya Sharma", role: "Agent", email: "priya@raywhitebondi.com.au", phone: "+61 489 xxx xxx", licence: "LIC-NSW-36201", lastLogin: "Today 11:32am", status: "Active" },
                                    ].map((agent, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-5 font-medium">
                                                <span className="text-[#2B5CE6] hover:underline cursor-pointer">{agent.name}</span>
                                            </td>
                                            <td className="py-3 px-5 text-gray-900">{agent.role}</td>
                                            <td className="py-3 px-5 text-gray-500">{agent.email}</td>
                                            <td className="py-3 px-5 text-gray-500">{agent.phone}</td>
                                            <td className="py-3 px-5 text-gray-500">{agent.licence}</td>
                                            <td className="py-3 px-5 text-gray-500">{agent.lastLogin}</td>
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        agent.status === "Active" && "bg-green-500",
                                                        agent.status === "Inactive" && "bg-gray-400",
                                                        agent.status === "Pending" && "bg-orange-400"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[12px]",
                                                        agent.status === "Active" && "text-green-700",
                                                        agent.status === "Inactive" && "text-gray-500",
                                                        agent.status === "Pending" && "text-orange-700"
                                                    )}>{agent.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <button className="text-[#2B5CE6] font-medium hover:underline">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute('/agencies/$id')({
    component: RouteComponent,
});
