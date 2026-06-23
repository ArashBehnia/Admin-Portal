"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddIntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SYNC_OPTIONS = ["Every 15 min", "1 hour", "4 hours", "Daily"] as const;

const AddIntegrationModal = ({ isOpen, onClose }: AddIntegrationModalProps) => {
    const [selectedSync, setSelectedSync] = useState("Every 15 min");
    const [skipTest, setSkipTest] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-card rounded-t-xl sm:rounded shadow-xl w-full sm:w-[480px] max-h-[92vh] sm:max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
                    <h2 className="text-[15px] font-semibold text-text">
                        Add new integration
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-text cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-3.5 overflow-y-auto">
                    {[
                        {
                            label: "Agency",
                            placeholder: "Select or enter agency name",
                        },
                        {
                            label: "Feed URL or API endpoint",
                            placeholder:
                                "https://feeds.example.com.au/agency/reaxml.xml",
                        },
                    ].map(({ label, placeholder }) => (
                        <div key={label} className="space-y-1">
                            <label className="block text-[12px] font-semibold text-muted">
                                {label}
                            </label>
                            <input
                                type="text"
                                placeholder={placeholder}
                                className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent bg-card text-text"
                            />
                        </div>
                    ))}

                    {[
                        {
                            label: "CRM provider",
                            opts: ["Box+Dice", "VaultRE", "AgentBox"],
                        },
                        { label: "Connection type", opts: ["REAXML", "API"] },
                    ].map(({ label, opts }) => (
                        <div key={label} className="space-y-1">
                            <label className="block text-[12px] font-semibold text-muted">
                                {label}
                            </label>
                            <select className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-accent bg-card text-text">
                                {opts.map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    <div className="space-y-1">
                        <label className="block text-[12px] font-semibold text-muted">
                            Sync frequency
                        </label>
                        <div className="flex flex-wrap gap-1">
                            {SYNC_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setSelectedSync(opt)}
                                    className={`px-3 py-1.5 text-[12px] font-medium rounded border transition-colors cursor-pointer ${
                                        selectedSync === opt
                                            ? "bg-text text-card border-text"
                                            : "bg-card border-border text-muted hover:bg-page"
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button className="px-3 py-1.5 border border-border text-muted bg-page rounded text-[12px] font-medium cursor-not-allowed">
                            Test connection
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="skip"
                            type="checkbox"
                            checked={skipTest}
                            onChange={(e) => setSkipTest(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-border text-accent cursor-pointer"
                        />
                        <label
                            htmlFor="skip"
                            className="text-[12px] text-muted cursor-pointer"
                        >
                            Skip test and save anyway
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-border shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-medium text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddIntegrationModal;
