interface ComingSoonProps {
    title: string;
    description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
    return (
        <div className="bg-card border border-border rounded shadow-sm p-10 flex flex-col items-center justify-center text-center gap-3 opacity-60">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                Coming soon
            </span>
            <h3 className="text-[14px] font-bold text-text">{title}</h3>
            {description && (
                <p className="text-[12px] text-muted max-w-[360px]">
                    {description}
                </p>
            )}
        </div>
    );
};

export default ComingSoon;
