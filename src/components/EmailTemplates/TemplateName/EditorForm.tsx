"use client";

import { RefObject } from "react";
import { Template } from "@/actions/emailTemplatesActions";
import { ChannelTab } from "@/hooks/useTemplateEditor";

interface EditorFormProps {
    activeTab: ChannelTab;
    templateName: string;
    currentTemplate: Template;
    fromName: string;
    fromEmail: string;
    subject: string;
    country: string;
    language: string;
    smsProvider: "Twilio" | "GAMA";
    bodyText: string;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    availableVariables: string[];
    getCategoryStyles: (category: string) => string;
    onFromNameChange: (v: string) => void;
    onFromEmailChange: (v: string) => void;
    onSubjectChange: (v: string) => void;
    onCountryChange: (v: string) => void;
    onLanguageChange: (v: string) => void;
    onSmsProviderChange: (v: "Twilio" | "GAMA") => void;
    onBodyTextChange: (v: string) => void;
    onInsertVariable: (token: string) => void;
}

const INPUT_CLASS =
    "w-full h-[42px] px-3 border border-border bg-card text-text rounded-md text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-sans";

const INPUT_DISABLED_CLASS =
    "w-full h-[42px] px-3 border border-border bg-page text-muted rounded-md text-sm font-medium cursor-not-allowed font-sans";

const SELECT_CLASS =
    "w-full h-[42px] px-3 border border-border bg-card text-text rounded-md text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-sans cursor-pointer appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]";

const LABEL_CLASS = "text-[13px] text-muted font-medium font-sans";

const EditorForm = ({
    activeTab,
    templateName,
    currentTemplate,
    fromName,
    fromEmail,
    subject,
    country,
    language,
    smsProvider,
    bodyText,
    textareaRef,
    availableVariables,
    getCategoryStyles,
    onFromNameChange,
    onFromEmailChange,
    onSubjectChange,
    onCountryChange,
    onLanguageChange,
    onSmsProviderChange,
    onBodyTextChange,
    onInsertVariable,
}: EditorFormProps) => {
    return (
        <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Template name + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Template name</label>
                    <input
                        type="text"
                        value={templateName}
                        disabled
                        className={INPUT_DISABLED_CLASS}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Category</label>
                    <div className="flex items-center h-[42px]">
                        <span
                            className={`inline-flex items-center px-3 py-1 font-semibold rounded-full text-xs font-sans ${getCategoryStyles(currentTemplate.category)}`}
                        >
                            {currentTemplate.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* From name + From email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>From name</label>
                    <input
                        type="text"
                        value={fromName}
                        onChange={(e) => onFromNameChange(e.target.value)}
                        placeholder="e.g. HomeBy Team"
                        className={INPUT_CLASS}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>From email</label>
                    <input
                        type="email"
                        value={fromEmail}
                        onChange={(e) => onFromEmailChange(e.target.value)}
                        placeholder="e.g. info@homeby.com.au"
                        className={INPUT_CLASS}
                    />
                </div>
            </div>

            {/* Subject / Title */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>
                    {activeTab === "Email" ? "Subject" : "Title"}
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                    placeholder={
                        activeTab === "Email"
                            ? "Email Subject Line"
                            : "Title text"
                    }
                    className={INPUT_CLASS}
                />
            </div>

            {/* Variable Insert Palette */}
            <div className="flex flex-col gap-2">
                <label className={`${LABEL_CLASS} select-none`}>
                    Click to insert variable
                </label>
                <div className="flex flex-wrap gap-2">
                    {availableVariables.map((token) => (
                        <button
                            key={token}
                            type="button"
                            onClick={() => onInsertVariable(token)}
                            className="px-3 py-1.5 border border-border bg-card hover:bg-page text-muted hover:text-text rounded-md text-xs font-medium font-sans transition-colors cursor-pointer select-none"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body Editor */}
            <div className="flex flex-col gap-1.5">
                <label className={LABEL_CLASS}>Template body</label>
                <textarea
                    ref={textareaRef}
                    value={bodyText}
                    onChange={(e) => onBodyTextChange(e.target.value)}
                    rows={14}
                    className="w-full bg-[#0F1115] text-[#ECEFF4] font-mono text-sm p-5 rounded-lg border border-[#2E3440] focus:outline-none focus:ring-1 focus:ring-accent/60 leading-relaxed tracking-normal overflow-y-auto resize-y min-h-[320px]"
                    placeholder="Write transactional template body here..."
                />
            </div>

            {/* Country + Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Country</label>
                    <div className="relative">
                        <select
                            value={country}
                            onChange={(e) => onCountryChange(e.target.value)}
                            className={`${SELECT_CLASS} pr-10`}
                        >
                            <option value="Australia">Australia</option>
                            <option value="New Zealand">New Zealand</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Language</label>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className={`${SELECT_CLASS} pr-10`}
                        >
                            <option value="English">English</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* SMS Provider */}
            <div className="flex flex-col gap-2 select-none mb-2">
                <label className={LABEL_CLASS}>SMS provider</label>
                <div className="flex gap-2">
                    {(["Twilio", "GAMA"] as const).map((provider) => (
                        <button
                            key={provider}
                            type="button"
                            onClick={() => onSmsProviderChange(provider)}
                            className={`px-5 py-2.5 rounded-md text-sm font-semibold font-sans transition-colors cursor-pointer border ${
                                smsProvider === provider
                                    ? "bg-text text-white border-text"
                                    : "bg-card border-border text-text hover:bg-page"
                            }`}
                        >
                            {provider}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditorForm;
