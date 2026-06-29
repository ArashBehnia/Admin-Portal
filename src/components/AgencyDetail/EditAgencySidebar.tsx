"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Dropdown from "@/components/Shared/Dropdown";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const CRM_OPTIONS = [
    "Homeby Direct Listing",
    "Agentbox",
    "ValueRE",
    "Eagle Software",
    "Box+Dice",
    "Other",
];

export interface EditAgencyData {
    name?: string;
    email?: string;
    phone?: string;
    agencyAddress?: string;
    state?: string;
    postcode?: string;
    crmSelection?: string;
    crmName?: string;
    website?: string;
    licenceNumber?: string;
    principalRla?: string;
    rentalRla?: string;
    description?: string;
}

interface EditAgencySidebarProps {
    isOpen: boolean;
    agencyId: string;
    initialData?: EditAgencyData;
    onClose: () => void;
    onSuccess: () => void;
}

function getInitialFields(data: EditAgencyData) {
    return {
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        agencyAddress: data.agencyAddress ?? "",
        state: data.state ?? "",
        postcode: data.postcode ?? "",
        crmSelection: data.crmSelection ?? "",
        crmName: data.crmName ?? "",
        website: data.website ?? "",
        licenceNumber: data.licenceNumber ?? "",
        principalRla: data.principalRla ?? "",
        rentalRla: data.rentalRla ?? "",
        description: data.description ?? "",
    };
}

type Fields = ReturnType<typeof getInitialFields>;

const EditAgencySidebar = ({
    isOpen,
    agencyId,
    initialData = {},
    onClose,
    onSuccess,
}: EditAgencySidebarProps) => {
    const [fields, setFields] = useState<Fields>(() => getInitialFields(initialData));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !agencyId) return;

        const fetchAgency = async () => {
            setIsLoading(true);
            setError("");
            try {
                const res = await api.get(`/api/agencies/${agencyId}/detail`);
                const dto = res.data;
                const overview = dto?.overview ?? dto;
                setFields({
                    name: overview?.name ?? "",
                    email: overview?.email ?? "",
                    phone: overview?.phone ?? "",
                    agencyAddress: overview?.location ?? "",
                    state: overview?.state ?? "",
                    postcode: overview?.postcode ?? "",
                    crmSelection: overview?.crmSelection ?? "",
                    crmName: overview?.crmName ?? "",
                    website: overview?.website ?? "",
                    licenceNumber: overview?.licenceNumber ?? "",
                    principalRla: overview?.principalRla ?? "",
                    rentalRla: overview?.rentalRla ?? "",
                    description: overview?.description ?? "",
                });
            } catch (err) {
                console.error("Failed to fetch agency details:", err);
                setError("Failed to load agency details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgency();
    }, [isOpen, agencyId]);

    if (!isOpen) return null;

    const updateField = (key: string, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    const handleSubmit = async () => {
        setError("");
        setIsSubmitting(true);

        try {
            const payload: Record<string, string> = {};

            if (fields.name.trim()) payload.name = fields.name.trim();
            if (fields.email.trim()) payload.email = fields.email.trim();
            if (fields.phone.trim()) payload.phone = fields.phone.trim();
            if (fields.agencyAddress.trim()) payload.agencyAddress = fields.agencyAddress.trim();
            if (fields.state) payload.state = fields.state;
            if (fields.postcode.trim()) payload.postcode = fields.postcode.trim();
            if (fields.crmSelection) payload.crmSelection = fields.crmSelection;
            if (fields.crmSelection === "Other" && fields.crmName.trim()) payload.crmName = fields.crmName.trim();
            if (fields.website.trim()) payload.website = fields.website.trim();
            if (fields.licenceNumber.trim()) payload.licenceNumber = fields.licenceNumber.trim();
            if (fields.principalRla.trim()) payload.principalRla = fields.principalRla.trim();
            if (fields.rentalRla.trim()) payload.rentalRla = fields.rentalRla.trim();
            if (fields.description.trim()) payload.description = fields.description.trim();

            const res = await api.put(`/api/agency/${agencyId}`, payload);

            if (res.data?.success) {
                onClose();
                onSuccess();
            } else {
                setError(res.data?.error ?? "Failed to update agency.");
            }
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "response" in err
            ) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                setError(axiosErr.response?.data?.error ?? "Failed to update agency.");
            } else {
                setError(err instanceof Error ? err.message : "Failed to update agency.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-drawer flex justify-end">
            <div
                className="overlay"
                onClick={handleClose}
            />
            <div className="relative w-full max-w-[520px] bg-card shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2 className="text-[16px] font-bold text-text">
                        Edit Agency Details
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-muted hover:text-text transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            <span className="ml-2 text-[13px] text-muted">Loading agency details...</span>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Agency Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter agency name"
                                    value={fields.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="agency@example.com"
                                    value={fields.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+61412345678"
                                    value={fields.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Agency Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="10 Smith Street, Sydney"
                                    value={fields.agencyAddress}
                                    onChange={(e) => updateField("agencyAddress", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="block text-[13px] font-semibold text-text">
                                        State
                                    </label>
                                    <Dropdown
                                        value={fields.state}
                                        onChange={(val) => updateField("state", val)}
                                        options={STATES.map((s) => ({ value: s, label: s }))}
                                        placeholder="Select"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[13px] font-semibold text-text">
                                        Postcode
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="2000"
                                        maxLength={4}
                                        value={fields.postcode}
                                        onChange={(e) => updateField("postcode", e.target.value.replace(/\D/g, ""))}
                                        className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    CRM Selection
                                </label>
                                    <Dropdown
                                        value={fields.crmSelection}
                                        onChange={(val) => {
                                            updateField("crmSelection", val);
                                            if (val !== "Other") updateField("crmName", "");
                                        }}
                                        options={CRM_OPTIONS.map((c) => ({ value: c, label: c }))}
                                        placeholder="Select CRM"
                                    />
                            </div>

                            {fields.crmSelection === "Other" && (
                                <div className="space-y-1.5">
                                    <label className="block text-[13px] font-semibold text-text">
                                        CRM Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter CRM name"
                                        value={fields.crmName}
                                        onChange={(e) => updateField("crmName", e.target.value)}
                                        className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://agency.example.com"
                                    value={fields.website}
                                    onChange={(e) => updateField("website", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Licence Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="RLA123456"
                                    value={fields.licenceNumber}
                                    onChange={(e) => updateField("licenceNumber", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="block text-[13px] font-semibold text-text">
                                        Principal RLA
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PRLA123456"
                                        value={fields.principalRla}
                                        onChange={(e) => updateField("principalRla", e.target.value)}
                                        className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[13px] font-semibold text-text">
                                        Rental RLA
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="RRLA123456"
                                        value={fields.rentalRla}
                                        onChange={(e) => updateField("rentalRla", e.target.value)}
                                        className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-text">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Internal/admin description"
                                    value={fields.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none bg-card text-text"
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <p className="text-[12px] text-red-500">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-page/30 shrink-0">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting || isLoading}
                        className="px-4 py-2 text-[13px] font-semibold text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoading}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAgencySidebar;
