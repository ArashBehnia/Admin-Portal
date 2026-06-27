"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Toast from "@/components/Shared/Toast";
import EditorForm from "./TemplateName/EditorForm";
import PreviewPanel from "./TemplateName/PreviewPanel";
import type { ChannelTab, PreviewMode, ToastState } from "@/hooks/useTemplateEditor";

const AVAILABLE_VARIABLES = [
    "{{agency_name}}",
    "{{contact_name}}",
    "{{temp_password}}",
    "{{login_url}}",
    "{{support_email}}",
    "{{expiry_hours}}",
];

const DEFAULT_BODY = `Hi {{contact_name}},

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
The HomeBy Team`;

const CreateTemplateClient = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [from, setFrom] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState(DEFAULT_BODY);
    const [country, setCountry] = useState("AU");
    const [lang, setLang] = useState("en");
    const [provider, setProvider] = useState<"twilio" | "gama">("twilio");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [activeTab, setActiveTab] = useState<ChannelTab>("Email");
    const [previewMode, setPreviewMode] = useState<PreviewMode>("Desktop");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    const showToast = (
        title: string,
        message: string,
        type: ToastState["type"] = "success",
    ) => {
        setToast({ title, message, type, visible: true });
    };

    const compileTemplate = useCallback((text: string) => {
        return text
            .replace(/\{\{contact_name\}\}/g, "James Mitchell")
            .replace(/\{\{agency_name\}\}/g, "Ray White Bondi")
            .replace(/\{\{temp_password\}\}/g, "Tmp#8472Kx")
            .replace(/\{\{login_url\}\}/g, "portal.homeby.com.au/login")
            .replace(/\{\{support_email\}\}/g, "support@homeby.com.au")
            .replace(/\{\{expiry_hours\}\}/g, "48")
            .split("\n")
            .map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ));
    }, []);

    const handleInsertVariable = (token: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const updated = content.substring(0, start) + token + content.substring(end);
            setContent(updated);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + token.length, start + token.length);
            }, 0);
        } else {
            setContent((prev) => prev + " " + token);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            showToast("Validation Error", "Template name is required.", "error");
            return;
        }
        if (!subject.trim()) {
            showToast("Validation Error", "Subject is required.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                type: activeTab === "Push" ? "push" : activeTab.toLowerCase(),
                name: name.trim(),
                provider,
                country,
                from: from.trim(),
                subject: subject.trim(),
                content,
                lang,
            };

            const res = await fetch("/api/email-templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error || `Creation failed: ${res.status}`);
            }

            showToast(
                "Template Created",
                `"${name}" has been successfully created.`,
            );

            await queryClient.invalidateQueries({ queryKey: ["email-templates"] });

            setTimeout(() => {
                router.push(`/email-templates/${name}`);
            }, 1500);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "An unexpected error occurred";
            showToast("Creation Failed", message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const CHANNEL_TABS = ["Email", "SMS", "Push Notification"] as const;

    return (
        <div className="flex flex-col gap-5 w-full max-w-content mx-auto">
            {/* Breadcrumb */}
            <div>
                <div className="flex items-center gap-1.5 text-[12px] text-muted font-semibold">
                    <Link
                        href="/email-templates"
                        className="hover:text-text flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={12} strokeWidth={3} />
                        Email Templates
                    </Link>
                    <span>&gt;</span>
                    <span className="text-text font-medium">New Template</span>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-[20px] font-bold text-text leading-snug">
                    Create new template
                </h1>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <Link
                        href="/email-templates"
                        className="px-5 py-2 border border-border text-text hover:bg-page rounded-md text-sm font-semibold transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-white rounded-md text-sm font-semibold transition-all shadow-sm cursor-pointer"
                    >
                        {isSubmitting ? "Creating..." : "Create Template"}
                    </button>
                </div>
            </div>

            {/* Channel Tabs */}
            <div className="flex border-b border-border mb-8">
                {CHANNEL_TABS.map((tab) => {
                    const tabKey = tab === "Push Notification" ? "Push" : tab;
                    const isActive = activeTab === tabKey;
                    const tabColor =
                        tabKey === "Email"
                            ? { active: "text-accent", bar: "bg-accent" }
                            : tabKey === "SMS"
                              ? { active: "text-success", bar: "bg-success" }
                              : { active: "text-purple-600", bar: "bg-purple-600" };
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey as ChannelTab)}
                            className={`px-5 py-3 text-sm font-medium transition-all relative cursor-pointer ${
                                isActive
                                    ? `${tabColor.active} font-semibold`
                                    : "text-muted hover:text-text"
                            }`}
                        >
                            {tab}
                            {isActive && (
                                <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${tabColor.bar}`} />
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
                        templateName={name}
                        isCreating={true}
                        fromEmail={from}
                        subject={subject}
                        country={country}
                        language={lang}
                        smsProvider={provider === "twilio" ? "Twilio" : "GAMA"}
                        bodyText={content}
                        textareaRef={textareaRef}
                        availableVariables={AVAILABLE_VARIABLES}
                        onTemplateNameChange={setName}
                        onFromEmailChange={setFrom}
                        onSubjectChange={setSubject}
                        onCountryChange={setCountry}
                        onLanguageChange={setLang}
                        onSmsProviderChange={(v) => setProvider(v === "Twilio" ? "twilio" : "gama")}
                        onBodyTextChange={setContent}
                        onInsertVariable={handleInsertVariable}
                    />
                </div>

                <div className="lg:col-span-5 bg-card border border-border rounded-lg p-6 shadow-sm">
                    <PreviewPanel
                        activeTab={activeTab}
                        previewMode={previewMode}
                        fromName="HomeBy Team"
                        fromEmail={from || "info@homeby.com.au"}
                        subject={subject}
                        compiledBody={compileTemplate(content)}
                        onPreviewModeChange={setPreviewMode}
                        onSendTestClick={() => {}}
                        disabled={true}
                    />
                </div>
            </div>

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

export default CreateTemplateClient;
