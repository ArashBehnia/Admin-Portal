import { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Toast } from "../../components/Toast";
import {
    X,
    ArrowLeft,
    Monitor,
    Smartphone,
    Loader2,
} from "lucide-react";

// Types for Template Editor
type VersionLog = {
    version: string;
    modifiedBy: string;
    date: string;
    changes: string;
    subject: string;
    body: string;
    isActive: boolean;
};

const RouteComponent = () => {
    const { templateName } = Route.useParams();

    // Fetch Email Templates data to find category, status, etc.
    const { data: templates = [] } = useQuery<any[]>({
        queryKey: ["emailTemplatesData"],
        queryFn: async () => {
            const response = await axios.get("/data/email_templates.json");
            return response.data;
        },
    });

    const currentTemplate = useMemo(() => {
        return (
            templates.find((t) => t.name === templateName) || {
                name: templateName,
                category: "Auth",
                status: "Active",
            }
        );
    }, [templates, templateName]);

    // Nav & Active states
    const [activeTab, setActiveTab] = useState<"Email" | "SMS" | "Push">(
        "Email",
    );
    const [isActiveStatus, setIsActiveStatus] = useState(true);
    const [previewMode, setPreviewMode] = useState<"Desktop" | "Mobile">(
        "Desktop",
    );
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
    const [testEmailAddress, setTestEmailAddress] = useState(
        "james@raywhitebondi.com.au",
    );

    // Core Form Fields
    const [fromName, setFromName] = useState("HomeBy Team");
    const [fromEmail, setFromEmail] = useState("info@homeby.com.au");
    const [subject, setSubject] = useState("");
    const [country, setCountry] = useState("Australia");
    const [language, setLanguage] = useState("English");
    const [smsProvider, setSmsProvider] = useState<"Twilio" | "GAMA">("Twilio");
    const [bodyText, setBodyText] = useState("");

    // Editor Textarea Ref & Body Text state
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync status and details when templateName changes
    useEffect(() => {
        if (currentTemplate) {
            setIsActiveStatus(currentTemplate.status === "Active");
        }
    }, [currentTemplate]);

    useEffect(() => {
        if (templateName) {
            setSubject("Welcome to HomeBy — Your agency account is ready");
            setBodyText(`Hi {{contact_name}},

Welcome to HomeBy! Your agency account for {{agency_name}} has been approved and is ready to use.

Your login details:
Email: {{contact_name}}
Temporary password: {{temp_password}}

Please log in at {{login_url}} and change your password immediately.
Your temporary password will expire in {{expiry_hours}} hours.

Once logged in you can:
- Complete your agency profile
- Connect your CRM
- Start adding your listings

If you need help getting started, contact us at {{support_email}}.

Welcome aboard,
The HomeBy Team`);
        }
    }, [templateName]);

    // Save and Test Email simulation loaders
    const [isSaving, setIsSaving] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);

    // Toast States
    const [toast, setToast] = useState<{
        title: string;
        message: string;
        type: "success" | "info" | "error";
        visible: boolean;
    }>({ title: "", message: "", type: "success", visible: false });

    // Auto-hide Toast Notification tooltip after 4 seconds
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast((prev) => ({ ...prev, visible: false }));
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // Version History Log Mock Data
    const [versionHistory, setVersionHistory] = useState<VersionLog[]>([
        {
            version: "v3 (current)",
            modifiedBy: "Arash",
            date: "1 May 2026",
            changes: "Added temp password expiry notice",
            subject: "Welcome to HomeBy — Your agency account is ready",
            body: `Hi {{contact_name}},

Welcome to HomeBy! Your agency account for {{agency_name}} has been approved and is ready to use.

Your login details:
Email: {{contact_name}}
Temporary password: {{temp_password}}

Please log in at {{login_url}} and change your password immediately.
Your temporary password will expire in {{expiry_hours}} hours.

Once logged in you can:
- Complete your agency profile
- Connect your CRM
- Start adding your listings

If you need help getting started, contact us at {{support_email}}.

Welcome aboard,
The HomeBy Team`,
            isActive: true,
        },
        {
            version: "v2",
            modifiedBy: "Sarah Chen",
            date: "15 Mar 2026",
            changes: "Updated login URL",
            subject: "Welcome to HomeBy! Account Approved",
            body: `Hi {{contact_name}},

Your agency account for {{agency_name}} is now approved.

Login here: portal.homeby.com.au/login
Password: {{temp_password}}

Regards,
HomeBy Team`,
            isActive: false,
        },
        {
            version: "v1",
            modifiedBy: "Hirad",
            date: "1 Jan 2026",
            changes: "Initial template",
            subject: "HomeBy Agent Account Setup",
            body: `Hi {{contact_name}},

This is the initial setup email for your agency {{agency_name}}.
Your password is {{temp_password}}.

Thanks,
HomeBy`,
            isActive: false,
        },
    ]);

    // Available variables list to inject
    const availableVariables = [
        "{{agency_name}}",
        "{{contact_name}}",
        "{{temp_password}}",
        "{{login_url}}",
        "{{support_email}}",
        "{{expiry_hours}}",
    ];

    // Click to insert variable at caret cursor position
    const handleInsertVariable = (token: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const currentVal = textarea.value;
            const updatedVal =
                currentVal.substring(0, start) +
                token +
                currentVal.substring(end);

            setBodyText(updatedVal);

            // Re-focus and set caret after insertion
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(
                    start + token.length,
                    start + token.length,
                );
            }, 0);
        } else {
            // Fallback if textarea is not loaded/selected
            setBodyText((prev) => prev + " " + token);
        }
    };

    // Live Template Compiler substituting tokens with mock data
    const compileTemplate = (text: string) => {
        const compiled = text
            .replace(/\{\{contact_name\}\}/g, "James Mitchell")
            .replace(/\{\{agency_name\}\}/g, "Ray White Bondi")
            .replace(/\{\{temp_password\}\}/g, "Tmp#8472Kx")
            .replace(/\{\{login_url\}\}/g, "portal.homeby.com.au/login")
            .replace(/\{\{support_email\}\}/g, "support@homeby.com.au")
            .replace(/\{\{expiry_hours\}\}/g, "48");

        return compiled.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    // Restore version history item
    const handleRestoreVersion = (verItem: VersionLog) => {
        setSubject(verItem.subject);
        setBodyText(verItem.body);

        // Update current version state in log list
        const updatedHistory = versionHistory.map((v) => ({
            ...v,
            isActive: v.version === verItem.version,
        }));
        setVersionHistory(updatedHistory);

        setToast({
            title: "Version Restored",
            message: `Successfully loaded content configurations from ${verItem.version}.`,
            type: "success",
            visible: true,
        });
    };

    // Save Template changes
    const handleSaveTemplate = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setToast({
                title: "Template Saved",
                message: `${templateName} configuration has been successfully updated.`,
                type: "success",
                visible: true,
            });
        }, 1200);
    };

    // Send Test Email
    const handleSendTest = (emailAddress: string) => {
        setIsSendingTest(true);
        setTimeout(() => {
            setIsSendingTest(false);
            setIsTestEmailModalOpen(false);
            setToast({
                title: "Test Email Sent",
                message: `Test ${templateName} email dispatched to ${emailAddress}.`,
                type: "success",
                visible: true,
            });
        }, 1000);
    };

    return (
        <div className="w-full max-w-content mx-auto select-none font-sans bg-page min-h-screen relative pb-16">
            {/* Breadcrumb Header Row */}
            <div className="flex flex-col gap-1.5 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-muted font-semibold tracking-wide uppercase select-none">
                    <Link
                        to="/email-templates"
                        className="hover:text-text flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={12} strokeWidth={3} />
                        Email Templates
                    </Link>
                    <span>&gt;</span>
                    <span className="text-text font-bold">{templateName}</span>
                </div>

                {/* Main title + active status + save trigger header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
                    <h1 className="text-2xl font-bold text-text font-sans tracking-tight">
                        Edit template — {templateName}
                    </h1>

                    <div className="flex items-center gap-4 select-none self-end sm:self-auto">
                        {/* iOS-Style toggle switch */}
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
                                className={`text-xs font-bold font-sans ${
                                    isActiveStatus
                                        ? "text-success"
                                        : "text-muted"
                                }`}
                            >
                                {isActiveStatus ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* Save button */}
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

            {/* Premium Multi-Channel Tabs */}
            <div className="flex border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab("Email")}
                    className={`flex items-center px-5 py-3 text-xs font-bold tracking-wide transition-all relative cursor-pointer ${
                        activeTab === "Email"
                            ? "text-accent"
                            : "text-muted hover:text-text"
                    }`}
                >
                    Email
                    {activeTab === "Email" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("SMS")}
                    className={`flex items-center px-5 py-3 text-xs font-bold tracking-wide transition-all relative cursor-pointer ${
                        activeTab === "SMS"
                            ? "text-accent"
                            : "text-muted hover:text-text"
                    }`}
                >
                    SMS
                    {activeTab === "SMS" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("Push")}
                    className={`flex items-center px-5 py-3 text-xs font-bold tracking-wide transition-all relative cursor-pointer ${
                        activeTab === "Push"
                            ? "text-accent"
                            : "text-muted hover:text-text"
                    }`}
                >
                    Push Notification
                    {activeTab === "Push" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                    )}
                </button>
            </div>

            {/* Split Screen Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: EDITOR FORM FIELDS (7/12) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                    {/* Meta Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Template name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                Template name
                            </label>
                            <input
                                type="text"
                                value={templateName}
                                disabled
                                className="px-3 py-2 border border-border bg-page text-muted rounded text-xs font-medium focus:outline-none cursor-not-allowed select-none font-sans"
                            />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                Category
                            </label>
                            <div>
                                <span
                                    className={`inline-block px-3 py-2 border font-bold rounded text-xs font-sans ${
                                        currentTemplate.category === "Auth"
                                            ? "bg-blue-50 border-blue-100 text-blue-700"
                                            : currentTemplate.category ===
                                                "Account"
                                              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                              : currentTemplate.category ===
                                                  "Agency"
                                                ? "bg-purple-50 border-purple-100 text-purple-700"
                                                : "bg-slate-50 border-slate-200 text-slate-700"
                                    }`}
                                >
                                    {currentTemplate.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sender Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* From name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                From name
                            </label>
                            <input
                                type="text"
                                value={fromName}
                                onChange={(e) => setFromName(e.target.value)}
                                placeholder="e.g. HomeBy Team"
                                className="px-3 py-2 border border-border bg-white text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans"
                            />
                        </div>

                        {/* From email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                From email
                            </label>
                            <input
                                type="email"
                                value={fromEmail}
                                onChange={(e) => setFromEmail(e.target.value)}
                                placeholder="e.g. info@homeby.com.au"
                                className="px-3 py-2 border border-border bg-white text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans"
                            />
                        </div>
                    </div>

                    {/* Subject / Title line */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-muted tracking-wider">
                            {activeTab === "Email" ? "Subject" : "Title"}
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder={
                                activeTab === "Email"
                                    ? "Email Subject Line"
                                    : "Title text"
                            }
                            className="px-3 py-2 border border-border bg-white text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans w-full"
                        />
                    </div>

                    {/* Quick Variables Insert Palette */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-muted tracking-wider select-none">
                            Click to insert variable
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableVariables.map((token) => (
                                <button
                                    key={token}
                                    type="button"
                                    onClick={() => handleInsertVariable(token)}
                                    className="px-2.5 py-1.5 border border-border bg-white hover:bg-page/55 text-muted hover:text-text rounded text-[11px] font-bold tracking-tight font-sans transition-colors cursor-pointer shadow-sm select-none"
                                >
                                    {token}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Body Editor */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-muted tracking-wider">
                            Template body
                        </label>
                        <textarea
                            ref={textareaRef}
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            rows={14}
                            className="w-full bg-[#0F1115] text-[#ECEFF4] font-mono text-xs p-4 rounded-md border border-[#2E3440] focus:outline-none focus:ring-1 focus:ring-accent/60 leading-relaxed tracking-normal overflow-y-auto resize-y min-h-[300px]"
                            placeholder="Write transactional template body here..."
                        />
                    </div>

                    {/* Country & Language Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Country */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                Country
                            </label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="px-3 py-2 border border-border bg-white text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 transition-colors font-sans select-none"
                            >
                                <option value="Australia">Australia</option>
                                <option value="New Zealand">New Zealand</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-muted tracking-wider">
                                Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-3 py-2 border border-border bg-white text-text rounded text-xs font-medium focus:outline-none focus:border-accent/40 transition-colors font-sans select-none"
                            >
                                <option value="English">English</option>
                            </select>
                        </div>
                    </div>

                    {/* SMS Provider (Visual Selector) */}
                    <div className="flex flex-col gap-2 select-none mb-2">
                        <label className="text-[11px] font-bold text-muted tracking-wider">
                            SMS Provider
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setSmsProvider("Twilio")}
                                className={`px-4 py-2 rounded text-xs font-bold font-sans transition-colors cursor-pointer shadow-sm border ${
                                    smsProvider === "Twilio"
                                        ? "bg-text text-white border-text"
                                        : "bg-white border-border text-muted hover:text-text hover:bg-page"
                                }`}
                            >
                                Twilio
                            </button>
                            <button
                                type="button"
                                onClick={() => setSmsProvider("GAMA")}
                                className={`px-4 py-2 rounded text-xs font-bold font-sans transition-colors cursor-pointer shadow-sm border ${
                                    smsProvider === "GAMA"
                                        ? "bg-text text-white border-text"
                                        : "bg-white border-border text-muted hover:text-text hover:bg-page"
                                }`}
                            >
                                GAMA
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: LIVE REAL-TIME PREVIEW PANEL (5/12) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* Preview Panel Header Controls */}
                    <div className="flex flex-wrap justify-between items-center gap-3 select-none">
                        <h3 className="font-bold text-[14px] text-text font-sans">
                            Preview
                        </h3>

                        <div className="flex items-center gap-3">
                            {/* Viewport Toggles */}
                            <div className="bg-white border border-border rounded p-0.5 flex items-center shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode("Desktop")}
                                    className={`px-3 py-1.5 rounded-sm text-xs font-bold font-sans flex items-center gap-1 cursor-pointer transition-colors ${
                                        previewMode === "Desktop"
                                            ? "bg-text text-white"
                                            : "text-muted hover:text-text bg-transparent"
                                    }`}
                                >
                                    <Monitor size={12} />
                                    Desktop
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode("Mobile")}
                                    className={`px-3 py-1.5 rounded-sm text-xs font-bold font-sans flex items-center gap-1 cursor-pointer transition-colors ${
                                        previewMode === "Mobile"
                                            ? "bg-text text-white"
                                            : "text-muted hover:text-text bg-transparent"
                                    }`}
                                >
                                    <Smartphone size={12} />
                                    Mobile
                                </button>
                            </div>

                            {/* Send Test email */}
                            <button
                                type="button"
                                onClick={() => setIsTestEmailModalOpen(true)}
                                className="px-3 py-2 border border-border bg-white hover:bg-page hover:text-text rounded text-xs font-bold font-sans text-muted transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                                Send test email
                            </button>
                        </div>
                    </div>

                    {/* PREVIEW CONTAINER */}
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
                                        {activeTab === "Email"
                                            ? "Subject:"
                                            : "Title:"}
                                    </span>{" "}
                                    <span className="font-semibold text-text">
                                        {subject}
                                    </span>
                                </div>
                            </div>

                            {/* Compiled Body Content */}
                            <div className="pt-5 text-[13px] leading-relaxed text-slate-700 font-sans break-words whitespace-pre-wrap select-text">
                                {compileTemplate(bodyText)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* VERSION HISTORY PANEL */}
            <div className="mt-12 bg-card border border-border rounded-lg shadow-sm overflow-hidden select-none">
                {/* Panel Header */}
                <div
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="px-6 py-4 border-b border-border bg-page/10 flex justify-between items-center cursor-pointer hover:bg-page/20 transition-colors"
                >
                    <h3 className="font-bold text-sm text-text font-sans uppercase tracking-wider">
                        Version history
                    </h3>
                    <div className="text-muted/60 text-xs font-bold transition-transform duration-200">
                        {isHistoryOpen ? "▲" : "▼"}
                    </div>
                </div>

                {/* Table list */}
                {isHistoryOpen && (
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
                                                    onClick={() =>
                                                        handleRestoreVersion(
                                                            item,
                                                        )
                                                    }
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

            {/* SEND TEST EMAIL MODAL POPUP */}
            {isTestEmailModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 select-none">
                    {/* Backdrop shadow overlay */}
                    <div
                        onClick={() => setIsTestEmailModalOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    />

                    {/* High-Fidelity Dialog Box */}
                    <div className="relative bg-white border border-border rounded-xl shadow-2xl w-full max-w-[400px] p-6 overflow-hidden animate-fade-in font-sans">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-3 border-b border-border">
                            <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                                Send test email
                            </h3>
                            <button
                                onClick={() => setIsTestEmailModalOpen(false)}
                                className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body content form */}
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-muted uppercase tracking-wider">
                                    Send to email address
                                </label>
                                <input
                                    type="email"
                                    value={testEmailAddress}
                                    onChange={(e) =>
                                        setTestEmailAddress(e.target.value)
                                    }
                                    placeholder="Enter your email address"
                                    className="px-3 py-2.5 border border-border bg-white text-text rounded text-xs font-semibold focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors font-sans w-full"
                                />
                            </div>

                            <p className="text-[11px] text-muted leading-relaxed font-medium">
                                Variables will be filled with sample data.
                            </p>
                        </div>

                        {/* Footer buttons row */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsTestEmailModalOpen(false)}
                                className="px-4 py-2 border border-border hover:bg-page text-muted hover:text-text rounded text-xs font-bold transition-all cursor-pointer font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSendTest(testEmailAddress)}
                                disabled={
                                    isSendingTest || !testEmailAddress.trim()
                                }
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 font-sans min-w-[100px] justify-center"
                            >
                                {isSendingTest ? (
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Send test"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SLEEK GLASSMORPHIC TOAST TOOLTIP (BOTTOM-RIGHT) */}
            <Toast
                visible={toast.visible}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export const Route = createFileRoute("/email-templates/$templateName")({
    component: RouteComponent,
});
