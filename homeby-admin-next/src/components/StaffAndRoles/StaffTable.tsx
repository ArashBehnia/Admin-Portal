"use client";

import { Search, Plus, Loader2, MoreHorizontal } from "lucide-react";
import { StaffMember } from "@/actions/staffAndRolesActions";

const ROLES_INFO: Record<string, { badgeStyle: string }> = {
    Superadmin: {
        badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
    },
    Admin: { badgeStyle: "bg-blue-50 text-blue-700 border-blue-200" },
    Support: { badgeStyle: "bg-teal-50 text-teal-700 border-teal-200" },
    Reviewer: { badgeStyle: "bg-amber-50 text-amber-700 border-amber-200" },
    "Content editor": {
        badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
    },
};

interface StaffTableProps {
    filteredStaff: StaffMember[];
    isLoading: boolean;
    isError: boolean;
    searchQuery: string;
    roleFilter: string;
    onSearchChange: (val: string) => void;
    onRoleFilterChange: (val: string) => void;
    onAddClick: () => void;
    onEditClick: (member: StaffMember) => void;
}

const StaffTable = ({
    filteredStaff,
    isLoading,
    isError,
    searchQuery,
    roleFilter,
    onSearchChange,
    onRoleFilterChange,
    onAddClick,
    onEditClick,
}: StaffTableProps) => {
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mt-1">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search staff name or email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {[
                            "All",
                            "Superadmin",
                            "Admin",
                            "Support",
                            "Reviewer",
                            "Content editor",
                        ].map((pill) => (
                            <button
                                key={pill}
                                onClick={() => onRoleFilterChange(pill)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                                    roleFilter === pill
                                        ? "bg-text text-card border-text"
                                        : "bg-card text-muted hover:text-text border-border hover:bg-page"
                                }`}
                            >
                                {pill}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={onAddClick}
                        className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs py-2 px-4 rounded transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                        Add staff
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="h-8 w-8 text-accent animate-spin" />
                        <span className="text-sm text-muted">
                            Retrieving administrative database...
                        </span>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border border-red-200 text-danger rounded-lg p-6 text-sm text-center m-6">
                        Failed to fetch staff database. Please reload or check
                        logs.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4">Staff Member</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">MFA</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-4 hidden xl:table-cell">
                                        Added
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((member) => {
                                        const roleMeta = ROLES_INFO[
                                            member.role
                                        ] ?? {
                                            badgeStyle:
                                                "bg-slate-100 text-slate-700 border-slate-200",
                                        };
                                        return (
                                            <tr
                                                key={member.id}
                                                className="hover:bg-page/35 transition-colors text-sm text-text"
                                            >
                                                <td className="px-6 py-4 font-sans">
                                                    <div className="font-bold text-text text-[14px]">
                                                        {member.name}
                                                    </div>
                                                    <div className="text-[12px] text-muted mt-0.5 font-medium">
                                                        {member.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${roleMeta.badgeStyle}`}
                                                    >
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                                            member.status ===
                                                            "Active"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-red-50 text-red-700 border-red-200"
                                                        }`}
                                                    >
                                                        {member.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                                            member.mfa ===
                                                            "Enabled"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-orange-50 text-orange-600 border-orange-200"
                                                        }`}
                                                    >
                                                        {member.mfa}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell text-muted font-medium">
                                                    {member.lastLogin}
                                                </td>
                                                <td className="px-6 py-4 hidden xl:table-cell text-muted font-medium">
                                                    {member.added}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-3">
                                                        <button
                                                            onClick={() =>
                                                                onEditClick(
                                                                    member,
                                                                )
                                                            }
                                                            className="text-accent hover:underline text-xs font-bold cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="p-1 text-muted select-none">
                                                            <MoreHorizontal
                                                                size={16}
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-16 text-center text-sm text-muted"
                                        >
                                            No internal staff members match your
                                            criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTable;
