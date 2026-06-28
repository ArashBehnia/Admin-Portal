import React from "react";
import Link from "next/link";
import { OnboardingPipeline as OnboardingPipelineType } from "@/actions/dashboardActions";

interface OnboardingPipelineProps {
    pipeline: OnboardingPipelineType;
}

const OnboardingPipeline = ({ pipeline }: OnboardingPipelineProps) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div>
                <h2 className="text-[15px] font-bold text-text">
                    Agency onboarding pipeline
                </h2>
                <p className="text-xs text-muted mt-0.5">Counts by stage</p>

                <div className="mt-8 select-none overflow-x-auto overflow-y-hidden pb-2 [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-end justify-between min-w-[500px]">
                        {pipeline.stages.map((stage, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && (
                                    <div className="flex items-center justify-center pb-1.5 px-2">
                                        <span className="text-muted/50 text-lg font-medium">
                                            →
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2 flex-1 min-w-[70px]">
                                    <span className="text-[12px] text-muted font-semibold whitespace-nowrap">
                                        {stage.stage}
                                    </span>
                                    <span className="text-[32px] font-bold text-text leading-none tracking-tight">
                                        {stage.count}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/50">
                <Link
                    href="/agencies"
                    className="text-[13px] text-[#E05C00] hover:underline font-semibold inline-flex items-center gap-1"
                >
                    <span>{pipeline.blockedMessage}</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
};

export default OnboardingPipeline;
