"use client";

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
        <div className="mt-12 bg-card border border-border rounded-lg shadow-sm overflow-hidden select-none">
            <div
                onClick={onToggle}
                className="px-6 py-4 border-b border-border bg-page/10 flex justify-between items-center cursor-pointer hover:bg-page/20 transition-colors"
            >
                <h3 className="font-bold text-sm text-text font-sans uppercase tracking-wider">
                    Version history
                </h3>
                <span className="text-muted/60 text-xs font-bold">
                    {isOpen ? "▲" : "▼"}
                </span>
            </div>

            {isOpen && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-border/80 bg-page/30 text-[10px] text-muted font-bold tracking-wider uppercase select-none">
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
                                            ? "bg-page/40 font-semibold"
                                            : ""
                                    }`}
                                >
                                    <td className="px-6 py-3.5 font-bold">
                                        {item.version}
                                    </td>
                                    <td className="px-6 py-3.5 text-muted font-medium">
                                        {item.modifiedBy}
                                    </td>
                                    <td className="px-6 py-3.5 text-muted">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-3.5 text-slate-700">
                                        {item.changes}
                                    </td>
                                    <td className="px-6 py-3.5 text-right font-bold font-sans">
                                        {item.isActive ? (
                                            <span className="text-muted/50 cursor-default">
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
