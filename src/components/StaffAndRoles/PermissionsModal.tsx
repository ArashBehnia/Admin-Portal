'use client';

import { X, Check } from 'lucide-react';
import { PERMISSION_MATRIX, buildPermissionCategories } from '@/types/permissionTypes';

interface PermissionsModalProps {
    isOpen: boolean;
    selectedRole: string;
    rolesList: { slug: string; name: string }[];
    onClose: () => void;
}

const PermissionsModal = ({ isOpen, selectedRole, rolesList, onClose }: PermissionsModalProps) => {
    if (!isOpen) return null;

    const roleSlugs = rolesList.map((r) => r.slug);
    const categories = buildPermissionCategories(PERMISSION_MATRIX, roleSlugs);

    return (
        <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4 select-none animate-fade-in cursor-pointer" onClick={onClose}>
            <div className="bg-card w-full max-w-4xl rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh] cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-5 flex justify-between items-start bg-card">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="font-bold text-[18px] text-text font-sans tracking-tight">Permissions — {selectedRole}</h3>
                        <p className="text-[13px] text-muted font-medium font-sans">Defined by role. Cannot be customised per user.</p>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[520px] px-6 pb-6 pt-2">
                    <div className="border border-border/80 rounded overflow-hidden shadow-sm overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-card border-b border-border/80 uppercase text-[10px] tracking-wider text-muted/70">
                                    <th className="px-4 py-3 font-semibold sticky left-0 bg-card z-10">Permission</th>
                                    {rolesList.map((role) => (
                                        <th
                                            key={role.slug}
                                            className={`px-4 py-3 text-center whitespace-nowrap ${selectedRole.toLowerCase() === role.slug ? 'font-bold text-text bg-page/30' : 'font-medium'}`}
                                        >
                                            {role.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {categories.map((perm) => (
                                    <tr key={perm.id} className="hover:bg-page/10 transition-colors">
                                        <td className="px-4 py-3 text-slate-700 font-medium text-[13px] sticky left-0 bg-card z-10">{perm.name}</td>
                                        {rolesList.map((role) => {
                                            const val = perm.roles?.[role.slug] ?? '✗';
                                            return (
                                                <td
                                                    key={role.slug}
                                                    className={`px-4 py-3 text-center ${selectedRole.toLowerCase() === role.slug ? 'bg-page/10' : ''}`}
                                                >
                                                    {val === '✓' ? (
                                                        <Check size={15} className="text-green-600 inline-block" strokeWidth={3} />
                                                    ) : (
                                                        <X size={15} className="text-red-400 inline-block" strokeWidth={2.5} />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionsModal;
