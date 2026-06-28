"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Search,
    Bell,
    ChevronDown,
    User,
    Lock,
    LogOut,
    Building2,
    X,
    Menu,
    FileText,
    LayoutDashboard,
    Plug,
    UserCircle,
    ClipboardList,
    Mail,
    Shield,
    File,
    Upload,
    Ban,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

interface TopbarProps {
    onOpenSidebar: () => void;
}

type SearchItem = {
    id: string;
    name: string;
    type: string;
    path: string;
    icon: React.ElementType;
};

const searchablePages: SearchItem[] = [
    {
        id: "1",
        name: "Dashboard",
        type: "Page",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        id: "2",
        name: "Agencies",
        type: "Page",
        path: "/agencies",
        icon: Building2,
    },
    {
        id: "3",
        name: "Agents",
        type: "Page",
        path: "/agents",
        icon: UserCircle,
    },
    {
        id: "4",
        name: "Applications",
        type: "Page",
        path: "/applications",
        icon: ClipboardList,
    },
    {
        id: "5",
        name: "Property Reports",
        type: "Page",
        path: "/property-reports",
        icon: File,
    },
    {
        id: "6",
        name: "Ftp Requests",
        type: "Page",
        path: "/ftp-requests",
        icon: Upload,
    },
    {
        id: "7",
        name: "Blocked IPs",
        type: "Page",
        path: "/blocked-ips",
        icon: Ban,
    },
    {
        id: "8",
        name: "Staff & Roles",
        type: "Page",
        path: "/staff",
        icon: Shield,
    },
    {
        id: "9",
        name: "Email Templates",
        type: "Page",
        path: "/email-templates",
        icon: Mail,
    },
    {
        id: "10",
        name: "Integrations & Feed",
        type: "Page",
        path: "/integrations",
        icon: Plug,
    },
];

export const Topbar = ({ onOpenSidebar }: TopbarProps) => {
    const router = useRouter();
    const user = useUser();
    const { dynamicCrumb } = useBreadcrumb();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const profileRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const sessionName = typeof window !== "undefined" ? sessionStorage.getItem("userName") || "" : "";
    const sessionEmail = typeof window !== "undefined" ? sessionStorage.getItem("userEmail") || "" : "";
    const sessionRole = typeof window !== "undefined" ? sessionStorage.getItem("userRole") || "" : "";

    const name = sessionName ||
        (user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.email ||
              "Admin"
            : "Admin");
    const role = sessionRole || (user?.role as string) || "user";
    const userEmail = sessionEmail || user?.email || "admin@homeby.com.au";
    const userInitials = name
        ? name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
        : "AD";

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            sessionStorage.clear();
            router.push("/login");
        }
    }, [router]);

    const getBreadcrumbs = (pathname: string) => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length === 0) return ["Admin"];

        return segments.map((segment) => {
            if (/^\d+$/.test(segment) || segment.length > 20) {
                return dynamicCrumb || "Detail";
            }

            const formatted = segment
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

            if (formatted.toLowerCase() === "staff") return "Staff & Roles";
            return formatted;
        });
    };

    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === "Escape") {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isSearchOpen]);

    const filteredSearch = searchablePages.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <header className="sticky top-0 z-30 w-full h-[64px] bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenSidebar}
                        className="lg:hidden p-2 text-muted hover:bg-page rounded-md transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <nav className="flex items-center text-sm font-medium text-muted overflow-hidden">
                        {breadcrumbs.map((crumb, idx) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            const pathUpTo =
                                "/" +
                                pathname
                                    .split("/")
                                    .filter(Boolean)
                                    .slice(0, idx + 1)
                                    .join("/");
                            return (
                                <React.Fragment key={idx}>
                                    {idx > 0 && (
                                        <span className="mx-2 text-muted">
                                            /
                                        </span>
                                    )}
                                    {isLast ? (
                                        <span className="text-text font-medium">
                                            {crumb}
                                        </span>
                                    ) : (
                                        <Link
                                            href={pathUpTo}
                                            className="text-muted hover:text-text transition-colors"
                                        >
                                            {crumb}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden xl:flex items-center justify-between w-64 lg:w-96 px-3 py-1.5 bg-page border border-border rounded-md text-sm text-muted/65 hover:bg-page/80 hover:text-muted transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <Search size={16} className="text-muted/60" />
                            <span>Search users, agencies, agents...</span>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-card border border-border rounded text-muted/70">
                            ⌘K
                        </span>
                    </button>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="xl:hidden p-2 text-muted hover:bg-page rounded-md border border-border/80 transition-colors"
                    >
                        <Search size={18} />
                    </button>

                    <button
                        disabled
                        className="p-2 text-muted rounded-md border border-border/80 transition-colors relative opacity-50 cursor-not-allowed"
                    >
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-card" />
                    </button>

                    <div className="w-px h-5 bg-border/85 mx-1 hidden sm:block" />

                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1.5 border border-border rounded-md hover:bg-page transition-colors text-sm font-medium text-text cursor-pointer"
                        >
                            <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[11px] font-bold">
                                {userInitials}
                            </div>
                            <span className="hidden xl:inline-block max-w-[80px] truncate text-slate-700">
                                {name || "Admin"}
                            </span>
                            <ChevronDown size={14} className="text-muted/80" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg py-1 z-50 text-sm">
                                <div className="px-4 py-2 border-b border-border/60">
                                    <p className="font-semibold text-text truncate">
                                        {name || "Admin"}
                                    </p>
                                    <p className="text-xs text-muted truncate">
                                        {userEmail}
                                    </p>
                                    <span className="inline-block mt-1 text-[10px] font-semibold bg-page text-accent px-1.5 py-0.5 rounded capitalize">
                                        {role}
                                    </span>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="#"
                                        className="flex items-center gap-2.5 px-4 py-2 text-muted opacity-50 cursor-not-allowed pointer-events-none transition-colors"
                                    >
                                        <User size={16} />
                                        <span>Profile Link</span>
                                    </Link>
                                    <button
                                        disabled
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-muted opacity-50 cursor-not-allowed transition-colors text-left"
                                    >
                                        <Lock size={16} />
                                        <span>Change Password</span>
                                    </button>
                                </div>

                                <div className="border-t border-border/60 py-1">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-danger hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {isSearchOpen && (
                <div
                    className="fixed inset-0 bg-[#0F1115]/50 z-50 flex items-start justify-center pt-20 px-4 transition-opacity animate-fade-in"
                    onClick={() => setIsSearchOpen(false)}
                >
                    <div
                        className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-slide-down"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border/70">
                            <div className="flex items-center gap-3 flex-1">
                                <Search size={20} className="text-muted" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search users, agencies, agents..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="bg-transparent text-text outline-none text-base w-full placeholder-muted/65"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium px-1.5 py-0.5 bg-page border border-border rounded text-muted">
                                    esc
                                </span>
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1 text-muted hover:bg-page rounded transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 max-h-[350px] overflow-y-auto">
                            <h3 className="text-[11px] font-bold tracking-wider text-muted uppercase mb-3 px-2">
                                {searchQuery ? "SEARCH RESULTS" : "RECENT"}
                            </h3>
                            <div className="space-y-1">
                                {filteredSearch.length > 0 ? (
                                    filteredSearch.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={item.path as any}
                                            onClick={() =>
                                                setIsSearchOpen(false)
                                            }
                                            className="flex items-center justify-between p-2.5 rounded-md hover:bg-page transition-colors text-sm font-medium text-slate-700 hover:text-text"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon
                                                    size={16}
                                                    className="text-muted"
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-muted bg-page border border-border/80 px-2 py-0.5 rounded">
                                                {item.type}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted py-6 text-center">
                                        No results match your search
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Topbar;
