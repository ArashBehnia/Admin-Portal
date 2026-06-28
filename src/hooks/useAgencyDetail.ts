"use client";

import { useState, useEffect, useCallback } from "react";
import { AgencyTab, AgencyDetailData, AgentRow } from "@/actions/agenciesActions";
import { AgencyOnboardingStepDto } from "@/types/agencyTypes";
import api from "@/lib/axios";

export type NoteItem = {
    note: string;
    authorId: string;
    createdAt: string;
};

interface UseAgencyDetailProps {
    agencyId: string;
    detailData: AgencyDetailData;
}

const useAgencyDetail = ({ agencyId, detailData }: UseAgencyDetailProps) => {
    // ─── Tab State ────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<AgencyTab>("Overview");

    // ─── Detail Data State ────────────────────────────────────────────
    const [currentDetailData, setCurrentDetailData] = useState(detailData);
    const [isOverviewLoading, setIsOverviewLoading] = useState(false);
    const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    const [isDistributionLoading, setIsDistributionLoading] = useState(false);

    // ─── Onboarding State ─────────────────────────────────────────────
    const [onboardingSteps, setOnboardingSteps] = useState<AgencyOnboardingStepDto[]>(
        () => currentDetailData.onboardingSteps ?? [
            { key: "APPLIED", label: "APPLIED", status: "completed" },
            { key: "APPROVED", label: "APPROVED", status: "completed" },
            { key: "CRM CONNECTED", label: "CRM CONNECTED", status: "completed" },
            { key: "SYNCING", label: "SYNCING", status: "completed" },
            { key: "VALIDATION", label: "VALIDATION", status: "completed" },
        ]
    );
    const [onboardingCurrentStep, setOnboardingCurrentStep] = useState<string>("LIVE");

    // ─── Agents State ─────────────────────────────────────────────────
    const [agents, setAgents] = useState<AgentRow[]>(
        detailData?.agents ?? [],
    );
    const [isAgentsLoading, setIsAgentsLoading] = useState(false);

    // ─── Notes State ──────────────────────────────────────────────────
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [isNotesLoading, setIsNotesLoading] = useState(false);
    const [isNotesSaving, setIsNotesSaving] = useState(false);
    const [newNoteText, setNewNoteText] = useState("");

    // ─── Fetch notes from API ────────────────────────────────────────
    useEffect(() => {
        const fetchNotes = async () => {
            setIsNotesLoading(true);
            try {
                const res = await api.get(`/api/agencies/${agencyId}/notes`);
                const data = res.data;
                const items = Array.isArray(data?.notes) ? data.notes : [];
                setNotes(items);
            } catch (err) {
                console.error("Failed to fetch notes:", err);
            } finally {
                setIsNotesLoading(false);
            }
        };
        fetchNotes();
    }, [agencyId]);

    // ─── Add note via API ────────────────────────────────────────────
    const addNote = useCallback(async () => {
        if (!newNoteText.trim()) return;
        setIsNotesSaving(true);
        try {
            const res = await api.post(`/api/agencies/${agencyId}/notes`, {
                note: newNoteText.trim(),
            });
            const data = res.data;
            const updatedNotes = Array.isArray(data?.notes) ? data.notes : [];
            if (updatedNotes.length > 0) {
                setNotes(updatedNotes);
            } else {
                const fallback: NoteItem = {
                    note: newNoteText.trim(),
                    authorId: "",
                    createdAt: new Date().toISOString(),
                };
                setNotes((prev) => [...prev, fallback]);
            }
            setNewNoteText("");
        } catch (err) {
            console.error("Failed to add note:", err);
        } finally {
            setIsNotesSaving(false);
        }
    }, [agencyId, newNoteText]);

    // ─── Agents ───────────────────────────────────────────────────────
    const fetchAgents = useCallback(async () => {
        setIsAgentsLoading(true);
        try {
            const res = await api.get(
                `/api/agencies/${agencyId}/agents?limit=100`,
            );
            const data = res.data;
            const items = Array.isArray(data?.agents) ? data.agents : [];
            setAgents(items);
        } catch (err) {
            console.error("Failed to fetch agents:", err);
        } finally {
            setIsAgentsLoading(false);
        }
    }, [agencyId]);

    // ─── Tab Refresh Methods ──────────────────────────────────────────
    const refreshOverview = useCallback(async () => {
        setIsOverviewLoading(true);
        try {
            const res = await api.get(`/api/agencies/${agencyId}/overview`);
            const data = res.data;
            setCurrentDetailData((prev) => ({
                ...prev,
                abn: data?.abn ?? prev.abn,
                memberSince: data?.memberSince ?? prev.memberSince,
                crmProvider: data?.crmProvider ?? prev.crmProvider,
                feedLastSynced: data?.feedLastSynced ?? prev.feedLastSynced,
            }));
        } catch (err) {
            console.error("Failed to refresh overview:", err);
        } finally {
            setIsOverviewLoading(false);
        }
    }, [agencyId]);

    const refreshOnboarding = useCallback(async () => {
        setIsOnboardingLoading(true);
        try {
            const res = await api.get(`/api/agencies/${agencyId}/onboarding`);
            const data = res.data;
            if (data?.steps && Array.isArray(data.steps)) {
                setOnboardingSteps(data.steps);
            }
            if (data?.currentStep) {
                setOnboardingCurrentStep(data.currentStep);
            }
        } catch (err) {
            console.error("Failed to refresh onboarding:", err);
        } finally {
            setIsOnboardingLoading(false);
        }
    }, [agencyId]);

    const refreshActivity = useCallback(async () => {
        setIsActivityLoading(true);
        try {
            const res = await api.get(
                `/api/agencies/${agencyId}/activity?limit=20`,
            );
            const data = res.data;
            const events = data?.events ?? data?.data ?? [];
            if (Array.isArray(events)) {
                const mapped = events.map(
                    (e: { label?: string; title?: string; createdAt?: string; date?: string; type?: string }) => ({
                        title: String(e.label ?? e.title ?? ""),
                        date: String(e.createdAt ?? e.date ?? ""),
                        color:
                            e.type === "success"
                                ? "bg-green-500"
                                : e.type === "warning"
                                  ? "bg-orange-400"
                                  : e.type === "error"
                                    ? "bg-red-500"
                                    : "bg-accent",
                    }),
                );
                setCurrentDetailData((prev) => ({
                    ...prev,
                    activityTimeline: mapped,
                }));
            }
        } catch (err) {
            console.error("Failed to refresh activity:", err);
        } finally {
            setIsActivityLoading(false);
        }
    }, [agencyId]);

    const refreshListingDistribution = useCallback(async () => {
        setIsDistributionLoading(true);
        try {
            const res = await api.get(
                `/api/agencies/${agencyId}/listing-distribution`,
            );
            const data = res.data;
            const portals = data?.portals ?? data?.data ?? [];
            if (Array.isArray(portals)) {
                const mapped = portals.map(
                    (p: {
                        name?: string;
                        icon?: string;
                        color?: string;
                        status?: string;
                        listings?: string;
                        active?: boolean;
                    }) => ({
                        name: String(p.name ?? ""),
                        icon: String(p.icon ?? ""),
                        color: String(p.color ?? "text-muted bg-page"),
                        status: String(p.status ?? "Not connected"),
                        listings: String(p.listings ?? "0 published"),
                        active: Boolean(p.active),
                    }),
                );
                setCurrentDetailData((prev) => ({
                    ...prev,
                    distributionPortals: mapped,
                }));
            }
        } catch (err) {
            console.error("Failed to refresh listing distribution:", err);
        } finally {
            setIsDistributionLoading(false);
        }
    }, [agencyId]);

    // ─── Helpers ──────────────────────────────────────────────────────
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    return {
        activeTab,
        setActiveTab,
        detailData: currentDetailData,
        onboardingSteps,
        onboardingCurrentStep,
        notes,
        isNotesLoading,
        isNotesSaving,
        newNoteText,
        setNewNoteText,
        addNote,
        getInitials,
        agents,
        isAgentsLoading,
        fetchAgents,
        isOverviewLoading,
        isOnboardingLoading,
        isActivityLoading,
        isDistributionLoading,
        refreshOverview,
        refreshOnboarding,
        refreshActivity,
        refreshListingDistribution,
    };
};

export default useAgencyDetail;
