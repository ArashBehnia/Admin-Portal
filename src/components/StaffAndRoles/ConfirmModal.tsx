'use client';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, title, description, onCancel, onConfirm }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="overlay z-modal flex items-center justify-center p-4 select-none">
            <div className="bg-card w-full max-w-[380px] rounded-lg border border-border shadow-2xl p-6 flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-[16px] text-text font-sans leading-snug">{title}</h3>
                    <p className="text-[13px] text-muted font-medium font-sans leading-relaxed">{description}</p>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <button onClick={onCancel}
                        className="px-4 py-2 border border-border rounded text-muted hover:text-text hover:bg-page transition-colors text-xs font-bold cursor-pointer font-sans">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded text-xs font-bold transition-colors cursor-pointer font-sans shadow-sm">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;