import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
    Search, 
    Plus, 
    X, 
    Loader2, 
    Shield, 
    Key, 
    MoreHorizontal, 
    Trash2, 
    User, 
    Mail, 
    AlertTriangle,
    ShieldAlert
} from "lucide-react";

// Define TS Interfaces for Data-Driven Architecture
interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
    mfa: "Enabled" | "Not set up";
    lastLogin: string;
    added: string;
}

interface RoleInfo {
    name: string;
    description: string;
    permissions: string[];
    colorClass: string;
    badgeStyle: string;
}

// Predefined Roles list with detailed description and permissions metadata
const ROLES_INFO: Record<string, RoleInfo> = {
    "Superadmin": {
        name: "Superadmin",
        description: "Complete control of all resources, billing settings, third-party integrations, and team administration.",
        permissions: ["All Operations", "Manage Staff", "Access Billing", "Integrate Apps", "System Config"],
        colorClass: "bg-purple-150 text-purple-700 border-purple-200",
        badgeStyle: "bg-purple-50 text-purple-700 border-purple-200"
    },
    "Admin": {
        name: "Admin",
        description: "Full management of agents, reviews, and properties, but restricted from sensitive billing or platform configurations.",
        permissions: ["Manage Staff (except Superadmins)", "Moderate Reviews", "Approve Agents", "View Reports"],
        colorClass: "bg-blue-150 text-blue-700 border-blue-200",
        badgeStyle: "bg-blue-50 text-blue-700 border-blue-200"
    },
    "Support": {
        name: "Support",
        description: "Assigned to helpdesk. View all dashboard activity, assist agents with logins, reset passwords, and manage support tickets.",
        permissions: ["View Dashboard", "Reset Passwords", "Manage Support", "Read-only Audits"],
        colorClass: "bg-teal-150 text-teal-700 border-teal-200",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200"
    },
    "Reviewer": {
        name: "Reviewer",
        description: "Verifies and moderates user content and certifications like agency state licences or suspicious review reports.",
        permissions: ["Verify Licences", "Moderate Submissions", "Flag Listings"],
        colorClass: "bg-amber-150 text-amber-700 border-amber-200",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200"
    },
    "Content editor": {
        name: "Content editor",
        description: "Updates website assets, blogs, knowledge bases, FAQ libraries, and generic email-templates without admin power.",
        permissions: ["Edit Templates", "Publish Articles", "View Resources"],
        colorClass: "bg-slate-150 text-slate-700 border-slate-200",
        badgeStyle: "bg-slate-100 text-slate-700 border-slate-200"
    }
};

const RouteComponent = () => {
    // Search, Filters and Navigation States
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<"Staff" | "Roles">("Staff");

    // Modal Control States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    // Dropdown Action Popovers
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

    // React Form states (controlled inputs)
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState("Admin");
    const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
    const [formMfa, setFormMfa] = useState<"Enabled" | "Not set up">("Not set up");
    const [formError, setFormError] = useState("");

    // TanStack Query for Loading local JSON Database
    const { data: serverStaff = [], isLoading, isError } = useQuery<StaffMember[]>({
        queryKey: ["staffList"],
        queryFn: async () => {
            const response = await axios.get("/data/staff.json");
            return response.data;
        }
    });

    // Local state which serves as the interactive store for additions/edits/deletions
    const [localStaff, setLocalStaff] = useState<StaffMember[]>([]);

    // Initialize localState when Query succeeds
    useEffect(() => {
        if (serverStaff && serverStaff.length > 0) {
            setLocalStaff(serverStaff);
        }
    }, [serverStaff]);

    // Derived Statistics
    const totalStaffCount = localStaff.length;
    const activeStaffCount = localStaff.filter(s => s.status === "Active").length;
    const mfaEnabledCount = localStaff.filter(s => s.mfa === "Enabled").length;
    const mfaNotSetUpCount = localStaff.filter(s => s.mfa === "Not set up").length;

    // Filter staff members based on search and selected pill filter
    const filteredStaff = localStaff.filter((member) => {
        const matchesQuery = 
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRole = 
            roleFilter === "All" || 
            member.role.toLowerCase() === roleFilter.toLowerCase();

        return matchesQuery && matchesRole;
    });

    // Close dropdowns
    useEffect(() => {
        const handleOutsideClick = () => setActiveDropdownId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    // Create / Add Staff Operation
    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formName.trim() || !formEmail.trim()) {
            setFormError("Please enter both name and email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formEmail)) {
            setFormError("Please enter a valid email address.");
            return;
        }

        // Check for duplicates
        if (localStaff.some(s => s.email.toLowerCase() === formEmail.toLowerCase())) {
            setFormError("A staff member with this email already exists.");
            return;
        }

        const newStaff: StaffMember = {
            id: String(Date.now()),
            name: formName,
            email: formEmail,
            role: formRole,
            status: formStatus,
            mfa: formMfa,
            lastLogin: "Never logged in",
            added: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            })
        };

        setLocalStaff([newStaff, ...localStaff]);
        setIsAddModalOpen(false);
        resetForm();
    };

    // Open Edit Modal with current values
    const openEditModal = (staff: StaffMember) => {
        setSelectedStaff(staff);
        setFormName(staff.name);
        setFormEmail(staff.email);
        setFormRole(staff.role);
        setFormStatus(staff.status);
        setFormMfa(staff.mfa);
        setFormError("");
        setIsEditModalOpen(true);
    };

    // Save Edit Operation
    const handleEditStaff = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formName.trim() || !formEmail.trim()) {
            setFormError("Please enter both name and email.");
            return;
        }

        if (!selectedStaff) return;

        // Check for duplicate emails excluding self
        if (localStaff.some(s => s.email.toLowerCase() === formEmail.toLowerCase() && s.id !== selectedStaff.id)) {
            setFormError("A staff member with this email already exists.");
            return;
        }

        const updatedList = localStaff.map((s) => {
            if (s.id === selectedStaff.id) {
                return {
                    ...s,
                    name: formName,
                    email: formEmail,
                    role: formRole,
                    status: formStatus,
                    mfa: formMfa
                };
            }
            return s;
        });

        setLocalStaff(updatedList);
        setIsEditModalOpen(false);
        resetForm();
    };

    // Delete Staff Operation
    const handleDeleteStaff = (id: string) => {
        if (confirm("Are you sure you want to remove this staff member from internal administration?")) {
            setLocalStaff(localStaff.filter(s => s.id !== id));
        }
    };

    // Toggle MFA Status utility
    const toggleMfaStatus = (staff: StaffMember) => {
        const updatedList = localStaff.map((s) => {
            if (s.id === staff.id) {
                return {
                    ...s,
                    mfa: s.mfa === "Enabled" ? ("Not set up" as const) : ("Enabled" as const)
                };
            }
            return s;
        });
        setLocalStaff(updatedList);
    };

    // Toggle Active Status
    const toggleActiveStatus = (staff: StaffMember) => {
        const updatedList = localStaff.map((s) => {
            if (s.id === staff.id) {
                return {
                    ...s,
                    status: s.status === "Active" ? ("Inactive" as const) : ("Active" as const)
                };
            }
            return s;
        });
        setLocalStaff(updatedList);
    };

    const resetForm = () => {
        setFormName("");
        setFormEmail("");
        setFormRole("Admin");
        setFormStatus("Active");
        setFormMfa("Not set up");
        setFormError("");
        setSelectedStaff(null);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto pb-16 px-1 lg:px-4">
            {/* Header & Subtitle */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-[26px] font-bold text-text tracking-tight font-sans">
                    Staff & Roles
                </h1>
                <p className="text-sm text-muted">
                    Manage HomeBy internal staff accounts and access levels.
                </p>
            </div>

            {/* Responsive Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Stat 1: Total Staff */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col gap-2 hover:border-accent/40 transition-colors">
                    <span className="text-[13px] text-muted font-medium">Total staff</span>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[28px] font-bold text-text leading-none font-sans">
                            {totalStaffCount}
                        </span>
                    )}
                </div>

                {/* Stat 2: Active */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col gap-2 hover:border-success/40 transition-colors relative overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
                        <span className="text-[13px] text-muted font-medium">Active</span>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[28px] font-bold text-text leading-none font-sans">
                            {activeStaffCount}
                        </span>
                    )}
                </div>

                {/* Stat 3: MFA Enabled */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col gap-2 hover:border-success/40 transition-colors">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
                        <span className="text-[13px] text-muted font-medium">MFA enabled</span>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[28px] font-bold text-text leading-none font-sans">
                            {mfaEnabledCount}
                        </span>
                    )}
                </div>

                {/* Stat 4: MFA Not Set Up */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-5 flex flex-col gap-2 hover:border-warning/40 transition-colors relative">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-warning inline-block"></span>
                        <span className="text-[13px] text-muted font-medium">MFA not set up</span>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-page animate-pulse rounded" />
                    ) : (
                        <span className="text-[28px] font-bold text-text leading-none font-sans">
                            {mfaNotSetUpCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-border mt-3">
                <button
                    onClick={() => setActiveTab("Staff")}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-all relative ${
                        activeTab === "Staff" 
                            ? "border-accent text-accent" 
                            : "border-transparent text-muted hover:text-text"
                    }`}
                >
                    Staff
                    {activeTab === "Staff" && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("Roles")}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-all relative ${
                        activeTab === "Roles" 
                            ? "border-accent text-accent" 
                            : "border-transparent text-muted hover:text-text"
                    }`}
                >
                    Roles
                    {activeTab === "Roles" && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded" />
                    )}
                </button>
            </div>

            {/* TAB CONTENT: STAFF SECTION */}
            {activeTab === "Staff" && (
                <div className="flex flex-col gap-5 animate-fade-in">
                    
                    {/* Controls panel: Search bar, Pills, and Add button */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mt-1">
                        
                        {/* Search Input Container */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                                type="text"
                                placeholder="Search staff name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-card border border-border rounded-md text-sm text-text placeholder-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-colors"
                            />
                        </div>

                        {/* Middle Filter Pills & Add Staff Button Wrapper */}
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                            
                            {/* Horizontal scrollable pills */}
                            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                                {["All", "Superadmin", "Admin", "Support", "Reviewer", "Content editor"].map((pill) => {
                                    const isActive = roleFilter === pill;
                                    return (
                                        <button
                                            key={pill}
                                            onClick={() => setRoleFilter(pill)}
                                            className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                                                isActive
                                                    ? "bg-text text-card border-text"
                                                    : "bg-card text-muted hover:text-text border-border hover:bg-page"
                                            }`}
                                        >
                                            {pill}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Accent blue Add Staff button */}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs py-2 px-4 rounded transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                                Add staff
                            </button>
                        </div>
                    </div>

                    {/* Data List Container */}
                    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="h-8 w-8 text-accent animate-spin" />
                                <span className="text-sm text-muted">Retrieving administrative database...</span>
                            </div>
                        ) : isError ? (
                            <div className="bg-red-50 border border-red-200 text-danger rounded-lg p-6 text-sm text-center m-6">
                                Failed to fetch staff database. Please reload or check logs.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/80 bg-page/55 text-muted text-[11px] uppercase font-bold tracking-wider">
                                            <th className="px-6 py-4">Staff Member</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">MFA</th>
                                            <th className="px-6 py-4 hidden lg:table-cell">Last Login</th>
                                            <th className="px-6 py-4 hidden xl:table-cell">Added</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {filteredStaff.length > 0 ? (
                                            filteredStaff.map((member) => {
                                                const roleMeta = ROLES_INFO[member.role] || {
                                                    badgeStyle: "bg-slate-100 text-slate-700 border-slate-200"
                                                };
                                                return (
                                                    <tr 
                                                        key={member.id} 
                                                        className="hover:bg-page/35 transition-colors text-sm text-text"
                                                    >
                                                        {/* STAFF MEMBER Column */}
                                                        <td className="px-6 py-4 font-sans">
                                                            <div className="font-bold text-text text-[14px]">
                                                                {member.name}
                                                            </div>
                                                            <div className="text-[12px] text-muted mt-0.5 font-medium">
                                                                {member.email}
                                                            </div>
                                                        </td>

                                                        {/* ROLE Column */}
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${roleMeta.badgeStyle}`}>
                                                                {member.role}
                                                            </span>
                                                        </td>

                                                        {/* STATUS Column */}
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                                                member.status === "Active"
                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                            }`}>
                                                                {member.status}
                                                            </span>
                                                        </td>

                                                        {/* MFA Column */}
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                                                member.mfa === "Enabled"
                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                    : "bg-orange-50 text-orange-600 border-orange-200 font-bold"
                                                            }`}>
                                                                {member.mfa}
                                                            </span>
                                                        </td>

                                                        {/* LAST LOGIN Column (Visible on lg+) */}
                                                        <td className="px-6 py-4 hidden lg:table-cell text-muted font-medium">
                                                            {member.lastLogin}
                                                        </td>

                                                        {/* ADDED Column (Visible on xl+) */}
                                                        <td className="px-6 py-4 hidden xl:table-cell text-muted font-medium">
                                                            {member.added}
                                                        </td>

                                                        {/* ACTIONS Column */}
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="inline-flex items-center gap-3 relative">
                                                                <button
                                                                    onClick={() => openEditModal(member)}
                                                                    className="text-accent hover:underline text-xs font-bold transition-all cursor-pointer"
                                                                >
                                                                    Edit
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveDropdownId(activeDropdownId === member.id ? null : member.id);
                                                                    }}
                                                                    className="p-1 hover:bg-page rounded text-muted hover:text-text transition-colors cursor-pointer"
                                                                >
                                                                    <MoreHorizontal size={16} strokeWidth={2.5} />
                                                                </button>

                                                                {/* Custom dropdown popover */}
                                                                {activeDropdownId === member.id && (
                                                                    <div className="absolute right-0 top-7 bg-card border border-border rounded shadow-lg py-1.5 z-20 min-w-[160px] text-left text-xs animate-fade-in">
                                                                        <button
                                                                            onClick={() => toggleActiveStatus(member)}
                                                                            className="w-full px-4 py-2 text-text hover:bg-page transition-colors text-left flex items-center gap-2"
                                                                        >
                                                                            <Shield size={14} className="text-muted" />
                                                                            Toggle Active
                                                                        </button>
                                                                        <button
                                                                            onClick={() => toggleMfaStatus(member)}
                                                                            className="w-full px-4 py-2 text-text hover:bg-page transition-colors text-left flex items-center gap-2"
                                                                        >
                                                                            <Key size={14} className="text-muted" />
                                                                            Toggle MFA
                                                                        </button>
                                                                        <div className="h-[1px] bg-border my-1" />
                                                                        <button
                                                                            onClick={() => handleDeleteStaff(member.id)}
                                                                            className="w-full px-4 py-2 text-danger hover:bg-red-50 hover:text-red-700 transition-colors text-left flex items-center gap-2 font-bold"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                            Delete Staff
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center text-sm text-muted">
                                                    No internal staff members match your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: ROLES SECTION */}
            {activeTab === "Roles" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 animate-fade-in">
                    {Object.values(ROLES_INFO).map((role) => {
                        const count = localStaff.filter(s => s.role.toLowerCase() === role.name.toLowerCase()).length;
                        return (
                            <div 
                                key={role.name} 
                                className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col justify-between gap-5 hover:border-accent/35 transition-colors"
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Role Header tag */}
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-block px-3 py-1 border text-xs font-bold rounded ${role.badgeStyle}`}>
                                            {role.name}
                                        </span>
                                        <span className="text-[12px] text-muted font-bold">
                                            {count} {count === 1 ? "staff member" : "staff members"}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[13px] text-muted leading-relaxed mt-1">
                                        {role.description}
                                    </p>
                                </div>

                                {/* Permissions subset list */}
                                <div className="flex flex-col gap-2 pt-2 border-t border-border/70">
                                    <h4 className="text-[11px] uppercase font-bold tracking-wider text-muted">
                                        Authorized Scope
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {role.permissions.map((perm) => (
                                            <span 
                                                key={perm} 
                                                className="bg-page border border-border text-[11px] px-2 py-0.5 rounded text-muted font-semibold"
                                            >
                                                {perm}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL: ADD STAFF */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[3px] z-[999] flex items-center justify-center p-4">
                    <div 
                        className="bg-card w-full max-w-md rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-page/40">
                            <h3 className="font-bold text-[16px] text-text flex items-center gap-2">
                                <ShieldAlert size={18} className="text-accent" />
                                Add Staff Member
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleAddStaff} className="p-6 flex flex-col gap-4 text-xs">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-danger p-3 rounded-md flex items-start gap-2 text-xs font-semibold leading-normal">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Name Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Arash Behnia"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                                    <input
                                        type="email"
                                        placeholder="e.g. arash@arkaisolutions.com.au"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role Dropdown Selector */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    System Role
                                </label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                >
                                    {Object.keys(ROLES_INFO).map((roleName) => (
                                        <option key={roleName} value={roleName}>
                                            {roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status & MFA Controls row */}
                            <div className="grid grid-cols-2 gap-4 mt-1">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-muted uppercase tracking-wide">
                                        Account Status
                                    </label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-muted uppercase tracking-wide">
                                        MFA Status
                                    </label>
                                    <select
                                        value={formMfa}
                                        onChange={(e) => setFormMfa(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                    >
                                        <option value="Not set up">Not set up</option>
                                        <option value="Enabled">Enabled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer buttons */}
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-border mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-border text-muted hover:text-text rounded-md hover:bg-page transition-colors cursor-pointer font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md transition-colors cursor-pointer font-bold"
                                >
                                    Add Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT STAFF */}
            {isEditModalOpen && selectedStaff && (
                <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[3px] z-[999] flex items-center justify-center p-4">
                    <div 
                        className="bg-card w-full max-w-md rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-page/40">
                            <h3 className="font-bold text-[16px] text-text flex items-center gap-2">
                                <ShieldAlert size={18} className="text-accent" />
                                Edit Staff Member
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleEditStaff} className="p-6 flex flex-col gap-4 text-xs">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-danger p-3 rounded-md flex items-start gap-2 text-xs font-semibold leading-normal">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Name Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                                    <input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role Dropdown Selector */}
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-muted uppercase tracking-wide">
                                    System Role
                                </label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                >
                                    {Object.keys(ROLES_INFO).map((roleName) => (
                                        <option key={roleName} value={roleName}>
                                            {roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status & MFA Controls row */}
                            <div className="grid grid-cols-2 gap-4 mt-1">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-muted uppercase tracking-wide">
                                        Account Status
                                    </label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-muted uppercase tracking-wide">
                                        MFA Status
                                    </label>
                                    <select
                                        value={formMfa}
                                        onChange={(e) => setFormMfa(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded-md focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 text-xs font-medium"
                                    >
                                        <option value="Not set up">Not set up</option>
                                        <option value="Enabled">Enabled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer buttons */}
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-border mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-border text-muted hover:text-text rounded-md hover:bg-page transition-colors cursor-pointer font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md transition-colors cursor-pointer font-bold"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute("/staff")({
    component: RouteComponent
});
