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
    disabled?: boolean;
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
    disabled = false,
}: PreviewPanelProps) => {
    return (
        <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Panel Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 select-none">
                <h3 className="font-bold text-base text-text font-sans">
                    Preview
                </h3>
                <div className="flex items-center gap-3">
                    {/* Viewport Toggle */}
                    <div className="bg-card border border-border rounded-md p-0.5 flex items-center shadow-sm">
                        {(["Desktop", "Mobile"] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => onPreviewModeChange(mode)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer transition-colors ${
                                    previewMode === mode
                                        ? "bg-text text-white"
                                        : "text-muted hover:text-text bg-transparent"
                                }`}
                            >
                                {mode === "Desktop" ? (
                                    <Monitor size={13} />
                                ) : (
                                    <Smartphone size={13} />
                                )}
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Send Test Email */}
                    <button
                        type="button"
                        onClick={onSendTestClick}
                        disabled={disabled}
                        className="px-4 py-2 border border-border bg-card hover:bg-page hover:text-text rounded-md text-xs font-semibold font-sans text-muted transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-muted"
                    >
                        Send test email
                    </button>
                </div>
            </div>

            {/* Preview Container */}
            <div className="w-full rounded-lg flex justify-center items-start">
                <div
                    className={`bg-white w-full rounded-lg border border-slate-200 shadow-md p-6 flex flex-col font-sans transition-all duration-300 text-sm ${
                        previewMode === "Mobile"
                            ? "max-w-[340px]"
                            : "max-w-full"
                    }`}
                >
                    {/* Email header */}
                    <div className="flex flex-col gap-1.5 text-sm text-slate-500 pb-4 border-b border-slate-100 font-sans">
                        <div>
                            <span className="font-semibold text-slate-700">
                                From:{" "}
                            </span>
                            {fromEmail}
                        </div>
                        <div className="mt-0.5">
                            <span className="font-semibold text-slate-700">
                                {activeTab === "Email" ? "Subject: " : "Title: "}
                            </span>
                            <span className="font-semibold text-text">
                                {subject}
                            </span>
                        </div>
                    </div>

                    {/* Email body */}
                    <div className="pt-5 text-sm leading-relaxed text-slate-600 font-sans break-words whitespace-pre-wrap select-text">
                        {compiledBody}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
