import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const topSuburbs = [
    { suburb: "Bondi", state: "NSW", users: "4,820", searches: "12,400" },
    { suburb: "Surry Hills", state: "NSW", users: "3,914", searches: "9,800" },
    { suburb: "Carlton", state: "VIC", users: "3,602", searches: "8,900" },
    { suburb: "South Yarra", state: "VIC", users: "3,380", searches: "8,100" },
    { suburb: "New Farm", state: "QLD", users: "2,987", searches: "7,200" },
    { suburb: "Cottesloe", state: "WA", users: "2,104", searches: "5,100" },
    { suburb: "Fitzroy", state: "VIC", users: "1,893", searches: "4,800" },
    { suburb: "Neutral Bay", state: "NSW", users: "1,654", searches: "4,200" },
];

const signupsTrend = [
    180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 
    270, 270, 270, 270, 270, 270, 270, 270, 270, 
    320, 320, 320, 320, 320, 320, 320, 
    400, 400, 400, 400
];

const RouteComponent = () => {
    const [activeTab, setActiveTab] = useState<"Overview" | "Lookup">("Overview");

    return (
        <div className="flex flex-col gap-6 w-full max-w-content mx-auto pb-10">
            {/* Header & Tabs */}
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Users</h1>
                    <p className="text-[13px] text-gray-500">Platform user overview and individual account lookup.</p>
                </div>
                
                <div className="flex gap-6 border-b border-gray-200">
                    {["Overview", "Lookup"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "py-3 text-[13px] font-bold border-b-2 transition-colors",
                                activeTab === tab ? "border-[#2B5CE6] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "Overview" && (
                <div className="flex flex-col gap-5">
                    {/* Top Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-3">
                            <span className="text-[13px] text-gray-500 font-medium">Total registered users</span>
                            <span className="text-[28px] font-bold text-gray-900 leading-none">847,392</span>
                            <span className="text-[12px] font-bold text-green-600">+2,847 this week</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-3">
                            <span className="text-[13px] text-gray-500 font-medium">Active users (30d)</span>
                            <span className="text-[28px] font-bold text-gray-900 leading-none">312,845</span>
                            <span className="text-[12px] font-bold text-green-600">+5.1% MoM</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-3">
                            <span className="text-[13px] text-gray-500 font-medium">New signups this week</span>
                            <span className="text-[28px] font-bold text-gray-900 leading-none">2,847</span>
                            <span className="text-[12px] font-bold text-green-600">+12% vs last week</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-3 relative">
                            <span className="text-[13px] text-gray-500 font-medium">Unverified accounts</span>
                            <span className="text-[28px] font-bold text-gray-900 leading-none">1,243</span>
                            <span className="text-[12px] font-bold text-orange-500">email not confirmed</span>
                            <div className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-orange-400" />
                        </div>
                    </div>

                    {/* User Intent Distribution */}
                    <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-bold text-gray-900">User intent distribution</h3>
                            <p className="text-[13px] text-gray-500">How users classify themselves based on behaviour</p>
                        </div>
                        
                        <div className="flex h-3 w-full rounded-full overflow-hidden">
                            <div className="h-full bg-[#2B5CE6]" style={{ width: '52%' }} />
                            <div className="h-full bg-[#7B9AF3]" style={{ width: '24%' }} />
                            <div className="h-full bg-[#22C55E]" style={{ width: '11%' }} />
                            <div className="h-full bg-[#8B5CF6]" style={{ width: '8%' }} />
                            <div className="h-full bg-[#9CA3AF]" style={{ width: '5%' }} />
                        </div>

                        <div className="flex justify-between items-start pt-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-[#2B5CE6]" />
                                    <span className="text-[13px] font-bold text-gray-900">Buyers <span className="font-normal text-gray-500">52%</span></span>
                                </div>
                                <span className="text-[12px] text-gray-500 pl-4">440,444</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-[#7B9AF3]" />
                                    <span className="text-[13px] font-bold text-gray-900">Renters <span className="font-normal text-gray-500">24%</span></span>
                                </div>
                                <span className="text-[12px] text-gray-500 pl-4">203,374</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-[#22C55E]" />
                                    <span className="text-[13px] font-bold text-gray-900">Sellers <span className="font-normal text-gray-500">11%</span></span>
                                </div>
                                <span className="text-[12px] text-gray-500 pl-4">93,213</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-[#8B5CF6]" />
                                    <span className="text-[13px] font-bold text-gray-900">Investors <span className="font-normal text-gray-500">8%</span></span>
                                </div>
                                <span className="text-[12px] text-gray-500 pl-4">67,791</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded bg-[#9CA3AF]" />
                                    <span className="text-[13px] font-bold text-gray-900">Browsers <span className="font-normal text-gray-500">5%</span></span>
                                </div>
                                <span className="text-[12px] text-gray-500 pl-4">42,370</span>
                            </div>
                        </div>

                        <p className="text-[12px] text-gray-500 pt-2">Classifications are computed from user behaviour, not just signup data. Updated daily.</p>
                    </div>

                    {/* Two Column Layout for Trend and Suburbs */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
                        {/* Signups trend */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col">
                            <div className="flex flex-col gap-1 mb-8">
                                <h3 className="text-[14px] font-bold text-gray-900">Signups trend (30d)</h3>
                                <p className="text-[13px] text-gray-500">Daily new signups</p>
                            </div>
                            
                            <div className="flex-1 flex min-h-[220px]">
                                {/* Y Axis */}
                                <div className="flex flex-col justify-between text-[11px] text-gray-400 pr-4 pb-6">
                                    <span>500</span>
                                    <span>300</span>
                                    <span>150</span>
                                    <span>0</span>
                                </div>
                                {/* Bars Area */}
                                <div className="flex-1 border-b border-gray-100 flex items-end justify-between gap-1 pb-1 relative">
                                    {/* Horizontal grid lines */}
                                    <div className="absolute top-0 w-full border-t border-gray-100/50 border-dashed" />
                                    <div className="absolute top-1/2 w-full border-t border-gray-100/50 border-dashed" />
                                    
                                    {signupsTrend.map((val, i) => (
                                        <div 
                                            key={i} 
                                            className="w-full bg-[#2B5CE6] rounded-t-[2px] z-10" 
                                            style={{ height: `${(val / 500) * 100}%` }} 
                                        />
                                    ))}
                                    
                                    {/* X Axis labels positioned absolute below the border */}
                                    <div className="absolute -bottom-6 left-0 w-full flex justify-between px-2 text-[11px] text-gray-400">
                                        <span>1</span>
                                        <span>6</span>
                                        <span>11</span>
                                        <span>16</span>
                                        <span>21</span>
                                        <span>26</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top suburbs */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col">
                            <div className="flex flex-col gap-1 mb-6">
                                <h3 className="text-[14px] font-bold text-gray-900">Top suburbs by demand</h3>
                                <p className="text-[13px] text-gray-500">Most active locations this week</p>
                            </div>

                            <table className="w-full text-left text-[13px] table-auto border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-3 font-medium text-gray-500 font-normal">Suburb</th>
                                        <th className="py-3 font-medium text-gray-500 font-normal">State</th>
                                        <th className="py-3 font-medium text-gray-500 font-normal text-right">Active users</th>
                                        <th className="py-3 font-medium text-gray-500 font-normal text-right">Searches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSuburbs.map((sub, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 font-bold text-gray-900">{sub.suburb}</td>
                                            <td className="py-3.5 text-gray-500">{sub.state}</td>
                                            <td className="py-3.5 text-gray-700 text-right">{sub.users}</td>
                                            <td className="py-3.5 text-gray-700 text-right">{sub.searches}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Signup sources */}
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-bold text-gray-900">Signup sources (last 30d)</h3>
                            <p className="text-[13px] text-gray-500">Where new users come from</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-1">
                                <span className="text-[13px] text-gray-500 font-medium">Organic search</span>
                                <span className="text-[24px] font-bold text-gray-900">68%</span>
                                <span className="text-[12px] text-gray-500 mt-1">58,102 users</span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-1">
                                <span className="text-[13px] text-gray-500 font-medium">Direct</span>
                                <span className="text-[24px] font-bold text-gray-900">18%</span>
                                <span className="text-[12px] text-gray-500 mt-1">15,379 users</span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-1">
                                <span className="text-[13px] text-gray-500 font-medium">Referral</span>
                                <span className="text-[24px] font-bold text-gray-900">9%</span>
                                <span className="text-[12px] text-gray-500 mt-1">7,694 users</span>
                            </div>
                            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 flex flex-col gap-1">
                                <span className="text-[13px] text-gray-500 font-medium">Paid</span>
                                <span className="text-[24px] font-bold text-gray-900">5%</span>
                                <span className="text-[12px] text-gray-500 mt-1">4,274 users</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Lookup" && (
                <div className="flex flex-col gap-4">
                    {/* Warning Banner */}
                    <div className="bg-orange-50/50 border border-orange-200 text-orange-800 px-4 py-3 rounded flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        <span className="text-[13px] font-medium">User lookups are recorded in the audit log. Access personal data only when operationally necessary.</span>
                    </div>

                    {/* Search Input */}
                    <div className="flex flex-col gap-1.5">
                        <div className="relative w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input 
                                type="text" 
                                placeholder="Search by email, phone number or user ID..." 
                                className="w-full pl-11 pr-4 py-3 text-[14px] bg-white border border-[#2B5CE6] rounded shadow-sm focus:outline-none ring-1 ring-[#2B5CE6]"
                            />
                        </div>
                        <p className="text-[12px] text-gray-500 pl-1">Individual user lookup for support and compliance purposes only. All lookups are logged in the audit trail.</p>
                    </div>

                    {/* Empty State */}
                    <div className="bg-white border border-gray-200 rounded shadow-sm p-16 mt-2 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                        </div>
                        <h2 className="text-[16px] font-bold text-gray-900 mb-1">Look up a user</h2>
                        <p className="text-[13px] text-gray-500 max-w-sm leading-relaxed">
                            Enter an email address, phone number or user ID to find a specific user account.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute("/users")({
    component: RouteComponent,
});
