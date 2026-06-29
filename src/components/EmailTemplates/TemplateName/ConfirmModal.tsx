"use client";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmLabel = "Yes",
    cancelLabel = "No",
    onConfirm,
    onCancel,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="overlay z-modal flex items-center justify-center p-4 select-none">
            <div
                onClick={onCancel}
                className="absolute inset-0"
            />
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-[420px] p-6 overflow-hidden font-sans">
                <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-text">{title}</h3>
                    <p className="text-sm text-muted">{message}</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-border hover:bg-page text-muted hover:text-text rounded-md text-sm font-semibold transition-all cursor-pointer font-sans"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-semibold transition-all shadow-sm cursor-pointer font-sans"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
