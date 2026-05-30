import { Check, X, AlertTriangle, Info } from "lucide-react";

export interface ToastProps {
    visible: boolean;
    title: string;
    message: string;
    type?: "success" | "info" | "error";
    onClose: () => void;
}

const Toast = ({
    visible,
    title,
    message,
    type = "success",
    onClose,
}: ToastProps) => {
    if (!visible) return null;

    const renderIcon = () => {
        switch (type) {
            case "error":
                return <AlertTriangle size={15} strokeWidth={2.5} />;
            case "info":
                return <Info size={15} strokeWidth={2.5} />;
            case "success":
            default:
                return <Check size={15} strokeWidth={3} />;
        }
    };

    const iconColors = {
        success: "bg-success/10 text-success border border-success/20",
        error: "bg-danger/10 text-danger border border-danger/20",
        info: "bg-accent/10 text-accent border border-accent/20",
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl px-4 py-3.5 max-w-sm animate-slide-left select-none">
            <div
                className={`p-1.5 rounded-full shrink-0 flex items-center justify-center ${iconColors[type] ?? iconColors.success}`}
            >
                {renderIcon()}
            </div>
            <div className="flex-1 min-w-0 pr-1 font-sans">
                <h4 className="font-bold text-[13px] text-text">{title}</h4>
                <p className="text-[12px] text-muted mt-0.5 font-medium leading-tight truncate">
                    {message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-muted/80 hover:text-text p-0.5 rounded hover:bg-page transition-colors cursor-pointer"
            >
                <X size={14} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default Toast;
