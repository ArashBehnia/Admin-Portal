"use client";

import { Monitor, Smartphone } from "lucide-react";
import { ChannelTab, PreviewMode } from "@/hooks/useTemplateEditor";

interface PreviewPanelProps {
    activeTab: ChannelTab;
    previewMode: PreviewMode;
    fromName: string;
    fromEmail: string;
    subject: string;
    compiledBody: React.ReactNode;
    onPreviewModeChange: (mode: PreviewMode) => void;
    onSendTestClick: () => void;
}

const PreviewPanel = ({
    activeTab,
    previewMode,
    fromName,
    fromEmail,
    subject,
    compiledBody,
    onPreviewModeChange,
    onSendTestClick,
}: PreviewPanelProps) => {
    return (
        <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Panel Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 select-none">
                <h3 className="font-bold text-[14px] text-text font-sans">
                    Preview
                </h3>
                <div className="flex items-center gap-3">
                    {/* Viewport Toggle */}
                    <div className="bg-card border border-border rounded p-0.5 flex items-center shadow-sm">
                        {(["Desktop", "Mobile"] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => onPreviewModeChange(mode)}
                                className={`px-3 py-1.5 rounded-sm text-xs font-bold font-sans flex items-center gap-1 cursor-pointer transition-colors ${
                                    previewMode === mode
                                        ? "bg-text text-white"
                                        : "text-muted hover:text-text bg-transparent"
                                }`}
                            >
                                {mode === "Desktop" ? (
                                    <Monitor size={12} />
                                ) : (
                                    <Smartphone size={12} />
                                )}
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Send Test Email */}
                    <button
                        type="button"
                        onClick={onSendTestClick}
                        className="px-3 py-2 border border-border bg-card hover:bg-page hover:text-text rounded text-xs font-bold font-sans text-muted transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        Send test email
                    </button>
                </div>
            </div>

            {/* Preview Container */}
            <div className="w-full rounded-lg p-5 flex justify-center items-start min-h-[460px]">
                <div
                    className={`bg-white w-full rounded border border-slate-200 shadow-md p-6 flex flex-col font-sans transition-all duration-300 text-xs ${
                        previewMode === "Mobile"
                            ? "max-w-[340px]"
                            : "max-w-full"
                    }`}
                >
                    <div className="flex flex-col gap-1 text-[13px] text-muted pb-4 border-b border-slate-100 font-sans">
                        <div>
                            <span className="font-bold text-slate-800">
                                From:
                            </span>{" "}
                            {fromName} &lt;{fromEmail}&gt;
                        </div>
                        <div>
                            <span className="font-bold text-slate-800">
                                To:
                            </span>{" "}
                            james@raywhitebondi.com.au
                        </div>
                        <div className="mt-0.5">
                            <span className="font-bold text-slate-800">
                                {activeTab === "Email" ? "Subject:" : "Title:"}
                            </span>{" "}
                            <span className="font-semibold text-text">
                                {subject}
                            </span>
                        </div>
                    </div>
                    <div className="pt-5 text-[13px] leading-relaxed text-slate-700 font-sans break-words whitespace-pre-wrap select-text">
                        {compiledBody}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
