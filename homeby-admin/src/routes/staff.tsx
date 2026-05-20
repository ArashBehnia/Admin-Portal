/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Toast } from "../components/Toast";
import { 
    Search, 
    Plus, 
    X, 
    Loader2, 
    Check,
    MoreHorizontal, 
    AlertTriangle
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
    mobile?: string;
    activity?: string[];
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

    // Confirmation Popup Modal states
    const [showMfaConfirm, setShowMfaConfirm] = useState(false);
    const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

    // Permissions popup state
    const [isPermsModalOpen, setIsPermsModalOpen] = useState(false);
    const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<string>("Superadmin");


    // React Form states (controlled inputs)
    const [formFirstName, setFormFirstName] = useState("");
    const [formLastName, setFormLastName] = useState("");
    const [formMobile, setFormMobile] = useState("");
    const [sendWelcome, setSendWelcome] = useState(false);
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState("Admin");
    const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
    const [formMfa, setFormMfa] = useState<"Enabled" | "Not set up">("Not set up");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toast Message State
    const [toast, setToast] = useState<{
        title: string;
        message: string;
        type: "success" | "info" | "error";
        visible: boolean;
    }>({ title: "Success", message: "", type: "success", visible: false });

    // TanStack Query for Loading local JSON Database
    const { data: serverStaff = [], isLoading, isError } = useQuery<StaffMember[]>({
        queryKey: ["staffList"],
        queryFn: async () => {
            const response = await axios.get("/data/staff.json");
            return response.data;
        }
    });

    // TanStack Query for Roles definitions list
    const { data: rolesList = [] } = useQuery<any[]>({
        queryKey: ["rolesList"],
        queryFn: async () => {
            const response = await axios.get("/data/roles.json");
            return response.data;
        }
    });

    // TanStack Query for Role Permissions matrix table
    const { data: rolePermissionsData = [] } = useQuery<any[]>({
        queryKey: ["rolePermissionsData"],
        queryFn: async () => {
            const response = await axios.get("/data/role_permissions.json");
            return response.data;
        }
    });

    const [localPermissions, setLocalPermissions] = useState<any[]>([]);

    useEffect(() => {
        if (rolePermissionsData && rolePermissionsData.length > 0 && localPermissions.length === 0) {
            setLocalPermissions(JSON.parse(JSON.stringify(rolePermissionsData)));
        }
    }, [rolePermissionsData]);


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


    // Auto-hide Toast Notification tooltip after 4 seconds
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // Create / Add Staff Operation
    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formFirstName.trim()) {
            setFormError("First name is required.");
            return;
        }

        if (!formLastName.trim()) {
            setFormError("Last name is required.");
            return;
        }

        if (!formEmail.trim()) {
            setFormError("Email address is required.");
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

        // Prevent double clicking using a submitting state
        setIsSubmitting(true);

        // Simulate network loading for visual excellence (1000ms)
        setTimeout(() => {
            const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;
            const newStaff: StaffMember = {
                id: String(Date.now()),
                name: fullName,
                email: formEmail,
                role: formRole,
                status: "Active",
                mfa: "Not set up",
                lastLogin: "Never logged in",
                added: new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
            };

            setLocalStaff([newStaff, ...localStaff]);
            setIsAddModalOpen(false);
            setIsSubmitting(false);
            resetForm();

            // Display toast tooltip message in the bottom-right corner
            setToast({
                title: "Staff Member Added",
                message: `${fullName} has been added successfully as ${formRole}.`,
                type: "success",
                visible: true
            });
        }, 1000);
    };

    // Drawer Tab state for detailed staff view
    const [activeDrawerTab, setActiveDrawerTab] = useState<"Profile" | "Permissions" | "Activity">("Profile");

    // Open Right-Side Detail Drawer with current values
    const openEditModal = (staff: StaffMember) => {
        setSelectedStaff(staff);
        
        // Split full name dynamically into first and last name
        const nameParts = (staff.name || "").trim().split(/\s+/);
        const first = nameParts[0] || "";
        const last = nameParts.slice(1).join(" ") || "";
        
        setFormFirstName(first);
        setFormLastName(last);
        setFormEmail(staff.email || "");
        setFormMobile(staff.mobile || "");
        setFormRole(staff.role || "Admin");
        setFormStatus(staff.status || "Active");
        setFormMfa(staff.mfa || "Not set up");
        setFormError("");
        setActiveDrawerTab("Profile"); // Reset to profile tab
        setIsEditModalOpen(true); // Open the drawer
    };

    // Save Edit / Profile update in drawer
    const handleEditStaff = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!formFirstName.trim()) {
            setFormError("First name is required.");
            return;
        }

        if (!formLastName.trim()) {
            setFormError("Last name is required.");
            return;
        }

        if (!selectedStaff) return;

        const fullName = `${formFirstName.trim()} ${formLastName.trim()}`;

        // Prevent duplicate emails
        if (localStaff.some(s => s.email.toLowerCase() === formEmail.toLowerCase() && s.id !== selectedStaff.id)) {
            setFormError("A staff member with this email already exists.");
            return;
        }

        const updatedList = localStaff.map((s) => {
            if (s.id === selectedStaff.id) {
                return {
                    ...s,
                    name: fullName,
                    email: formEmail,
                    mobile: formMobile,
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

        // Show Toast notification in bottom right
        setToast({
            title: "Profile Updated",
            message: `${fullName}'s profile has been successfully updated.`,
            type: "success",
            visible: true
        });
    };

    const resetForm = () => {
        setFormFirstName("");
        setFormLastName("");
        setFormMobile("");
        setSendWelcome(false);
        setFormEmail("");
        setFormRole("Admin");
        setFormStatus("Active");
        setFormMfa("Not set up");
        setFormError("");
        setSelectedStaff(null);
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-content mx-auto pb-16 px-1 lg:px-4">
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
                                                                
                                                                <span className="p-1 text-muted select-none">
                                                                    <MoreHorizontal size={16} strokeWidth={2.5} />
                                                                </span>
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
                <div className="flex flex-col gap-6 mt-1 animate-fade-in select-none">
                    
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-[20px] text-text font-sans tracking-tight">
                            Role definitions
                        </h2>
                        <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">
                            Roles control what each staff member can access. Permissions are defined in code and apply to all users with that role.
                        </p>
                    </div>

                    {/* Roles list vertical stack */}
                    <div className="flex flex-col gap-4">
                        {rolesList.map((role: any) => {
                            // Dynamically count active staff members matching role slug (case-insensitive)
                            const count = localStaff.filter(
                                (s) => s.role.toLowerCase() === role.slug.toLowerCase()
                            ).length;

                            return (
                                <div
                                    key={role.id}
                                    className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col gap-4 hover:border-accent/25 transition-all"
                                >
                                    {/* Top Header Row */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 border text-xs font-bold rounded font-sans shadow-sm ${role.pillClass}`}>
                                                {role.name}
                                            </span>
                                            <span className="text-[13px] text-muted font-bold font-sans">
                                                • {count} {count === 1 ? "staff member" : "staff members"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedRoleForPerms(role.name);
                                                setIsPermsModalOpen(true);
                                            }}
                                            className="hidden md:flex text-xs font-bold text-accent hover:text-accent/80 transition-colors items-center gap-0.5 cursor-pointer font-sans"
                                        >
                                            View all permissions →
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[13px] text-muted font-medium leading-relaxed font-sans max-w-4xl">
                                        {role.description}
                                    </p>

                                    {/* Checklist grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-1">
                                        {role.features.map((feat: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-[13px] text-text font-sans font-medium">
                                                {/* Bold green checkmark */}
                                                <Check size={14} className="text-green-600 shrink-0" strokeWidth={3} />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile View all permissions link button at bottom */}
                                    <div className="block md:hidden mt-2 pt-3 border-t border-border/60">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedRoleForPerms(role.name);
                                                setIsPermsModalOpen(true);
                                            }}
                                            className="text-xs font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-0.5 cursor-pointer font-sans"
                                        >
                                            View all permissions →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer text */}
                    <div className="text-[13px] text-muted font-semibold font-sans mt-2 py-1 select-none">
                        Need a new role or custom permissions? Role definitions are managed in the codebase. Speak to your backend engineer to add or modify roles.
                    </div>
                </div>
            )}

            {/* MODAL: ADD STAFF */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4">
                    <div 
                        className="bg-card w-full max-w-[480px] rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 flex justify-between items-center bg-card">
                            <h3 className="font-bold text-lg text-text font-sans tracking-tight">
                                Add staff member
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleAddStaff} className="px-6 pb-6 flex flex-col gap-4 text-xs">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-danger p-3 rounded-md flex items-start gap-2 text-xs font-semibold leading-normal">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* First Name & Last Name (2 Column) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[13px] text-muted font-medium font-sans">
                                        First name <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formFirstName}
                                        onChange={(e) => setFormFirstName(e.target.value)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[13px] text-muted font-medium font-sans">
                                        Last name <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formLastName}
                                        onChange={(e) => setFormLastName(e.target.value)}
                                        className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Email address <span className="text-accent">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    placeholder=""
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                    required
                                />
                            </div>

                            {/* Mobile Number */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Mobile number
                                </label>
                                <input
                                    type="text"
                                    placeholder="+61 4XX XXX XXX"
                                    value={formMobile}
                                    onChange={(e) => setFormMobile(e.target.value)}
                                    className="w-full px-3 py-2 border border-border bg-card text-text rounded placeholder-muted/80 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                />
                            </div>

                            {/* Role Select Dropdown (Admin, Support, Reviewer, Content editor) */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] text-muted font-medium font-sans">
                                    Role <span className="text-accent">*</span>
                                </label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Support">Support</option>
                                    <option value="Reviewer">Reviewer</option>
                                    <option value="Content editor">Content editor</option>
                                </select>
                                <p className="text-[12px] text-muted leading-tight mt-1.5 font-sans">
                                    Superadmin role can only be assigned by existing superadmin after account creation.
                                </p>
                            </div>

                            {/* Send Welcome Email Checkbox */}
                            <div className="flex items-start gap-3 mt-1.5 select-none">
                                <input
                                    id="sendWelcomeEmail"
                                    type="checkbox"
                                    checked={sendWelcome}
                                    onChange={(e) => setSendWelcome(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent transition-colors cursor-pointer"
                                />
                                <label htmlFor="sendWelcomeEmail" className="flex flex-col gap-0.5 cursor-pointer">
                                    <span className="text-sm font-semibold text-text font-sans">
                                        Send welcome email
                                    </span>
                                    <span className="text-[12px] text-muted font-medium font-sans">
                                        Send login instructions to new staff member.
                                    </span>
                                </label>
                            </div>

                            {/* Modal Footer buttons */}
                            <div className="flex justify-end gap-3 pt-4 mt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-border text-muted hover:text-text rounded bg-white hover:bg-page font-bold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add staff"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RIGHT SIDE DRAWER: STAFF DETAIL */}
            {isEditModalOpen && selectedStaff && (
                <div 
                    className="fixed inset-0 bg-[#0F1115]/40 backdrop-blur-[2px] z-[999] flex justify-end"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div 
                        className="bg-card w-full max-w-[480px] h-full border-l border-border shadow-2xl overflow-hidden flex flex-col animate-slide-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Details */}
                        <div className="p-6 border-b border-border flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                {/* Initials avatar */}
                                <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-700 font-bold text-lg flex items-center justify-center select-none shrink-0 border border-purple-200">
                                    {(selectedStaff.name || "").trim().split(/\s+/).map(n => n[0]).join("").toUpperCase()}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="font-bold text-lg text-text tracking-tight font-sans">
                                        {selectedStaff.name}
                                    </h3>
                                    <span className="text-[13px] text-muted font-medium font-sans">
                                        {selectedStaff.email}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-block px-2.5 py-0.5 border text-xs font-semibold rounded bg-purple-50 text-purple-700 border-purple-200">
                                            {selectedStaff.role}
                                        </span>
                                        <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                            selectedStaff.status === "Active"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                            {selectedStaff.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-muted hover:text-text p-1.5 rounded hover:bg-page transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tab Bar */}
                        <div className="flex gap-6 border-b border-border px-6 mt-1 bg-page/10">
                            {(["Profile", "Permissions", "Activity"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveDrawerTab(tab)}
                                    className={`pb-3 pt-2 text-sm font-semibold border-b-2 transition-all relative ${
                                        activeDrawerTab === tab 
                                            ? "border-accent text-accent" 
                                            : "border-transparent text-muted hover:text-text"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* TAB 1: PROFILE CONTENT */}
                        {activeDrawerTab === "Profile" && (
                            <form onSubmit={handleEditStaff} className="flex-1 flex flex-col justify-between overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs">
                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 text-danger p-3 rounded flex items-start gap-2 text-xs font-semibold">
                                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                            <span>{formError}</span>
                                        </div>
                                    )}

                                    {/* First Name & Last Name (2 Column) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[13px] text-muted font-medium font-sans">
                                                First name
                                            </label>
                                            <input
                                                type="text"
                                                value={formFirstName}
                                                onChange={(e) => setFormFirstName(e.target.value)}
                                                className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors font-sans"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[13px] text-muted font-medium font-sans">
                                                Last name
                                            </label>
                                            <input
                                                type="text"
                                                value={formLastName}
                                                onChange={(e) => setFormLastName(e.target.value)}
                                                className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors font-sans"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input (Disabled/Readonly) */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[13px] text-muted font-medium font-sans">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            disabled
                                            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded text-sm font-medium cursor-not-allowed font-sans"
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[13px] text-muted font-medium font-sans">
                                            Mobile number
                                        </label>
                                        <input
                                            type="text"
                                            value={formMobile}
                                            onChange={(e) => setFormMobile(e.target.value)}
                                            placeholder="+61 4XX XXX XXX"
                                            className="w-full px-3 py-2 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors font-sans"
                                        />
                                    </div>

                                    {/* Role Dropdown */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[13px] text-muted font-medium font-sans">
                                            Role
                                        </label>
                                        <select
                                            value={formRole}
                                            onChange={(e) => setFormRole(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-border bg-card text-text rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-medium transition-colors font-sans"
                                        >
                                            <option value="Superadmin">Superadmin</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Support">Support</option>
                                            <option value="Reviewer">Reviewer</option>
                                            <option value="Content editor">Content editor</option>
                                        </select>
                                    </div>

                                    {/* Status Switch Toggle */}
                                    <div className="flex flex-col gap-1.5 mt-1 select-none">
                                        <span className="text-[13px] text-muted font-medium font-sans">
                                            Status
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormStatus(formStatus === "Active" ? "Inactive" : "Active")}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    formStatus === "Active" ? "bg-green-600" : "bg-slate-350"
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        formStatus === "Active" ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                            <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded ${
                                                formStatus === "Active"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-red-50 text-red-700 border-red-200"
                                            }`}>
                                                {formStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-border/50 my-2" />

                                    {/* Multi-factor Authentication Section */}
                                    <div className="flex flex-col gap-2">
                                        <h4 className="font-bold text-[14px] text-text font-sans">
                                            Multi-factor authentication
                                        </h4>
                                        <div className="flex items-center gap-2 text-[13px] text-muted">
                                            <span>Status:</span>
                                            <span className={`inline-block px-2 py-0.5 border text-xs font-semibold rounded ${
                                                formMfa === "Enabled"
                                                    ? "bg-green-50 text-green-700 border-green-200 font-sans"
                                                    : "bg-orange-50 text-orange-600 border-orange-200 font-sans font-bold"
                                            }`}>
                                                {formMfa}
                                            </span>
                                        </div>
                                        <div className="flex gap-2.5 mt-1 select-none">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowMfaConfirm(true);
                                                }}
                                                className="px-3 py-1.5 border border-border bg-white text-muted hover:text-text rounded text-xs font-bold hover:bg-page transition-colors cursor-pointer font-sans"
                                            >
                                                Reset MFA
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowRevokeConfirm(true);
                                                }}
                                                className="px-3 py-1.5 border border-border bg-white text-muted hover:text-text rounded text-xs font-bold hover:bg-page transition-colors cursor-pointer font-sans"
                                            >
                                                Revoke all sessions
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-border/50 my-1" />

                                    <p className="text-[12px] text-muted leading-tight mt-1 font-sans">
                                        Changes to superadmin accounts require re-authentication.
                                    </p>
                                </div>

                                {/* Save Button Footer */}
                                <div className="px-6 py-4 border-t border-border flex justify-end bg-page/20">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded font-bold text-sm transition-colors cursor-pointer font-sans shadow-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: PERMISSIONS CONTENT */}
                        {activeDrawerTab === "Permissions" && (
                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="font-bold text-[15px] text-text font-sans">
                                        Access permissions
                                    </h4>
                                    <p className="text-[12px] text-muted font-medium font-sans leading-relaxed">
                                        Permissions are defined by role and cannot be customised per user in this version.
                                    </p>
                                </div>

                                <div className="border border-border rounded overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-page border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider select-none">
                                                <th className="px-3 py-2.5">Permission</th>
                                                <th className="px-2 py-2.5 text-center">Superadmin</th>
                                                <th className="px-2 py-2.5 text-center">Admin</th>
                                                <th className="px-2 py-2.5 text-center">Support</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60 font-sans">
                                            {/* Category: Operations */}
                                            <tr className="bg-page/40 font-bold text-[11px] text-accent select-none">
                                                <td colSpan={4} className="px-3 py-1.5 uppercase tracking-wide">Operations</td>
                                            </tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">View agencies</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Edit agencies</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">View agents</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Approve applications</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">View integrations</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Retry feed sync</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">View vendors</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Edit vendors</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>

                                            {/* Category: Moderation */}
                                            <tr className="bg-page/40 font-bold text-[11px] text-accent select-none">
                                                <td colSpan={4} className="px-3 py-1.5 uppercase tracking-wide">Moderation</td>
                                            </tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Review moderation</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Approve reviews</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Flag for legal</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>

                                            {/* Category: Commercial */}
                                            <tr className="bg-page/40 font-bold text-[11px] text-accent select-none">
                                                <td colSpan={4} className="px-3 py-1.5 uppercase tracking-wide">Commercial</td>
                                            </tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">View billing</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-text font-bold">read</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Issue refunds</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Lead distribution</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>

                                            {/* Category: Content */}
                                            <tr className="bg-page/40 font-bold text-[11px] text-accent select-none">
                                                <td colSpan={4} className="px-3 py-1.5 uppercase tracking-wide">Content</td>
                                            </tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Insights CMS</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Email templates</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>

                                            {/* Category: System */}
                                            <tr className="bg-page/40 font-bold text-[11px] text-accent select-none">
                                                <td colSpan={4} className="px-3 py-1.5 uppercase tracking-wide">System</td>
                                            </tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Staff & Roles</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Audit Log</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Auth Settings</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Feature Flags</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                            <tr className="hover:bg-page/20"><td className="px-3 py-2 text-muted font-medium">Blocked IPs</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-green-600 font-bold">✓</td><td className="px-2 py-2 text-center text-muted">—</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-[12px] text-muted leading-tight font-medium font-sans bg-page/35 border border-border/80 rounded p-2 select-none">
                                    Role permissions are managed in code. Contact your developer to modify role definitions.
                                </p>
                            </div>
                        )}

                        {/* TAB 3: ACTIVITY CONTENT */}
                        {activeDrawerTab === "Activity" && (
                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                                <h4 className="font-bold text-[16px] text-text font-sans">
                                    Recent activity
                                </h4>
                                <div className="flex flex-col gap-4 relative border-l border-border/80 pl-4 ml-1.5 mt-2">
                                    {(selectedStaff.activity && selectedStaff.activity.length > 0 ? selectedStaff.activity : [
                                        "Approved agency application — James Wilson — Today 9:47am",
                                        "Updated notes — Ray White Bondi — Today 9:32am",
                                        "Approved review — David Kowalski — Yesterday 4:12pm",
                                        "Changed subscription tier — Belle Property → Premier — Yesterday 2:08pm",
                                        "Logged in — Today 9:14am",
                                        "Flagged review for legal — Robert Kim review — 2 days ago 11:33am",
                                        "Reset password — Atiye Afrasiabi — 3 days ago 9:15am",
                                        "Created vendor — BuildSafe Inspections — 28 Apr 2026",
                                        "Approved agency — First Home Buyers Melbourne — 25 Apr 2026",
                                        "Updated email template — agency-approved — 24 Apr 2026"
                                    ]).map((act, index) => {
                                        const parts = act.split(" — ");
                                        const actionName = parts[0] || "";
                                        const entityName = parts[1] || "";
                                        const timeLabel = parts[2] || "";

                                        return (
                                            <div key={index} className="flex flex-col gap-0.5 relative text-[13px]">
                                                {/* Timeline dot */}
                                                <span className="absolute -left-[21px] top-1.5 h-2 w-2 bg-accent border border-card rounded-full shadow-sm" />
                                                <div className="font-sans text-text leading-normal">
                                                    <span className="font-bold text-text">{actionName}</span>
                                                    {entityName && (
                                                        <>
                                                            <span className="text-muted/70 mx-1.5">—</span>
                                                            <span className="font-semibold text-muted">{entityName}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {timeLabel && (
                                                    <span className="text-[11px] text-muted/65 font-bold tracking-tight">
                                                        {timeLabel}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MFA RESET CONFIRMATION POPUP */}
            {showMfaConfirm && selectedStaff && (
                <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4 select-none animate-fade-in">
                    <div 
                        className="bg-card w-full max-w-[380px] rounded-lg border border-border shadow-2xl overflow-hidden p-6 flex flex-col gap-4 animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1.5">
                            <h3 className="font-bold text-[16px] text-text font-sans leading-snug">
                                Reset MFA for {selectedStaff.name}?
                            </h3>
                            <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">
                                They will need to re-enroll on next login.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowMfaConfirm(false)}
                                className="px-4 py-2 border border-border rounded text-muted hover:text-text hover:bg-page transition-colors text-xs font-bold cursor-pointer font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMfa("Not set up");
                                    // Update local state item immediately as well
                                    const updatedList = localStaff.map(s => {
                                        if (s.id === selectedStaff.id) {
                                            return { ...s, mfa: "Not set up" as const };
                                        }
                                        return s;
                                    });
                                    setLocalStaff(updatedList);
                                    
                                    setShowMfaConfirm(false);
                                    setToast({
                                        title: "MFA Reset Success",
                                        message: `Multi-factor authentication for ${selectedStaff.name} has been reset.`,
                                        type: "success",
                                        visible: true
                                    });
                                }}
                                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-xs font-bold transition-colors cursor-pointer font-sans shadow-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REVOKE ACTIVE SESSIONS CONFIRMATION POPUP */}
            {showRevokeConfirm && selectedStaff && (
                <div className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4 select-none animate-fade-in">
                    <div 
                        className="bg-card w-full max-w-[380px] rounded-lg border border-border shadow-2xl overflow-hidden p-6 flex flex-col gap-4 animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1.5">
                            <h3 className="font-bold text-[16px] text-text font-sans leading-snug">
                                Sign out all active sessions for {selectedStaff.name}?
                            </h3>
                            <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">
                                All devices will be signed out immediately.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowRevokeConfirm(false)}
                                className="px-4 py-2 border border-border rounded text-muted hover:text-text hover:bg-page transition-colors text-xs font-bold cursor-pointer font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRevokeConfirm(false);
                                    setToast({
                                        title: "Sessions Revoked",
                                        message: `All active sessions for ${selectedStaff.name} have been successfully revoked.`,
                                        type: "success",
                                        visible: true
                                    });
                                }}
                                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-xs font-bold transition-colors cursor-pointer font-sans shadow-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* READ-ONLY ROLE PERMISSIONS MATRIX POPUP */}
            {isPermsModalOpen && (() => {
                const isSuperadminActive = selectedRoleForPerms.toLowerCase() === "superadmin";
                const isAdminActive = selectedRoleForPerms.toLowerCase() === "admin";
                const isSupportActive = selectedRoleForPerms.toLowerCase() === "support";

                return (
                    <div 
                        className="fixed inset-0 bg-[#0F1115]/50 backdrop-blur-[2px] z-[999] flex items-center justify-center p-4 select-none animate-fade-in cursor-pointer"
                        onClick={() => setIsPermsModalOpen(false)}
                    >
                        <div 
                            className="bg-card w-full max-w-2xl rounded-lg border border-border shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh] cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 flex justify-between items-start bg-card">
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="font-bold text-[18px] text-text font-sans tracking-tight">
                                        Permissions — {selectedRoleForPerms}
                                    </h3>
                                    <p className="text-[13px] text-muted font-medium font-sans">
                                        Defined by role. Cannot be customised per user.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsPermsModalOpen(false)}
                                    className="text-muted hover:text-text p-1 rounded hover:bg-page transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Permissions Matrix Table Scrollable area */}
                            <div className="flex-1 overflow-y-auto max-h-[520px] scrollbar-thin pl-6 pr-6 pb-6 pt-2">
                                <div className="border border-border/80 rounded overflow-hidden shadow-sm overflow-x-auto md:overflow-x-visible scrollbar-thin">
                                    <table className="w-full min-w-[580px] md:min-w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-card border-b border-border/80 uppercase text-[10px] tracking-wider select-none text-muted/70">
                                                <th className="px-4 py-3 font-semibold text-left">Permission</th>
                                                <th className={`px-4 py-3 text-center transition-colors ${
                                                    isSuperadminActive ? "font-bold text-text bg-page/30" : "font-medium"
                                                }`}>
                                                    Superadmin
                                                </th>
                                                <th className={`px-4 py-3 text-center transition-colors ${
                                                    isAdminActive ? "font-bold text-text bg-page/30" : "font-medium"
                                                }`}>
                                                    Admin
                                                </th>
                                                <th className={`px-4 py-3 text-center transition-colors ${
                                                    isSupportActive ? "font-bold text-text bg-page/30" : "font-medium"
                                                }`}>
                                                    Support
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {localPermissions.map((category: any) => {
                                                return (
                                                    <Fragment key={category.category}>
                                                        {/* Category Header Row (styled exactly like image: OPERATIONS, MODERATION, etc.) */}
                                                        <tr className="bg-page/40 font-bold text-[10px] text-muted select-none">
                                                            <td colSpan={4} className="px-4 py-2.5 uppercase tracking-wider text-slate-400/90 font-bold bg-[#F8FAFC]">
                                                                {category.category}
                                                            </td>
                                                        </tr>
                                                        {category.permissions.map((perm: any) => {
                                                            return (
                                                                <tr key={perm.id} className="hover:bg-page/10 transition-colors">
                                                                    <td className="px-4 py-3 text-slate-700 font-medium text-[13px]">
                                                                        {perm.name}
                                                                    </td>
                                                                    
                                                                    {/* Superadmin column */}
                                                                    <td className={`px-4 py-3 text-center ${isSuperadminActive ? "bg-page/10" : ""}`}>
                                                                        {perm.superadmin === "✓" ? (
                                                                            <Check size={15} className="text-green-600 inline-block" strokeWidth={3} />
                                                                        ) : (
                                                                            <span className="text-muted/40 font-semibold">—</span>
                                                                        )}
                                                                    </td>

                                                                    {/* Admin column */}
                                                                    <td className={`px-4 py-3 text-center ${isAdminActive ? "bg-page/10" : ""}`}>
                                                                        {perm.admin === "✓" ? (
                                                                            <Check size={15} className="text-green-600 inline-block" strokeWidth={3} />
                                                                        ) : (
                                                                            <span className="text-muted/40 font-semibold">—</span>
                                                                        )}
                                                                    </td>

                                                                    {/* Support column */}
                                                                    <td className={`px-4 py-3 text-center ${isSupportActive ? "bg-page/10" : ""}`}>
                                                                        {perm.support === "✓" ? (
                                                                            <Check size={15} className="text-green-600 inline-block" strokeWidth={3} />
                                                                        ) : perm.support === "read" ? (
                                                                            <span className="text-muted font-bold text-[12px]">read</span>
                                                                        ) : (
                                                                            <span className="text-muted/40 font-semibold">—</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })()}

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

export const Route = createFileRoute("/staff")({
    component: RouteComponent
});
