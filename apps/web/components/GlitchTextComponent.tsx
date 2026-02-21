interface GlitchTextProps {
    text: string;
    className?: string;
}

export const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
    return (
        <div className={`glitch-wrapper inline-block ${className}`}>
            <span className="glitch-text" aria-hidden="true">
                {text}
            </span>
            <span>{text}</span>
            <span className="glitch-text" aria-hidden="true">
                {text}
            </span>
        </div>
    );
};
