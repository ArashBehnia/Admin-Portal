/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Fragment } from 'react';
import { X, Check } from 'lucide-react';

interface PermissionsModalProps {
    isOpen: boolean;
    selectedRole: string;
    localPermissions: any[];
    onClose: () => void;
}

const PermissionsModal = ({ isOpen, selectedRole, localPermissions, onClose }: PermissionsModalProps) => {
    if (!isOpen) return null;

    const isSuperadmin = selectedRole.toLowerCase() === 'superadmin';
    const isAdmin = selectedRole.toLowerCase() === 'admin';
    const isSupport = selectedRole.toLowerCase() === 'support';

    return (
        <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4 select-none animate-fade-in cursor-pointer" onClick={onClose}>
            <div className="bg-card w-full max-w-2xl rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh] cursor-default" onClick={(e) => e.stopPropagation()}>
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
                        <table className="w-full min-w-[580px] text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-card border-b border-border/80 uppercase text-[10px] tracking-wider text-muted/70">
                                    <th className="px-4 py-3 font-semibold">Permission</th>
                                    <th className={`px-4 py-3 text-center ${isSuperadmin ? 'font-bold text-text bg-page/30' : 'font-medium'}`}>Superadmin</th>
                                    <th className={`px-4 py-3 text-center ${isAdmin ? 'font-bold text-text bg-page/30' : 'font-medium'}`}>Admin</th>
                                    <th className={`px-4 py-3 text-center ${isSupport ? 'font-bold text-text bg-page/30' : 'font-medium'}`}>Support</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {localPermissions.map((category: any) => (
                                    <Fragment key={category.category}>
                                        <tr className="bg-[#F8FAFC] select-none">
                                            <td colSpan={4} className="px-4 py-2.5 uppercase tracking-wider text-slate-400/90 font-bold text-[10px]">
                                                {category.category}
                                            </td>
                                        </tr>
                                        {category.permissions.map((perm: any) => (
                                            <tr key={perm.id} className="hover:bg-page/10 transition-colors">
                                                <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">{perm.name}</td>
                                                {(['superadmin', 'admin', 'support'] as const).map((col) => (
                                                    <td key={col} className={`px-4 py-3 text-center ${selectedRole.toLowerCase() === col ? 'bg-page/10' : ''}`}>
                                                        {perm[col] === '✓' ? (
                                                            <Check size={15} className="text-green-600 inline-block" strokeWidth={3} />
                                                        ) : perm[col] === 'read' ? (
                                                            <span className="text-muted font-bold text-[12px]">read</span>
                                                        ) : (
                                                            <span className="text-muted/40 font-semibold">—</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </Fragment>
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