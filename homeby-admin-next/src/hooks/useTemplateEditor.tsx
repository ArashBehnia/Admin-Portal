"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Template } from "@/actions/emailTemplatesActions";

export type ChannelTab = "Email" | "SMS" | "Push";
export type PreviewMode = "Desktop" | "Mobile";

export type VersionLog = {
    version: string;
    modifiedBy: string;
    date: string;
    changes: string;
    subject: string;
    body: string;
    isActive: boolean;
};

export type ToastState = {
    title: string;
    message: string;
    type: "success" | "info" | "error";
    visible: boolean;
};

interface UseTemplateEditorProps {
    templateName: string;
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
}

const INITIAL_BODY = `Hi {{contact_name}},

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

const INITIAL_VERSION_HISTORY: VersionLog[] = [
    {
        version: "v3 (current)",
        modifiedBy: "Arash",
        date: "1 May 2026",
        changes: "Added temp password expiry notice",
        subject: "Welcome to HomeBy — Your agency account is ready",
        body: INITIAL_BODY,
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
];

const AVAILABLE_VARIABLES = [
    "{{agency_name}}",
    "{{contact_name}}",
    "{{temp_password}}",
    "{{login_url}}",
    "{{support_email}}",
    "{{expiry_hours}}",
];

const useTemplateEditor = ({ templateName }: UseTemplateEditorProps) => {
    const queryClient = useQueryClient();

    // ─── Data Fetching ─────────────────────────────────────────────
    console.log("[useTemplateEditor] fetching template:", templateName);
    const templateQuery = useQuery<Template>({
        queryKey: ["email-template", templateName],
        queryFn: () => fetchJson<Template>(`/api/email-templates/${templateName}`),
    });

    const currentTemplate = templateQuery.data;

    useEffect(() => {
        if (currentTemplate) {
            console.log("[useTemplateEditor] template loaded:", JSON.stringify(currentTemplate, null, 2));
        }
    }, [currentTemplate]);

    useEffect(() => {
        if (templateQuery.isError) {
            console.error("[useTemplateEditor] query error:", templateQuery.error);
        }
    }, [templateQuery.isError, templateQuery.error]);

    // ─── Tab & UI State ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<ChannelTab>("Email");
    const [previewMode, setPreviewMode] = useState<PreviewMode>("Desktop");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
    const [isActiveStatus, setIsActiveStatus] = useState(false);
    const initializedRef = useRef(false);

    // ─── Form State ───────────────────────────────────────────────
    const [fromName, setFromName] = useState("HomeBy Team");
    const [fromEmail, setFromEmail] = useState("info@homeby.com.au");
    const [subject, setSubject] = useState(
        "Welcome to HomeBy — Your agency account is ready",
    );
    const [country, setCountry] = useState("Australia");
    const [language, setLanguage] = useState("English");
    const [smsProvider, setSmsProvider] = useState<"Twilio" | "GAMA">("Twilio");
    const [bodyText, setBodyText] = useState(INITIAL_BODY);
    const [testEmailAddress, setTestEmailAddress] = useState(
        "james@raywhitebondi.com.au",
    );

    // ─── Version History State ────────────────────────────────────
    const [versionHistory, setVersionHistory] = useState<VersionLog[]>(
        INITIAL_VERSION_HISTORY,
    );

    // ─── Toast State ──────────────────────────────────────────────
    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    // ─── Refs ─────────────────────────────────────────────────────
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // ─── Mutations ────────────────────────────────────────────────
    const saveMutation = useMutation({
        mutationFn: async (data: Partial<Template>) => {
            console.log("[useTemplateEditor] save mutation payload:", JSON.stringify(data, null, 2));
            const res = await fetch(`/api/email-templates/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            const result = await res.json();
            console.log("[useTemplateEditor] save mutation response:", JSON.stringify(result, null, 2));
            return result;
        },
        onSuccess: () => {
            console.log("[useTemplateEditor] save mutation success, invalidating queries");
            queryClient.invalidateQueries({ queryKey: ["email-templates"] });
            queryClient.invalidateQueries({ queryKey: ["email-template", templateName] });
            showToast(
                "Template Saved",
                `${templateName} has been successfully updated.`,
            );
        },
        onError: (error: Error) => {
            console.error("[useTemplateEditor] save mutation error:", error);
            showToast("Save Failed", error.message, "error");
        },
    });

    // ─── Effects ──────────────────────────────────────────────────
    useEffect(() => {
        if (currentTemplate && !initializedRef.current) {
            setIsActiveStatus(currentTemplate.status === "Active");
            initializedRef.current = true;
        }
    }, [currentTemplate]);

    useEffect(() => {
        if (!toast.visible) return;
        const timer = setTimeout(
            () => setToast((prev) => ({ ...prev, visible: false })),
            4000,
        );
        return () => clearTimeout(timer);
    }, [toast.visible]);

    // ─── Helpers ──────────────────────────────────────────────────
    const showToast = (
        title: string,
        message: string,
        type: ToastState["type"] = "success",
    ) => {
        setToast({ title, message, type, visible: true });
    };

    const compileTemplate = (text: string) => {
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
    };

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case "Auth":
                return "bg-blue-50 border-blue-100 text-blue-700";
            case "Account":
                return "bg-emerald-50 border-emerald-100 text-emerald-700";
            case "Agency":
                return "bg-purple-50 border-purple-100 text-purple-700";
            default:
                return "bg-slate-50 border-slate-200 text-slate-700";
        }
    };

    // ─── Handlers ─────────────────────────────────────────────────
    const handleInsertVariable = (token: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const updated =
                bodyText.substring(0, start) + token + bodyText.substring(end);
            setBodyText(updated);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(
                    start + token.length,
                    start + token.length,
                );
            }, 0);
        } else {
            setBodyText((prev) => prev + " " + token);
        }
    };

    const handleRestoreVersion = (verItem: VersionLog) => {
        setSubject(verItem.subject);
        setBodyText(verItem.body);
        setVersionHistory((prev) =>
            prev.map((v) => ({
                ...v,
                isActive: v.version === verItem.version,
            })),
        );
        showToast(
            "Version Restored",
            `Successfully loaded content from ${verItem.version}.`,
        );
    };

    const handleSaveTemplate = () => {
        if (!currentTemplate?.id) {
            console.warn("[useTemplateEditor] save called but no template id available");
            return;
        }
        const payload: Partial<Template> = {
            id: currentTemplate.id,
            name: templateName,
            category: currentTemplate.category,
            channels: currentTemplate.channels,
            status: (isActiveStatus ? "Active" : "Draft") as Template["status"],
        };
        console.log("[useTemplateEditor] handleSaveTemplate payload:", JSON.stringify(payload, null, 2));
        saveMutation.mutate(payload);
    };

    const handleSendTest = (emailAddress: string) => {
        console.log("[useTemplateEditor] handleSendTest to:", emailAddress);
        setIsTestEmailModalOpen(false);
        showToast(
            "Test Email Sent",
            `Test ${templateName} email dispatched to ${emailAddress}.`,
        );
    };

    return {
        // Template meta
        currentTemplate,
        isLoadingTemplate: templateQuery.isLoading,

        // Tab & UI
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

        // Form
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

        // Version history
        versionHistory,

        // Loading
        isSaving: saveMutation.isPending,
        isSendingTest: false,

        // Toast
        toast,
        setToast,

        // Constants
        AVAILABLE_VARIABLES,

        // Helpers
        compileTemplate,
        getCategoryStyles,

        // Handlers
        handleInsertVariable,
        handleRestoreVersion,
        handleSaveTemplate,
        handleSendTest,
    };
};

export default useTemplateEditor;
