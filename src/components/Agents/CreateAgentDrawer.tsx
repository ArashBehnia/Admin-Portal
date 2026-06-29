"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, Loader2, ChevronDown, Search } from "lucide-react";
import api from "@/lib/axios";
import Dropdown from "@/components/Shared/Dropdown";

const ROLES = [
    { value: "owner", label: "Owner" },
    { value: "agent", label: "Agent" },
    { value: "admin", label: "Admin" },
    { value: "assistant", label: "Assistant" },
];

interface AgencyOption {
    id: string;
    name: string;
}

type FormErrors = Partial<Record<string, string>>;

function validate(fields: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agencyId: string;
}): FormErrors {
    const errors: FormErrors = {};

    if (!fields.firstName.trim()) {
        errors.firstName = "First name is required.";
    }

    if (!fields.lastName.trim()) {
        errors.lastName = "Last name is required.";
    }

    if (!fields.email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (!fields.password) {
        errors.password = "Password is required.";
    } else if (fields.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    if (!fields.agencyId) {
        errors.agencyId = "Agency is required.";
    }

    return errors;
}

interface CreateAgentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateAgentDrawer = ({
    isOpen,
    onClose,
    onSuccess,
}: CreateAgentDrawerProps) => {
    const [agencies, setAgencies] = useState<AgencyOption[]>([]);
    const [loadingAgencies, setLoadingAgencies] = useState(false);

    const [agencyId, setAgencyId] = useState("");
    const [agencySearch, setAgencySearch] = useState("");
    const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
    const agencyDropdownRef = useRef<HTMLDivElement>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("agent");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!isOpen) return;
        setLoadingAgencies(true);
        api.get("/api/agencies/page?offset=0&limit=9999")
            .then((res) => {
                const data = res.data;
                const items = data?.data ?? data?.content ?? data ?? [];
                setAgencies(
                    (Array.isArray(items) ? items : []).map(
                        (a: Record<string, unknown>) => ({
                            id: String(a.id ?? ""),
                            name: String(a.name ?? "Unknown"),
                        }),
                    ),
                );
            })
            .catch(() => {
                setAgencies([]);
            })
            .finally(() => setLoadingAgencies(false));
    }, [isOpen]);

    const selectedAgency = agencies.find((a) => a.id === agencyId);

    const filteredAgencies = useMemo(() => {
        if (!agencySearch.trim()) return agencies;
        const q = agencySearch.toLowerCase();
        return agencies.filter((a) => a.name.toLowerCase().includes(q));
    }, [agencies, agencySearch]);

    useEffect(() => {
        if (!agencyDropdownOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (agencyDropdownRef.current && !agencyDropdownRef.current.contains(e.target as Node)) {
                setAgencyDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [agencyDropdownOpen]);

    if (!isOpen) return null;

    const resetForm = () => {
        setAgencyId("");
        setAgencySearch("");
        setAgencyDropdownOpen(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobile("");
        setPassword("");
        setRole("agent");
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
            firstName,
            lastName,
            email,
            password,
            agencyId,
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

        const formErrors = validate({ firstName, lastName, email, password, agencyId });
        setErrors(formErrors);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            agencyId: true,
        });

        if (Object.keys(formErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            const payload: Record<string, unknown> = {
                agencyId,
                contact: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                },
                email: email.trim(),
                password,
                role,
                isActive: true,
            };

            if (mobile.trim()) payload.mobile = mobile.trim();

            const res = await api.post("/api/agents/staff", payload);

            if (res.data?.success) {
                resetForm();
                onClose();
                onSuccess();
            } else {
                setError(res.data?.error ?? "Failed to create agent.");
            }
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as {
                    response?: { data?: { error?: string } };
                };
                setError(
                    axiosErr.response?.data?.error ?? "Failed to create agent.",
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create agent.",
                );
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
        <>
            {/* Backdrop */}
            <div
                className="overlay z-drawer transition-opacity"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-[520px] bg-card border-l border-border shadow-2xl z-[101] flex flex-col animate-slide-left">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <h2 className="text-[16px] font-bold text-text">
                        Create New Agent
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
                    {/* Agency */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Agency
                        </label>
                        {loadingAgencies ? (
                            <div className="flex items-center gap-2 py-2 text-[13px] text-muted">
                                <Loader2 className="w-4 h-4 animate-spin" /> Loading agencies...
                            </div>
                        ) : (
                            <div ref={agencyDropdownRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAgencyDropdownOpen(!agencyDropdownOpen);
                                        if (!agencyDropdownOpen) setAgencySearch("");
                                    }}
                                    className={`w-full border rounded px-3 py-2 text-[13px] text-left focus:outline-none focus:ring-1 bg-card flex items-center justify-between ${
                                        touched.agencyId && errors.agencyId
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-border focus:border-accent focus:ring-accent"
                                    } ${!agencyId ? "text-muted" : "text-text"}`}
                                >
                                    <span className="truncate">{selectedAgency?.name || "Select agency"}</span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 text-muted transition-transform ${agencyDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {agencyDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 flex flex-col">
                                        <div className="p-2 border-b border-border">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                                                <input
                                                    type="text"
                                                    placeholder="Search agency..."
                                                    value={agencySearch}
                                                    onChange={(e) => setAgencySearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 border border-border rounded text-[12px] focus:outline-none focus:ring-1 focus:ring-accent bg-card text-text"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto flex-1">
                                            {filteredAgencies.length === 0 ? (
                                                <div className="px-3 py-2 text-[12px] text-muted">No agencies found</div>
                                            ) : (
                                                filteredAgencies.map((a) => (
                                                    <button
                                                        key={a.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setAgencyId(a.id);
                                                            setAgencyDropdownOpen(false);
                                                            setAgencySearch("");
                                                            if (touched.agencyId) validateField("agencyId", a.id);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-[13px] hover:bg-page transition-colors cursor-pointer ${
                                                            agencyId === a.id ? "bg-page font-semibold text-text" : "text-text"
                                                        }`}
                                                    >
                                                        {a.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {touched.agencyId && errors.agencyId && (
                            <p className="text-[11px] text-red-500">{errors.agencyId}</p>
                        )}
                    </div>

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                First Name
                            </label>
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    if (touched.firstName) validateField("firstName", e.target.value);
                                }}
                                onBlur={() => {
                                    markTouched("firstName");
                                    validateField("firstName", firstName);
                                }}
                                className={fieldClass("firstName")}
                            />
                            {touched.firstName && errors.firstName && (
                                <p className="text-[11px] text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-text">
                                Last Name
                            </label>
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    if (touched.lastName) validateField("lastName", e.target.value);
                                }}
                                onBlur={() => {
                                    markTouched("lastName");
                                    validateField("lastName", lastName);
                                }}
                                className={fieldClass("lastName")}
                            />
                            {touched.lastName && errors.lastName && (
                                <p className="text-[11px] text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="agent@example.com"
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

                    {/* Mobile */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Mobile
                        </label>
                        <input
                            type="tel"
                            placeholder="+61412345678"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full border border-border rounded px-3 py-2 text-[13px] focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-card text-text"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (touched.password) validateField("password", e.target.value);
                            }}
                            onBlur={() => {
                                markTouched("password");
                                validateField("password", password);
                            }}
                            className={fieldClass("password")}
                        />
                        {touched.password && errors.password && (
                            <p className="text-[11px] text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-semibold text-text">
                            Role
                        </label>
                        <Dropdown
                            value={role}
                            onChange={setRole}
                            options={ROLES}
                            placeholder="Select role"
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
                        disabled={isSubmitting || loadingAgencies}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating..." : "Create Agent"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CreateAgentDrawer;
