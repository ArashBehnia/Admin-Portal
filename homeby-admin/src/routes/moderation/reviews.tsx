import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    Search,
    Loader2,
    Star,
    AlertTriangle,
    X,
    Check,
    Ban,
    Flag,
    ShieldAlert,
    MessageSquare,
} from "lucide-react";

type ReviewStatus = "Pending" | "Approved" | "Rejected" | "Flagged for legal";

type Review = {
    id: string;
    reviewerName: string;
    reviewerEmail: string;
    agentName: string;
    agencyName: string;
    rating: number;
    comment: string;
    submittedAt: string;
    hasRisk: boolean;
    riskReason: string;
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
                <div className="bg-card border border-borderrounded shadow-sm p-5 flex flex-col justify-between">
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

            {/* Detail Drawer / Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-text/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="text-accent" size={18} />
                                <h2 className="text-base font-bold text-text">Review Moderation Details</h2>
                            </div>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="text-muted hover:text-text transition-colors p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
                            {/* Summary Columns */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Reviewer</span>
                                    <p className="font-bold text-text text-base">
                                        {selectedReview.reviewerName || "Anonymous User"}
                                    </p>
                                    <p className="text-xs text-muted font-medium">
                                        {selectedReview.reviewerEmail || "No email provided (Anonymous submission)"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Target Agent</span>
                                    <p className="font-bold text-text text-base">
                                        {selectedReview.agentName}
                                    </p>
                                    <p className="text-xs text-muted font-medium">
                                        {selectedReview.agencyName}
                                    </p>
                                </div>
                            </div>

                            {/* Rating and date row */}
                            <div className="grid grid-cols-2 gap-6 border-t border-border pt-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Rating</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {renderStars(selectedReview.rating, 18)}
                                        <span className="text-xs font-bold text-text">({selectedReview.rating} out of 5)</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Submitted</span>
                                    <p className="font-bold text-text/80 mt-0.5">
                                        {selectedReview.submittedAt}
                                    </p>
                                </div>
                            </div>

                            {/* Full Comment */}
                            <div className="border-t border-border pt-4 space-y-2">
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">Review Content</span>
                                <div className="bg-page/50 border border-border/80 rounded-lg p-4 font-medium text-text text-sm leading-relaxed whitespace-pre-wrap">
                                    "{selectedReview.comment}"
                                </div>
                            </div>

                            {/* Defamation Risk Alert */}
                            {selectedReview.hasRisk && (
                                <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-4 flex gap-3">
                                    <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={18} />
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-danger uppercase tracking-wider">Flagged Risk Alert</h4>
                                        <p className="text-xs text-rose-800 leading-relaxed font-medium">
                                            {selectedReview.riskReason}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Current Moderation Status Banner */}
                            <div className="flex items-center gap-3 border-t border-border pt-4">
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">Current status:</span>
                                <span className={`px-2.5 py-0.5 rounded text-xs font-bold inline-block ${getStatusStyles(selectedReview.status)}`}>
                                    {selectedReview.status}
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="px-6 py-4 border-t border-border bg-page/30 flex flex-wrap gap-2 justify-between items-center shrink-0">
                            <div>
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="px-4 py-2 border border-border rounded-md text-xs font-bold text-muted hover:text-text hover:bg-page transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="flex gap-2">
                                {/* Flag button */}
                                {selectedReview.status !== "Flagged for legal" && (
                                    <button
                                        onClick={() => updateReviewStatus(selectedReview.id, "Flagged for legal")}
                                        className="px-3.5 py-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-md text-xs font-bold hover:bg-orange-100 transition-colors flex items-center gap-1.5"
                                    >
                                        <Flag size={14} />
                                        Flag for Legal
                                    </button>
                                )}

                                {/* Reject button */}
                                {selectedReview.status !== "Rejected" && (
                                    <button
                                        onClick={() => updateReviewStatus(selectedReview.id, "Rejected")}
                                        className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-danger rounded-md text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                                    >
                                        <Ban size={14} />
                                        Reject
                                    </button>
                                )}

                                {/* Approve button */}
                                {selectedReview.status !== "Approved" && (
                                    <button
                                        onClick={() => updateReviewStatus(selectedReview.id, "Approved")}
                                        className="px-3.5 py-2 bg-success text-card rounded-md text-xs font-bold hover:bg-success/90 transition-colors flex items-center gap-1.5"
                                    >
                                        <Check size={14} />
                                        Approve Review
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute("/moderation/reviews")({
    component: ReviewModerationComponent,
});
