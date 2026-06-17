/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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
        isSendingTest,
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
            isSaving,
        });
    }, [templateName, isLoadingTemplate, currentTemplate, isSaving]);

    const CHANNEL_TABS = ["Email", "SMS", "Push Notification"] as const;

    if (isLoadingTemplate) {
        return (
            <div className="w-full max-w-content mx-auto select-none font-sans bg-page min-h-screen relative pb-16">
                <div className="flex flex-col gap-1.5 mb-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted font-semibold tracking-wide uppercase">
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
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={24} className="animate-spin text-muted" />
                </div>
            </div>
        );
    }

    if (!currentTemplate) {
        return (
            <div className="w-full max-w-content mx-auto select-none font-sans bg-page min-h-screen relative pb-16">
                <div className="flex flex-col gap-1.5 mb-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted font-semibold tracking-wide uppercase">
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
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <p className="text-danger font-medium">
                        Template &quot;{templateName}&quot; not found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-content mx-auto select-none font-sans bg-page min-h-screen relative pb-16">
            {/* Breadcrumb + Header */}
            <div className="flex flex-col gap-1.5 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-muted font-semibold tracking-wide uppercase select-none">
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

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
                    <h1 className="text-2xl font-bold text-text font-sans tracking-tight">
                        Edit template — {templateName}
                    </h1>

                    <div className="flex items-center gap-4 select-none self-end sm:self-auto">
                        {/* Status Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted font-bold tracking-wide uppercase">
                                Status
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsActiveStatus(!isActiveStatus)
                                }
                                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
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
                                className={`text-xs font-bold font-sans ${isActiveStatus ? "text-success" : "text-muted"}`}
                            >
                                {isActiveStatus ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={handleSaveTemplate}
                            disabled={isSaving}
                            className="px-5 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 font-sans min-w-[70px] justify-center"
                        >
                            {isSaving ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Channel Tabs */}
            <div className="flex border-b border-border mb-6">
                {CHANNEL_TABS.map((tab) => {
                    const tabKey = tab === "Push Notification" ? "Push" : tab;
                    const isActive = activeTab === tabKey;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey as any)}
                            className={`flex items-center px-5 py-3 text-xs font-bold tracking-wide transition-all relative cursor-pointer ${
                                isActive
                                    ? "text-accent"
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

            <VersionHistory
                isOpen={isHistoryOpen}
                versionHistory={versionHistory}
                onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                onRestore={handleRestoreVersion}
            />

            <TestEmailModal
                isOpen={isTestEmailModalOpen}
                testEmailAddress={testEmailAddress}
                isSendingTest={isSendingTest}
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
