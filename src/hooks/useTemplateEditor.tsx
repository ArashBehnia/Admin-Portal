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

const useTemplateEditor = ({ templateName }: UseTemplateEditorProps) => {
    const queryClient = useQueryClient();

    // ─── Data Fetching ─────────────────────────────────────────────
    const templateQuery = useQuery<Template>({
        queryKey: ["email-template", templateName],
        queryFn: () => fetchJson<Template>(`/api/email-templates/${templateName}`),
    });

    const currentTemplate = templateQuery.data;

    // ─── Tab & UI State ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<ChannelTab>("Email");
    const [previewMode, setPreviewMode] = useState<PreviewMode>("Desktop");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
    const [isActiveStatus, setIsActiveStatus] = useState(false);
    const initializedRef = useRef(false);

    // ─── Form State (initialized from backend) ────────────────────
    const [fromName, setFromName] = useState("");
    const [fromEmail, setFromEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [country, setCountry] = useState("Australia");
    const [language, setLanguage] = useState("English");
    const [smsProvider, setSmsProvider] = useState<"Twilio" | "GAMA">("Twilio");
    const [bodyText, setBodyText] = useState(DEFAULT_BODY);
    const [testEmailAddress, setTestEmailAddress] = useState(
        "james@raywhitebondi.com.au",
    );

    // ─── Version History State ────────────────────────────────────
    const [versionHistory, setVersionHistory] = useState<VersionLog[]>([]);

    // ─── Toast State ──────────────────────────────────────────────
    const [toast, setToast] = useState<ToastState>({
        title: "",
        message: "",
        type: "success",
        visible: false,
    });

    // ─── Refs ─────────────────────────────────────────────────────
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // ─── Initialize form from fetched template ────────────────────
    useEffect(() => {
        if (currentTemplate && !initializedRef.current) {
            console.log("[useTemplateEditor] initializing form from template:", currentTemplate.name);
            setFromName(currentTemplate.fromName || "HomeBy Team");
            setFromEmail(currentTemplate.fromEmail || "info@homeby.com.au");
            setSubject(currentTemplate.subject || "");
            setBodyText(currentTemplate.body || DEFAULT_BODY);
            setCountry(currentTemplate.country || "Australia");
            setLanguage(currentTemplate.language || "English");
            setSmsProvider(currentTemplate.smsProvider || "Twilio");
            initializedRef.current = true;
        }
    }, [currentTemplate]);

    // Always sync status from backend (reflects save changes)
    useEffect(() => {
        if (currentTemplate) {
            setIsActiveStatus(currentTemplate.status === "Active");
        }
    }, [currentTemplate]);

    // ─── Mutations ────────────────────────────────────────────────
    const saveMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const urlId = (data.id as string) || templateName;
            console.log("[useTemplateEditor] save mutation URL id:", urlId, "payload:", JSON.stringify(data, null, 2));
            const res = await fetch(`/api/email-templates/${encodeURIComponent(urlId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                const errorMessage = errorBody.error || `Save failed: ${res.status}`;
                throw new Error(errorMessage);
            }
            const result = await res.json();
            console.log("[useTemplateEditor] save mutation response:", JSON.stringify(result, null, 2));
            return result;
        },
        onSuccess: async (result) => {
            console.log("[useTemplateEditor] save mutation success, result:", JSON.stringify(result, null, 2));
            // Immediately update query cache with mutation response so form re-syncs
            queryClient.setQueryData(["email-template", templateName], result);
            // Reset initializedRef so useEffect re-syncs form with fresh data
            initializedRef.current = false;
            // Background refetch to confirm
            queryClient.invalidateQueries({ queryKey: ["email-templates"] });
            queryClient.refetchQueries({ queryKey: ["email-template", templateName] });
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
                return "bg-blue-50 text-blue-700";
            case "Account":
                return "bg-emerald-50 text-emerald-700";
            case "Agency":
                return "bg-purple-50 text-purple-700";
            case "Reviews":
                return "bg-orange-50 text-orange-700";
            case "Billing":
                return "bg-amber-50 text-amber-700";
            case "System":
                return "bg-slate-50 text-slate-700";
            default:
                return "bg-slate-50 text-slate-700";
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
            showToast("Save Failed", "Template ID not found. Please reload and try again.", "error");
            return;
        }
        const payload: Record<string, unknown> = {
            id: currentTemplate.id,
            name: templateName,
            category: currentTemplate.category,
            channels: currentTemplate.channels,
            status: isActiveStatus ? "Active" : "Draft",
            fromName,
            fromEmail,
            subject,
            body: bodyText,
            country,
            language,
            smsProvider,
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
