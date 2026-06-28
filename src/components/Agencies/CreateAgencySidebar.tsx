"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const CRM_OPTIONS = [
    "Homeby Direct Listing",
    "Agentbox",
    "ValueRE",
    "Eagle Software",
    "Box+Dice",
    "Other",
];

interface CreateAgencySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateAgencySidebar = ({
    isOpen,
    onClose,
    onSuccess,
}: CreateAgencySidebarProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [agencyAddress, setAgencyAddress] = useState("");
    const [state, setState] = useState("");
    const [postcode, setPostcode] = useState("");
    const [crmSelection, setCrmSelection] = useState("");
    const [crmName, setCrmName] = useState("");
    const [website, setWebsite] = useState("");
    const [licenceNumber, setLicenceNumber] = useState("");
    const [principalRla, setPrincipalRla] = useState("");
    const [rentalRla, setRentalRla] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setAgencyAddress("");
        setState("");
        setPostcode("");
        setCrmSelection("");
        setCrmName("");
        setWebsite("");
        setLicenceNumber("");
        setPrincipalRla("");
        setRentalRla("");
        setDescription("");
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        setError("");
        setIsSubmitting(true);

        try {
            const payload: Record<string, string> = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                agencyAddress: agencyAddress.trim(),
                state,
                postcode: postcode.trim(),
                crmSelection,
            };

            if (crmName.trim()) payload.crmName = crmName.trim();
            if (website.trim()) payload.website = website.trim();
            if (licenceNumber.trim()) payload.licenceNumber = licenceNumber.trim();
            if (principalRla.trim()) payload.principalRla = principalRla.trim();
            if (rentalRla.trim()) payload.rentalRla = rentalRla.trim();
            if (description.trim()) payload.description = description.trim();

            const res = await api.post("/api/agency", payload);

            if (res.data?.success) {
                resetForm();
                onClose();
                onSuccess();
            } else {
                setError(res.data?.error ?? "Failed to create agency.");
            }
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "response" in err
            ) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                setError(axiosErr.response?.data?.error ?? "Failed to create agency.");
            } else {
                setError(err instanceof Error ? err.message : "Failed to create agency.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />
            <div className="relative w-full max-w-[520px] bg-card shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2 className="text-[16px] font-bold text-text">
                        Create New Agency
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
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Agency Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter agency name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="agency@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="+61412345678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Agency Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="10 Smith Street, Sydney"
                            value={agencyAddress}
                            onChange={(e) => setAgencyAddress(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                            >
                                <option value="">Select</option>
                                {STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                Postcode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="2000"
                                maxLength={4}
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, ""))}
                                className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            CRM Selection <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={crmSelection}
                            onChange={(e) => {
                                setCrmSelection(e.target.value);
                                if (e.target.value !== "Other") setCrmName("");
                            }}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        >
                            <option value="">Select CRM</option>
                            {CRM_OPTIONS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {crmSelection === "Other" && (
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                CRM Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter CRM name"
                                value={crmName}
                                onChange={(e) => setCrmName(e.target.value)}
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
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
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
                            value={licenceNumber}
                            onChange={(e) => setLicenceNumber(e.target.value)}
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
                                value={principalRla}
                                onChange={(e) => setPrincipalRla(e.target.value)}
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
                                value={rentalRla}
                                onChange={(e) => setRentalRla(e.target.value)}
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none bg-card text-text"
                        />
                    </div>

                    {error && (
                        <p className="text-[12px] text-red-500">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-page/30 shrink-0">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-[13px] font-semibold text-muted hover:text-text transition-colors cursor-pointer disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAgencySidebar;
