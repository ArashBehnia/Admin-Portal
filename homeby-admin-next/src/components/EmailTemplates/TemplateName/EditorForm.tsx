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
    textareaRef: RefObject<HTMLTextAreaElement>;
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
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        Template name
                    </label>
                    <input
                        type="text"
                        value={templateName}
                        disabled
                        className="px-3 py-2 border border-border bg-page text-muted rounded text-xs font-medium focus:outline-none cursor-not-allowed font-sans"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        Category
                    </label>
                    <div>
                        <span
                            className={`inline-block px-3 py-2 border font-bold rounded text-xs font-sans ${getCategoryStyles(currentTemplate.category)}`}
                        >
                            {currentTemplate.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* From name + From email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        From name
                    </label>
                    <input
                        type="text"
                        value={fromName}
                        onChange={(e) => onFromNameChange(e.target.value)}
                        placeholder="e.g. HomeBy Team"
                        className="px-3 py-2 border border-border bg-card text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        From email
                    </label>
                    <input
                        type="email"
                        value={fromEmail}
                        onChange={(e) => onFromEmailChange(e.target.value)}
                        placeholder="e.g. info@homeby.com.au"
                        className="px-3 py-2 border border-border bg-card text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans"
                    />
                </div>
            </div>

            {/* Subject / Title */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted tracking-wider">
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
                    className="px-3 py-2 border border-border bg-card text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans w-full"
                />
            </div>

            {/* Variable Insert Palette */}
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted tracking-wider select-none">
                    Click to insert variable
                </label>
                <div className="flex flex-wrap gap-2">
                    {availableVariables.map((token) => (
                        <button
                            key={token}
                            type="button"
                            onClick={() => onInsertVariable(token)}
                            className="px-2.5 py-1.5 border border-border bg-card hover:bg-page/55 text-muted hover:text-text rounded text-[11px] font-bold tracking-tight font-sans transition-colors cursor-pointer shadow-sm select-none"
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body Editor */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted tracking-wider">
                    Template body
                </label>
                <textarea
                    ref={textareaRef}
                    value={bodyText}
                    onChange={(e) => onBodyTextChange(e.target.value)}
                    rows={14}
                    className="w-full bg-[#0F1115] text-[#ECEFF4] font-mono text-xs p-4 rounded-md border border-[#2E3440] focus:outline-none focus:ring-1 focus:ring-accent/60 leading-relaxed tracking-normal overflow-y-auto resize-y min-h-[300px]"
                    placeholder="Write transactional template body here..."
                />
            </div>

            {/* Country + Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        Country
                    </label>
                    <select
                        value={country}
                        onChange={(e) => onCountryChange(e.target.value)}
                        className="px-3 py-2 border border-border bg-card text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 transition-colors font-sans"
                    >
                        <option value="Australia">Australia</option>
                        <option value="New Zealand">New Zealand</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted tracking-wider">
                        Language
                    </label>
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="px-3 py-2 border border-border bg-card text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 transition-colors font-sans"
                    >
                        <option value="English">English</option>
                    </select>
                </div>
            </div>

            {/* SMS Provider */}
            <div className="flex flex-col gap-2 select-none mb-2">
                <label className="text-[11px] font-bold text-muted tracking-wider">
                    SMS Provider
                </label>
                <div className="flex gap-2">
                    {(["Twilio", "GAMA"] as const).map((provider) => (
                        <button
                            key={provider}
                            type="button"
                            onClick={() => onSmsProviderChange(provider)}
                            className={`px-4 py-2 rounded text-xs font-bold font-sans transition-colors cursor-pointer shadow-sm border ${
                                smsProvider === provider
                                    ? "bg-text text-white border-text"
                                    : "bg-card border-border text-muted hover:text-text hover:bg-page"
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
