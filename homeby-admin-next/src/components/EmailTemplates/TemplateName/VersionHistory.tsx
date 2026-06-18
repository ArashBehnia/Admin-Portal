"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { VersionLog } from "@/hooks/useTemplateEditor";

interface VersionHistoryProps {
    isOpen: boolean;
    versionHistory: VersionLog[];
    onToggle: () => void;
    onRestore: (item: VersionLog) => void;
}

const VersionHistory = ({
    isOpen,
    versionHistory,
    onToggle,
    onRestore,
}: VersionHistoryProps) => {
    return (
        <div className="mt-8 bg-card border border-border rounded-lg shadow-sm overflow-hidden select-none">
            <div
                onClick={onToggle}
                className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-page/30 transition-colors"
            >
                <h3 className="font-bold text-sm text-text font-sans">
                    Version history
                </h3>
                {isOpen ? (
                    <ChevronUp size={18} className="text-muted" />
                ) : (
                    <ChevronDown size={18} className="text-muted" />
                )}
            </div>

            {isOpen && (
                <div className="overflow-x-auto border-t border-border">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border bg-page/30 text-[11px] text-muted font-bold tracking-wider uppercase select-none">
                                <th className="px-6 py-3">Version</th>
                                <th className="px-6 py-3">Modified by</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Changes</th>
                                <th className="px-6 py-3 text-right">
                                    Restore
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {versionHistory.map((item) => (
                                <tr
                                    key={item.version}
                                    className={`hover:bg-page/20 transition-colors text-text ${
                                        item.isActive
                                            ? "bg-page/30"
                                            : ""
                                    }`}
                                >
                                    <td className="px-6 py-3.5 font-semibold">
                                        {item.version}
                                    </td>
                                    <td className="px-6 py-3.5 text-muted">
                                        {item.modifiedBy}
                                    </td>
                                    <td className="px-6 py-3.5 text-muted">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-3.5 text-slate-600">
                                        {item.changes}
                                    </td>
                                    <td className="px-6 py-3.5 text-right font-semibold font-sans">
                                        {item.isActive ? (
                                            <span className="text-muted/60 cursor-default">
                                                Current
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => onRestore(item)}
                                                className="text-accent hover:text-accent/80 hover:underline cursor-pointer"
                                            >
                                                Restore
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VersionHistory;
