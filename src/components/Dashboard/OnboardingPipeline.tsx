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

                <div className="mt-8 select-none">
                    <div className="flex">
                        {pipeline.stages.map((stage, idx) => (
                            <div key={idx} className="flex-1 text-center">
                                <span className="text-xs text-muted font-medium">
                                    {stage.stage}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mt-1">
                        {pipeline.stages.map((stage, idx) => (
                            <div
                                key={idx}
                                className="flex-1 flex items-center justify-center"
                            >
                                {idx > 0 && (
                                    <span className="text-muted/50 text-sm font-semibold mr-2">
                                        →
                                    </span>
                                )}
                                <span className="text-2xl font-bold text-text">
                                    {stage.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/50">
                <Link
                    href="/agencies"
                    className="text-xs text-warning hover:underline font-bold inline-flex items-center gap-1"
                >
                    <span>{pipeline.blockedMessage}</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
};

export default OnboardingPipeline;
