import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Toast } from "../../components/Toast";
import {
    Search,
    Loader2,
    Star,
    AlertTriangle,
    X,
    Check,
} from "lucide-react";

type ReviewStatus = "Pending" | "Approved" | "Rejected" | "Flagged for legal";

type RiskSignal = {
    title: string;
    description: string;
    isSafe: boolean;
};

type Review = {
    id: string;
    reviewerName: string;
    reviewerEmail: string;
    accountCreated?: string;
    reviewsSubmitted?: number;
    agentName: string;
    agencyName: string;
    property?: string;
    rating: number;
    comment: string;
    submittedAt: string;
    ip?: string;
    device?: string;
    agentApprovedReviews?: number;
    agentAverageRating?: number;
    previousFromReviewer?: string;
    hasRisk: boolean;
    riskReason: string;
    riskSignals?: RiskSignal[];
    status: ReviewStatus;
};

const ReviewModerationComponent = () => {
    const queryClient = useQueryClient();
    
    // Filters State
    const [activeTab, setActiveTab] = useState<ReviewStatus | "All">("Pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    
    // Modal State
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [drawerTab, setDrawerTab] = useState<"Review" | "Risk signals" | "History">("Review");
    
    // Action Confirmation Modal State
    const [actionModal, setActionModal] = useState<{
        type: "Approve" | "Reject";
        review: Review;
    } | null>(null);
    
    // Toast State
    const [toast, setToast] = useState<{
        title: string;
        message: string;
        type: "success" | "info" | "error";
        visible: boolean;
    }>({ title: "Success", message: "", type: "success", visible: false });
    
    const showToast = (title: string, message: string) => {
        setToast({ title, message, type: "success", visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    };

    // Fetch Reviews from Axios + Tanstack Query
    const {
        data: reviews = [],
        isLoading,
        isError,
    } = useQuery<Review[]>({
        queryKey: ["reviews"],
        queryFn: async () => {
            const response = await axios.get("/data/reviews.json");
            return response.data;
        },
    });

    // Handle review status updates in local cache
    const updateReviewStatus = (
        id: string,
        newStatus: ReviewStatus
    ) => {
        queryClient.setQueryData<Review[]>(["reviews"], (oldData) => {
            if (!oldData) return [];
            return oldData.map((rev) =>
                rev.id === id ? { ...rev, status: newStatus } : rev
            );
        });
        
        // If the modal is currently open and inspecting this review, update its modal state
        if (selectedReview && selectedReview.id === id) {
            setSelectedReview((prev) =>
                prev ? { ...prev, status: newStatus } : null
            );
        }
    };

    // Calculate Dynamic Counts
    // Pending review count: count of actual pending in state
    const pendingCount = reviews.filter((r) => r.status === "Pending").length;
    // Approved count: matches the 47 approved metric base
    const approvedCount = reviews.filter((r) => r.status === "Approved").length;
    // Rejected count: matches the 8 rejected metric base
    const rejectedCount = reviews.filter((r) => r.status === "Rejected").length;
    // Flagged count: matches the 2 flagged metric base
    const flaggedCount = reviews.filter((r) => r.status === "Flagged for legal").length;

    // Filtered Reviews computation
    const filteredReviews = useMemo(() => {
        return reviews.filter((rev) => {
            // 1. Status/Tab Filter
            const matchesStatus =
                activeTab === "All" || rev.status === activeTab;

            // 2. Rating Filter
            const matchesRating =
                selectedRating === null || rev.rating === selectedRating;

            // 3. Search query filter
            const lowerQuery = searchQuery.toLowerCase();
            const reviewerName = rev.reviewerName || "Anonymous";
            const matchesSearch =
                reviewerName.toLowerCase().includes(lowerQuery) ||
                rev.reviewerEmail.toLowerCase().includes(lowerQuery) ||
                rev.agentName.toLowerCase().includes(lowerQuery) ||
                rev.agencyName.toLowerCase().includes(lowerQuery) ||
                rev.comment.toLowerCase().includes(lowerQuery);

            return matchesStatus && matchesRating && matchesSearch;
        });
    }, [reviews, activeTab, selectedRating, searchQuery]);

    // Star renderer helper
    const renderStars = (rating: number, size = 16, onClick?: (r: number) => void) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        onClick={() => onClick?.(star)}
                        className={`${
                            star <= rating
                                ? "text-[#EAB308] fill-[#EAB308]"
                                : "text-[#E4E6EA] fill-transparent"
                        } ${onClick ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
                    />
                ))}
            </div>
        );
    };

    // Style helper for status badges
    const getStatusStyles = (status: ReviewStatus) => {
        switch (status) {
            case "Pending":
                return "bg-[#FFF9E6] border border-[#F5E0B3] text-[#D97706]";
            case "Approved":
                return "bg-emerald-50 border border-emerald-200 text-success";
            case "Rejected":
                return "bg-rose-50 border border-rose-200 text-danger";
            case "Flagged for legal":
                return "bg-orange-50 border border-orange-200 text-orange-600";
            default:
                return "bg-page border border-border text-muted";
        }
    };

    return (
        <div className="max-w-screen mx-auto space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text">Review Moderation</h1>
                <p className="text-sm text-muted mt-1">
                    Approve, reject or flag agent reviews before they appear publicly. Nothing publishes without admin approval.
                </p>
            </div>

            {/* Warning Alert banner */}
            <div className="bg-warning/10 border border-warning/20 rounded p-3.5 flex items-center gap-2.5">
                <AlertTriangle className="text-warning shrink-0" size={16} />
                <p className="text-xs text-warning leading-relaxed font-medium">
                    Reviews about real estate agents carry defamation risk under Australian law. All reviews require manual approval before publishing. When in doubt, flag for legal review.
                </p>
            </div>

            {/* KPI Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pending review */}
                <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                        <span>Pending review</span>
                    </div>
                    <p className="text-3xl font-bold text-text mt-1">
                        {isLoading ? "..." : pendingCount}
                    </p>
                </div>

                {/* Approved this month */}
                <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span>Approved this month</span>
                    </div>
                    <p className="text-3xl font-bold text-text mt-1">
                        {isLoading ? "..." : approvedCount}
                    </p>
                </div>

                {/* Rejected this month */}
                <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                        <span>Rejected this month</span>
                    </div>
                    <p className="text-3xl font-bold text-text mt-1">
                        {isLoading ? "..." : rejectedCount}
                    </p>
                </div>

                {/* Flagged for legal */}
                <div className="bg-card border border-border border-l-2 border-l-danger rounded shadow-sm p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[13px] text-muted font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                        <span>Flagged for legal</span>
                    </div>
                    <p className="text-3xl font-bold text-text mt-1">
                        {isLoading ? "..." : flaggedCount}
                    </p>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="space-y-4">
                {/* Tabs */}
                <div className="flex border-b border-border overflow-x-auto overflow-y-hidden whitespace-nowrap gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {([
                        { id: "Pending", label: "Pending" },
                        { id: "Approved", label: "Approved" },
                        { id: "Rejected", label: "Rejected" },
                        { id: "Flagged for legal", label: "Flagged for legal" },
                        { id: "All", label: "All" },
                    ] as const).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSelectedRating(null); // Reset rating filter on tab change for clean UX
                            }}
                            className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-[1px] ${
                                activeTab === tab.id
                                    ? "border-accent text-text"
                                    : "border-transparent text-muted hover:text-text"
                            }`}
                        >
                            {tab.id === "Pending" ? (
                                <>
                                    Pending <span className="text-[#D97706] ml-1 font-bold">{pendingCount}</span>
                                </>
                            ) : (
                                tab.label
                            )}
                        </button>
                    ))}
                </div>

                {/* Search Bar & Ratings filter */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search reviewer, agent, agency or comment..."
                            className="w-full pl-10 pr-4 py-2 border border-border bg-card rounded-md text-sm text-text placeholder-muted/80 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Ratings Selector Row */}
                    <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {/* All Ratings */}
                        <button
                            onClick={() => setSelectedRating(null)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border shrink-0 ${
                                selectedRating === null
                                    ? "bg-text text-card border-text"
                                    : "bg-card text-muted border-border hover:bg-page hover:text-text"
                            }`}
                        >
                            All ratings
                        </button>

                        {/* Stars Buttons */}
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                                key={stars}
                                onClick={() => setSelectedRating(stars)}
                                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
                                    selectedRating === stars
                                        ? "bg-text text-card border-text"
                                        : "bg-card text-muted border-border hover:bg-page hover:text-text"
                                }`}
                            >
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={
                                                i < stars
                                                    ? "text-[#EAB308] fill-[#EAB308]"
                                                    : "text-[#E4E6EA] fill-transparent"
                                            }
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <div className="bg-rose-50 border border-rose-200 text-danger rounded-lg p-4 text-center text-sm">
                    Failed to load reviews. Please refresh the page.
                </div>
            )}

            {/* Table Container Card */}
            <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <span className="text-sm text-muted">Loading reviews...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-card text-[13px] text-muted font-medium">
                                    <th className="px-6 py-3 font-medium">Reviewer</th>
                                    <th className="px-6 py-3 font-medium">Agent reviewed</th>
                                    <th className="px-6 py-3 font-medium">Rating</th>
                                    <th className="px-6 py-3 font-medium">Comment</th>
                                    <th className="px-6 py-3 font-medium">Submitted</th>
                                    <th className="px-6 py-3 font-medium text-center">Risk</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((rev) => (
                                        <tr
                                            key={rev.id}
                                            className="hover:bg-page/20 transition-colors text-sm text-text"
                                        >
                                            {/* Reviewer */}
                                            <td className={`px-6 py-4 border-l-[3px] transition-all ${rev.hasRisk ? "border-l-[#D97706]" : "border-l-transparent"}`}>
                                                <div className="font-semibold text-text">
                                                    {rev.reviewerName || "Anonymous"}
                                                </div>
                                                {rev.reviewerEmail && (
                                                    <div className="text-xs text-muted font-medium mt-0.5">
                                                        {rev.reviewerEmail}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Agent reviewed */}
                                            <td className="px-6 py-4">
                                                <div className="font-base text-text">
                                                    {rev.agentName}
                                                </div>
                                                <div className="text-xs text-muted font-medium mt-0.5">
                                                    {rev.agencyName}
                                                </div>
                                            </td>

                                            {/* Rating */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {renderStars(rev.rating)}
                                            </td>

                                            {/* Comment */}
                                            <td className="px-6 py-4 max-w-[200px] sm:max-w-[200px] lg:max-w-[300px]">
                                                <div className="truncate text-text/80 text-sm font-normal">
                                                    {rev.comment}
                                                </div>
                                            </td>

                                            {/* Submitted */}
                                            <td className="px-6 py-4 text-muted whitespace-nowrap font-medium text-sm">
                                                {rev.submittedAt}
                                            </td>

                                            {/* Risk */}
                                            <td className="px-6 py-4 text-center">
                                                {rev.hasRisk ? (
                                                    <div className="inline-flex items-center justify-center text-[#D97706]" title={rev.riskReason}>
                                                        <AlertTriangle size={16} />
                                                    </div>
                                                ) : null}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-block ${getStatusStyles(rev.status)}`}>
                                                    {rev.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedReview(rev)}
                                                    className="text-accent hover:underline text-sm font-semibold transition-colors font-sans"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-16 text-center text-sm text-muted font-medium"
                                        >
                                            No reviews found matching the filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Drawer */}
            {selectedReview && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
                        onClick={() => {
                            setSelectedReview(null);
                            setDrawerTab("Review");
                        }}
                    />
                    
                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-card shadow-2xl flex flex-col z-[100] overflow-hidden border-l border-border transition-transform">
                        {/* Drawer Header */}
                        <div className="px-6 py-5 flex flex-col gap-3 relative shrink-0">
                            <button
                                onClick={() => {
                                    setSelectedReview(null);
                                    setDrawerTab("Review");
                                }}
                                className="absolute top-4 right-4 text-muted hover:text-text transition-colors p-1"
                            >
                                <X size={18} />
                            </button>

                            <div>
                                <h2 className="text-xl font-bold text-text">{selectedReview.reviewerName || "Anonymous User"}</h2>
                                <p className="text-[13px] text-muted mt-0.5">
                                    {selectedReview.reviewerEmail || "No email"} &middot; Submitted {selectedReview.submittedAt}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {renderStars(selectedReview.rating, 18)}
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusStyles(selectedReview.status)}`}>
                                    {selectedReview.status}
                                </span>
                            </div>
                        </div>

                        {/* Drawer Tabs */}
                        <div className="flex px-6 border-b border-border gap-6 shrink-0">
                            {(["Review", "Risk signals", "History"] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setDrawerTab(tab)}
                                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-[1px] ${
                                        drawerTab === tab
                                            ? "border-text text-text"
                                            : "border-transparent text-muted hover:text-text"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto">
                            {drawerTab === "Review" && (
                                <div className="p-6 space-y-8">
                                    {/* FULL REVIEW */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Full Review</h3>
                                        <div className="bg-page/50 rounded-lg p-4 font-medium text-text text-[14px] leading-relaxed whitespace-pre-wrap">
                                            {selectedReview.comment}
                                        </div>
                                    </div>

                                    {/* REVIEW DETAILS */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Review Details</h3>
                                        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-[14px]">
                                            <span className="text-muted">Reviewer</span>
                                            <span className="text-text">{selectedReview.reviewerName || "Anonymous"}</span>

                                            <span className="text-muted">Email</span>
                                            <span className="text-text">{selectedReview.reviewerEmail || "—"}</span>

                                            <span className="text-muted">Account created</span>
                                            <span className="text-text">{selectedReview.accountCreated || "—"}</span>

                                            <span className="text-muted">Reviews submitted</span>
                                            <span className="text-text">{selectedReview.reviewsSubmitted ?? "—"}</span>

                                            <span className="text-muted">Agent reviewed</span>
                                            <span className="text-text">{selectedReview.agentName}</span>

                                            <span className="text-muted">Agency</span>
                                            <span className="text-text">{selectedReview.agencyName}</span>

                                            <span className="text-muted">Property</span>
                                            <span className="text-text">{selectedReview.property || "—"}</span>

                                            <span className="text-muted">Rating</span>
                                            <span className="text-text flex items-center h-[20px]">{renderStars(selectedReview.rating, 14)}</span>

                                            <span className="text-muted">Submitted from IP</span>
                                            <span className="text-text">{selectedReview.ip || "—"}</span>

                                            <span className="text-muted">Device</span>
                                            <span className="text-text">{selectedReview.device || "—"}</span>
                                        </div>
                                    </div>

                                    {/* AGENT INFO */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Agent Info</h3>
                                        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-[14px]">
                                            <span className="text-muted">Agent name</span>
                                            <span className="text-text">{selectedReview.agentName}</span>

                                            <span className="text-muted">Agency</span>
                                            <span className="text-text">{selectedReview.agencyName}</span>

                                            <span className="text-muted">Approved reviews</span>
                                            <span className="text-text">{selectedReview.agentApprovedReviews ?? "—"}</span>

                                            <span className="text-muted">Average rating</span>
                                            <span className="text-text">{selectedReview.agentAverageRating ?? "—"}</span>

                                            <span className="text-muted">Previous from reviewer</span>
                                            <span className="text-text">{selectedReview.previousFromReviewer || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {drawerTab === "Risk signals" && (
                                <div className="p-6 space-y-6">
                                    <h3 className="text-[15px] font-bold text-text">Automated risk assessment</h3>
                                    
                                    <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                                        {selectedReview.riskSignals?.map((signal, idx) => (
                                            <div key={idx} className="p-4 flex items-start gap-3 bg-card">
                                                {signal.isSafe ? (
                                                    <div className="text-success mt-0.5 shrink-0 border border-success rounded-full p-0.5"><Check size={12} strokeWidth={3} /></div>
                                                ) : (
                                                    <div className="text-danger mt-0.5 shrink-0"><AlertTriangle size={16} /></div>
                                                )}
                                                <div>
                                                    <p className="text-[14px] font-semibold text-text">{signal.title}</p>
                                                    <p className="text-[13px] text-muted mt-0.5">{signal.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {!selectedReview.riskSignals && (
                                            <div className="p-4 text-[14px] text-muted text-center">No risk signals data available.</div>
                                        )}
                                    </div>

                                    {selectedReview.hasRisk ? (
                                        <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-4">
                                            <h4 className="text-[14px] font-bold text-danger">High risk</h4>
                                            <p className="text-[14px] text-rose-800 leading-relaxed font-medium mt-1">
                                                {selectedReview.riskReason}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                                            <h4 className="text-[14px] font-bold text-success">Low risk</h4>
                                            <p className="text-[14px] text-success/90 leading-relaxed font-medium mt-1">
                                                No automated concerns detected. Human review recommended before approving all reviews.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {drawerTab === "History" && (
                                <div className="p-6 text-center text-muted text-[14px]">
                                    History logs not available yet.
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="p-6 border-t border-border bg-card shrink-0 space-y-3">
                            <button
                                onClick={() => setActionModal({ type: "Approve", review: selectedReview })}
                                className="w-full py-2.5 bg-success text-card rounded text-[15px] font-bold hover:bg-success/90 transition-colors"
                            >
                                Approve & publish
                            </button>
                            
                            <button
                                onClick={() => setActionModal({ type: "Reject", review: selectedReview })}
                                className="w-full py-2.5 bg-card border border-border text-text rounded text-[15px] font-bold hover:bg-page transition-colors"
                            >
                                Reject review
                            </button>
                            
                            <button
                                onClick={() => {
                                    updateReviewStatus(selectedReview.id, "Flagged for legal");
                                    setSelectedReview(null);
                                    setDrawerTab("Review");
                                    showToast("Flagged for legal", "Review has been flagged for legal review.");
                                }}
                                className="w-full py-2.5 text-danger rounded text-[15px] font-normal hover:bg-rose-50/50 transition-colors"
                            >
                                Flag for legal review
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Action Confirmation Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-text/50 z-[200] flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                        {actionModal.type === "Approve" ? (
                            <>
                                <div className="p-6 space-y-3">
                                    <h3 className="text-[17px] font-bold text-text">Publish this review?</h3>
                                    <p className="text-[14px] text-muted">
                                        It will appear publicly on <span className="font-semibold text-text">{actionModal.review.agentName}</span>'s profile.
                                    </p>
                                </div>
                                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                                    <button
                                        onClick={() => setActionModal(null)}
                                        className="px-4 py-2 border border-border rounded text-[14px] font-semibold text-text bg-card hover:bg-page transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateReviewStatus(actionModal.review.id, "Approved");
                                            setActionModal(null);
                                            setSelectedReview(null);
                                            setDrawerTab("Review");
                                            showToast("Review Approved", "Review published successfully.");
                                        }}
                                        className="px-4 py-2 bg-success text-card rounded text-[14px] font-bold hover:bg-success/90 transition-colors"
                                    >
                                        Approve & publish
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                                    <h3 className="text-[17px] font-bold text-text">Reject review</h3>
                                    <button onClick={() => setActionModal(null)} className="text-muted hover:text-text">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-[14px] text-muted">
                                        Rejecting review by {actionModal.review.reviewerName || "Anonymous"} for {actionModal.review.agentName}.
                                    </p>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] text-muted font-medium">Reason</label>
                                        <select className="w-full border border-border bg-card rounded px-3 py-2 text-[14px] text-text focus:outline-none focus:border-accent">
                                            <option>Spam or fake review</option>
                                            <option>Inappropriate language</option>
                                            <option>Conflict of interest</option>
                                            <option>Defamation risk</option>
                                        </select>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[14px] text-muted font-medium">Notes (optional)</label>
                                        <textarea 
                                            rows={3} 
                                            className="w-full border border-border bg-card rounded px-3 py-2 text-[14px] text-text focus:outline-none focus:border-accent resize-none"
                                        ></textarea>
                                    </div>
                                    
                                    <label className="flex items-center gap-2 cursor-pointer mt-4">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border accent-accent" />
                                        <span className="text-[14px] text-text">Send rejection notice to reviewer</span>
                                    </label>
                                </div>
                                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                                    <button
                                        onClick={() => setActionModal(null)}
                                        className="px-4 py-2 border border-border rounded text-[14px] font-semibold text-text bg-card hover:bg-page transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateReviewStatus(actionModal.review.id, "Rejected");
                                            setActionModal(null);
                                            setSelectedReview(null);
                                            setDrawerTab("Review");
                                            showToast("Review Rejected", "Review has been rejected.");
                                        }}
                                        className="px-4 py-2 bg-danger text-card rounded text-[14px] font-bold hover:bg-rose-600 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

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

export const Route = createFileRoute("/moderation/reviews")({
    component: ReviewModerationComponent,
});
