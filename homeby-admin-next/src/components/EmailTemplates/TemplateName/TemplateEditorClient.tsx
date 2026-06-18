/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import useTemplateEditor from "@/hooks/useTemplateEditor";
import Toast from "@/components/Shared/Toast";
import EditorForm from "./EditorForm";
import PreviewPanel from "./PreviewPanel";
import VersionHistory from "./VersionHistory";
import TestEmailModal from "./TestEmailModal";

interface TemplateEditorClientProps {
    templateName: string;
}

const TemplateEditorClient = ({
    templateName,
}: TemplateEditorClientProps) => {
    const {
        currentTemplate,
        isLoadingTemplate,
        activeTab,
        setActiveTab,
        previewMode,
        setPreviewMode,
        isHistoryOpen,
        setIsHistoryOpen,
        isTestEmailModalOpen,
        setIsTestEmailModalOpen,
        isActiveStatus,
        setIsActiveStatus,
        fromName,
        setFromName,
        fromEmail,
        setFromEmail,
        subject,
        setSubject,
        country,
        setCountry,
        language,
        setLanguage,
        smsProvider,
        setSmsProvider,
        bodyText,
        setBodyText,
        testEmailAddress,
        setTestEmailAddress,
        textareaRef,
        versionHistory,
        isSaving,
        toast,
        setToast,
        AVAILABLE_VARIABLES,
        compileTemplate,
        getCategoryStyles,
        handleInsertVariable,
        handleRestoreVersion,
        handleSaveTemplate,
        handleSendTest,
    } = useTemplateEditor({ templateName });

    useEffect(() => {
        console.log("[TemplateEditorClient] render state:", {
            templateName,
            isLoadingTemplate,
            currentTemplate: currentTemplate ? JSON.stringify(currentTemplate, null, 2) : "null",
        });
    }, [templateName, isLoadingTemplate, currentTemplate]);

    const CHANNEL_TABS = ["Email", "SMS", "Push Notification"] as const;

    if (isLoadingTemplate) {
        return (
            <div className="w-full max-w-content mx-auto font-sans bg-page min-h-screen pb-16 px-6">
                <div className="py-6 space-y-6 animate-pulse">
                    {/* Breadcrumb skeleton */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <div className="h-3 w-3 bg-border rounded" />
                        <div className="h-3 w-20 bg-border rounded" />
                    </div>
                    {/* Header skeleton */}
                    <div className="h-7 w-64 bg-border rounded" />
                    {/* Tabs skeleton */}
                    <div className="flex gap-6 border-b border-border pb-0">
                        {["Email", "SMS", "Push notification"].map((tab) => (
                            <div key={tab} className="pb-3">
                                <div className="h-3 w-14 bg-border rounded" />
                            </div>
                        ))}
                    </div>
                    {/* Content skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-24 bg-border rounded" />
                                    <div className="h-10 w-full bg-card border border-border rounded" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-16 bg-border rounded" />
                                    <div className="h-10 w-20 bg-card border border-border rounded" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-20 bg-border rounded" />
                                    <div className="h-10 w-full bg-card border border-border rounded" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-20 bg-border rounded" />
                                    <div className="h-10 w-full bg-card border border-border rounded" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="h-3 w-16 bg-border rounded" />
                                <div className="h-10 w-full bg-card border border-border rounded" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-32 bg-border rounded" />
                                <div className="flex gap-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-8 w-28 bg-card border border-border rounded" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="h-3 w-28 bg-border rounded" />
                                <div className="h-[320px] w-full bg-[#0F1115] rounded-md border border-[#2E3440]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-16 bg-border rounded" />
                                    <div className="h-10 w-full bg-card border border-border rounded" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-16 bg-border rounded" />
                                    <div className="h-10 w-full bg-card border border-border rounded" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-24 bg-border rounded" />
                                <div className="flex gap-2">
                                    <div className="h-10 w-16 bg-card border border-border rounded" />
                                    <div className="h-10 w-14 bg-card border border-border rounded" />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-16 bg-border rounded" />
                                <div className="flex gap-3 items-center">
                                    <div className="h-9 w-20 bg-card border border-border rounded" />
                                    <div className="h-9 w-28 bg-card border border-border rounded" />
                                </div>
                            </div>
                            <div className="bg-white rounded border border-slate-200 shadow-md p-6 min-h-[460px]">
                                <div className="flex flex-col gap-2 pb-4 border-b border-slate-100">
                                    <div className="h-3 w-64 bg-slate-100 rounded" />
                                    <div className="h-3 w-56 bg-slate-100 rounded" />
                                    <div className="h-3 w-72 bg-slate-100 rounded" />
                                </div>
                                <div className="pt-5 flex flex-col gap-3">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${80 - i * 5}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentTemplate) {
        return (
            <div className="w-full max-w-content mx-auto font-sans bg-page min-h-screen pb-16 px-6">
                <div className="py-6 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Link
                            href="/email-templates"
                            className="hover:text-text flex items-center gap-1 transition-colors"
                        >
                            <ArrowLeft size={12} strokeWidth={3} />
                            Email Templates
                        </Link>
                        <span>&gt;</span>
                        <span className="text-text font-bold">{templateName}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text">
                        Edit template — {templateName}
                    </h1>
                </div>
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-danger font-medium">
                        Template &quot;{templateName}&quot; not found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-content mx-auto font-sans bg-page min-h-screen pb-16 px-6">
            {/* Breadcrumb */}
            <div className="pt-6 pb-1">
                <div className="flex items-center gap-1.5 text-xs text-muted font-semibold">
                    <Link
                        href="/email-templates"
                        className="hover:text-text flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={12} strokeWidth={3} />
                        Email Templates
                    </Link>
                    <span>&gt;</span>
                    <span className="text-text font-bold">{templateName}</span>
                </div>
            </div>

            {/* Header */}
            <div className="pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-text">
                    Edit template — {templateName}
                </h1>

                <div className="flex items-center gap-4 select-none self-end sm:self-auto">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted font-semibold">
                            Status
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsActiveStatus(!isActiveStatus)}
                            disabled={isSaving}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center disabled:opacity-50 ${
                                isActiveStatus ? "bg-success" : "bg-border"
                            }`}
                        >
                            <span
                                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                                    isActiveStatus
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                        <span
                            className={`text-xs font-semibold ${
                                isActiveStatus ? "text-success" : "text-muted"
                            }`}
                        >
                            {isActiveStatus ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-md text-sm font-semibold transition-all shadow-sm cursor-pointer"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* Channel Tabs */}
            <div className="flex border-b border-border mb-8">
                {CHANNEL_TABS.map((tab) => {
                    const tabKey = tab === "Push Notification" ? "Push" : tab;
                    const isActive = activeTab === tabKey;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey as any)}
                            className={`px-5 py-3 text-sm font-medium transition-all relative cursor-pointer ${
                                isActive
                                    ? "text-accent font-semibold"
                                    : "text-muted hover:text-text"
                            }`}
                        >
                            {tab}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Split Editor + Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-card border border-border rounded-lg p-6 shadow-sm">
                    <EditorForm
                        activeTab={activeTab}
                        templateName={templateName}
                        currentTemplate={currentTemplate}
                        fromName={fromName}
                        fromEmail={fromEmail}
                        subject={subject}
                        country={country}
                        language={language}
                        smsProvider={smsProvider}
                        bodyText={bodyText}
                        textareaRef={textareaRef}
                        availableVariables={AVAILABLE_VARIABLES}
                        getCategoryStyles={getCategoryStyles}
                        onFromNameChange={setFromName}
                        onFromEmailChange={setFromEmail}
                        onSubjectChange={setSubject}
                        onCountryChange={setCountry}
                        onLanguageChange={setLanguage}
                        onSmsProviderChange={setSmsProvider}
                        onBodyTextChange={setBodyText}
                        onInsertVariable={handleInsertVariable}
                    />
                </div>

                <div className="lg:col-span-5 bg-card border border-border rounded-lg p-6 shadow-sm">
                    <PreviewPanel
                        activeTab={activeTab}
                        previewMode={previewMode}
                        fromName={fromName}
                        fromEmail={fromEmail}
                        subject={subject}
                        compiledBody={compileTemplate(bodyText)}
                        onPreviewModeChange={setPreviewMode}
                        onSendTestClick={() => setIsTestEmailModalOpen(true)}
                    />
                </div>
            </div>

            <VersionHistory
                isOpen={isHistoryOpen}
                versionHistory={versionHistory}
                onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                onRestore={handleRestoreVersion}
            />

            <TestEmailModal
                isOpen={isTestEmailModalOpen}
                testEmailAddress={testEmailAddress}
                isSendingTest={false}
                onClose={() => setIsTestEmailModalOpen(false)}
                onEmailChange={setTestEmailAddress}
                onSend={handleSendTest}
            />

            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() =>
                    setToast((prev) => ({ ...prev, visible: false }))
                }
            />
        </div>
    );
};

export default TemplateEditorClient;
