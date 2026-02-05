interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <span className="glitch-text" aria-hidden="true">
        {text}
      </span>
      {text}
      <span className="glitch-text" aria-hidden="true">
        {text}
      </span>
    </div>
  );
};
