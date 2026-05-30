/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check } from "lucide-react";
import { StaffMember } from "./StaffPageClient";

interface RolesListProps {
    rolesList: any[];
    localStaff: StaffMember[];
    onViewPerms: (roleName: string) => void;
}

const RolesList = ({ rolesList, localStaff, onViewPerms }: RolesListProps) => {
    return (
        <div className="flex flex-col gap-6 mt-1 animate-fade-in select-none">
            <div className="flex flex-col gap-1">
                <h2 className="font-bold text-[20px] text-text font-sans tracking-tight">
                    Role definitions
                </h2>
                <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">
                    Roles control what each staff member can access. Permissions
                    are defined in code and apply to all users with that role.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {rolesList.map((role: any) => {
                    const count = localStaff.filter(
                        (s) => s.role.toLowerCase() === role.slug.toLowerCase(),
                    ).length;
                    return (
                        <div
                            key={role.id}
                            className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col gap-4 hover:border-accent/25 transition-all"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-2.5 py-0.5 border text-xs font-bold rounded font-sans shadow-sm ${role.pillClass}`}
                                    >
                                        {role.name}
                                    </span>
                                    <span className="text-[13px] text-muted font-bold font-sans">
                                        • {count}{" "}
                                        {count === 1
                                            ? "staff member"
                                            : "staff members"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onViewPerms(role.name)}
                                    className="hidden md:flex text-xs font-bold text-accent hover:text-accent/80 transition-colors items-center gap-0.5 cursor-pointer font-sans"
                                >
                                    View all permissions →
                                </button>
                            </div>

                            <p className="text-[13px] text-muted font-medium leading-relaxed font-sans max-w-4xl">
                                {role.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-1">
                                {role.features.map(
                                    (feat: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-[13px] text-text font-sans font-medium"
                                        >
                                            <Check
                                                size={14}
                                                className="text-green-600 shrink-0"
                                                strokeWidth={3}
                                            />
                                            <span>{feat}</span>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="block md:hidden mt-2 pt-3 border-t border-border/60">
                                <button
                                    onClick={() => onViewPerms(role.name)}
                                    className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-0.5 cursor-pointer font-sans"
                                >
                                    View all permissions →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-[13px] text-muted font-semibold font-sans mt-2 py-1 select-none">
                Need a new role or custom permissions? Role definitions are
                managed in the codebase. Speak to your backend engineer to add
                or modify roles.
            </p>
        </div>
    );
};

export default RolesList;
