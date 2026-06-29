"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

interface CreateAgencySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type FormErrors = Partial<Record<string, string>>;

function validate(fields: {
    name: string;
    email: string;
    phone: string;
    agencyAddress: string;
    state: string;
    postcode: string;
    crmSelection: string;
    crmName: string;
}): FormErrors {
    const errors: FormErrors = {};

    if (!fields.name.trim()) {
        errors.name = "Agency name is required.";
    }

    if (!fields.email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (!fields.phone.trim()) {
        errors.phone = "Phone number is required.";
    }

    if (!fields.agencyAddress.trim()) {
        errors.agencyAddress = "Agency address is required.";
    }

    if (!fields.state) {
        errors.state = "State is required.";
    }

    if (!fields.postcode.trim()) {
        errors.postcode = "Postcode is required.";
    } else if (!/^\d{4}$/.test(fields.postcode.trim())) {
        errors.postcode = "Postcode must be exactly 4 digits.";
    }

    if (!fields.crmSelection) {
        errors.crmSelection = "CRM selection is required.";
    }

    if (fields.crmSelection === "Other" && !fields.crmName.trim()) {
        errors.crmName = "CRM name is required when Other is selected.";
    }

    return errors;
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
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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
        setErrors({});
        setTouched({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const markTouched = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const validateField = (field: string, value: string) => {
        const result = validate({
            name,
            email,
            phone,
            agencyAddress,
            state,
            postcode,
            crmSelection,
            crmName,
            [field]: value,
        });
        setErrors((prev) => {
            const next = { ...prev };
            if (result[field]) {
                next[field] = result[field];
            } else {
                delete next[field];
            }
            return next;
        });
    };

    const handleSubmit = async () => {
        setError("");

        const formErrors = validate({
            name,
            email,
            phone,
            agencyAddress,
            state,
            postcode,
            crmSelection,
            crmName,
        });
        setErrors(formErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            agencyAddress: true,
            state: true,
            postcode: true,
            crmSelection: true,
            crmName: true,
        });

        if (Object.keys(formErrors).length > 0) return;

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

    const fieldClass = (field: string) =>
        `w-full border rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 bg-card text-text ${
            touched[field] && errors[field]
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-border focus:border-accent focus:ring-accent"
        }`;

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
                            Agency Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter agency name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (touched.name) validateField("name", e.target.value);
                            }}
                            onBlur={() => {
                                markTouched("name");
                                validateField("name", name);
                            }}
                            className={fieldClass("name")}
                        />
                        {touched.name && errors.name && (
                            <p className="text-[11px] text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="agency@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (touched.email) validateField("email", e.target.value);
                            }}
                            onBlur={() => {
                                markTouched("email");
                                validateField("email", email);
                            }}
                            className={fieldClass("email")}
                        />
                        {touched.email && errors.email && (
                            <p className="text-[11px] text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+61412345678"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (touched.phone) validateField("phone", e.target.value);
                            }}
                            onBlur={() => {
                                markTouched("phone");
                                validateField("phone", phone);
                            }}
                            className={fieldClass("phone")}
                        />
                        {touched.phone && errors.phone && (
                            <p className="text-[11px] text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Agency Address
                        </label>
                        <input
                            type="text"
                            placeholder="10 Smith Street, Sydney"
                            value={agencyAddress}
                            onChange={(e) => {
                                setAgencyAddress(e.target.value);
                                if (touched.agencyAddress) validateField("agencyAddress", e.target.value);
                            }}
                            onBlur={() => {
                                markTouched("agencyAddress");
                                validateField("agencyAddress", agencyAddress);
                            }}
                            className={fieldClass("agencyAddress")}
                        />
                        {touched.agencyAddress && errors.agencyAddress && (
                            <p className="text-[11px] text-red-500">{errors.agencyAddress}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                State
                            </label>
                            <Dropdown
                                value={state}
                                onChange={(val) => {
                                    setState(val);
                                    if (touched.state) validateField("state", val);
                                }}
                                options={STATES.map((s) => ({ value: s, label: s }))}
                                placeholder="Select"
                                className={fieldClass("state").includes("border-red") ? "border-red-500" : ""}
                            />
                            {touched.state && errors.state && (
                                <p className="text-[11px] text-red-500">{errors.state}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                Postcode
                            </label>
                            <input
                                type="text"
                                placeholder="2000"
                                maxLength={4}
                                value={postcode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setPostcode(val);
                                    if (touched.postcode) validateField("postcode", val);
                                }}
                                onBlur={() => {
                                    markTouched("postcode");
                                    validateField("postcode", postcode);
                                }}
                                className={fieldClass("postcode")}
                            />
                            {touched.postcode && errors.postcode && (
                                <p className="text-[11px] text-red-500">{errors.postcode}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            CRM Selection
                        </label>
                        <Dropdown
                            value={crmSelection}
                            onChange={(val) => {
                                setCrmSelection(val);
                                if (val !== "Other") setCrmName("");
                                if (touched.crmSelection) validateField("crmSelection", val);
                            }}
                            options={CRM_OPTIONS.map((c) => ({ value: c, label: c }))}
                            placeholder="Select CRM"
                            className={fieldClass("crmSelection").includes("border-red") ? "border-red-500" : ""}
                        />
                        {touched.crmSelection && errors.crmSelection && (
                            <p className="text-[11px] text-red-500">{errors.crmSelection}</p>
                        )}
                    </div>

                    {crmSelection === "Other" && (
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                CRM Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter CRM name"
                                value={crmName}
                                onChange={(e) => {
                                    setCrmName(e.target.value);
                                    if (touched.crmName) validateField("crmName", e.target.value);
                                }}
                                onBlur={() => {
                                    markTouched("crmName");
                                    validateField("crmName", crmName);
                                }}
                                className={fieldClass("crmName")}
                            />
                            {touched.crmName && errors.crmName && (
                                <p className="text-[11px] text-red-500">{errors.crmName}</p>
                            )}
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
