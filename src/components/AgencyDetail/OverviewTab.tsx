import {
    ActivityEvent,
    Portal,
} from "@/actions/agenciesActions";
import { AgencyTab } from "@/actions/agenciesActions";
import { AgencyOnboardingStepDto } from "@/types/agencyTypes";
import type { NoteItem } from "@/hooks/useAgencyDetail";

interface OverviewTabProps {
    activityTimeline: ActivityEvent[];
    distributionPortals: Portal[];
    notes: NoteItem[];
    crmProvider: string;
    feedLastSynced: string;
    onEditNotesClick: (tab: AgencyTab) => void;
    onboardingSteps: AgencyOnboardingStepDto[];
    onboardingCurrentStep: string;
}

const STEP_COLORS: Record<string, { bar: string; label: string }> = {
    completed: { bar: "bg-green-500", label: "text-green-600" },
    current: { bar: "bg-accent", label: "text-accent" },
    pending: { bar: "bg-border", label: "text-muted" },
};

const OverviewTab = ({
    activityTimeline,
    distributionPortals,
    notes,
    crmProvider,
    feedLastSynced,
    onEditNotesClick,
    onboardingSteps,
    onboardingCurrentStep,
}: OverviewTabProps) => {
    const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;
    return (
        <div className="flex flex-col gap-5">
            {/* Top Row: Onboarding + Activity Timeline */}
            <div className="flex flex-col lg:flex-row gap-5 items-stretch">
                {/* Onboarding status */}
                <div className="flex-1 bg-card border border-border rounded shadow-sm p-5 flex flex-col gap-6">
                    <h2 className="text-[14px] font-bold text-text">
                        Onboarding status
                    </h2>

                    <div className="flex gap-1">
                        {onboardingSteps.map((step, i) => {
                            const colors = STEP_COLORS[step.status] ?? STEP_COLORS.pending;
                            return (
                                <div
                                    key={step.key || `step-${i}`}
                                    className="flex-1 flex flex-col gap-1.5 relative"
                                >
                                    <div className={`h-1.5 w-full rounded-full ${colors.bar}`} />
                                    <span className={`text-[9px] font-bold ${colors.label}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}

                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-[11px] text-muted italic">Details coming soon</span>
                        <span className="px-1.5 py-0.5 rounded bg-page text-muted border border-border text-[9px] font-medium">Soon</span>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="w-full lg:w-[320px] bg-card border border-border rounded shadow-sm p-5 flex flex-col min-h-[300px]">
                    <h2 className="text-[14px] font-bold text-text mb-4 shrink-0">
                        Activity timeline
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2 relative max-h-[220px] [&::-webkit-scrollbar]:hidden">
                        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border z-0" />
                        <div className="flex flex-col gap-5 relative z-10">
                            {activityTimeline.map((event, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1 relative">
                                        <div className="w-3 h-3 rounded-full bg-card border-2 border-card shadow-sm flex items-center justify-center">
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[12px] font-medium text-text leading-snug">
                                            {event.title}
                                        </span>
                                        <span className="text-[11px] text-muted">
                                            {event.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Listing distribution */}
            <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col gap-4">
                <div className="flex flex-col">
                    <h2 className="text-[14px] font-bold text-text">
                        Listing distribution
                    </h2>
                    <p className="text-[11px] text-muted">
                        Portals this agency publishes listings to
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {distributionPortals.map((portal, i) => (
                        <div
                            key={portal?.name || `portal-${i}`}
                            className="border border-border rounded p-3 flex flex-col gap-2.5"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${portal?.color}`}
                                >
                                    {portal?.icon}
                                </div>
                                <span className="text-[12px] font-bold text-text">
                                    {portal?.name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className={`w-1 h-1 rounded-full ${portal?.active ? "bg-green-500" : "bg-border"}`}
                                    />
                                    <span className="text-[11px] text-text font-medium">
                                        {portal?.status}
                                    </span>
                                </div>
                                <span className="text-[11px] text-muted pl-2.5">
                                    {portal?.listings}
                                </span>
                            </div>
                            {!portal?.active && (
                                <button className="text-accent text-[11px] font-medium hover:underline self-start mt-1 cursor-pointer">
                                    Set up
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Internal notes */}
            <div className="bg-card border border-border rounded shadow-sm p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-bold text-text">
                        Internal notes
                    </h2>
                    <button
                        onClick={() => onEditNotesClick("Notes")}
                        className="text-accent text-[11px] font-medium hover:underline cursor-pointer"
                    >
                        Edit notes →
                    </button>
                </div>
                {lastNote ? (
                    <p className="text-[12px] text-muted leading-relaxed">
                        {lastNote.note}
                    </p>
                ) : (
                    <p className="text-[12px] text-muted leading-relaxed">
                        No internal notes yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;
