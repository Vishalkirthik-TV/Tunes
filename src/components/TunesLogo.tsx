interface TunesLogoProps {
    className?: string;
    markClassName?: string;
}

export default function TunesLogo({ className = "", markClassName = "" }: TunesLogoProps) {
    return (
        <span className={`tunes-logo ${className}`.trim()}>
            <svg
                className={`tunes-logo-mark ${markClassName}`.trim()}
                viewBox="0 0 48 48"
                role="img"
                aria-label="Tunes"
            >
                <circle cx="24" cy="24" r="22.5" fill="var(--primary)" />
                <circle cx="24" cy="24" r="17.5" fill="none" stroke="var(--primary-foreground)" strokeOpacity=".5" strokeWidth="1" />
                <circle cx="24" cy="24" r="13.5" fill="none" stroke="var(--primary-foreground)" strokeOpacity=".34" strokeWidth="1" />
                <circle cx="24" cy="24" r="9" fill="none" stroke="var(--primary-foreground)" strokeOpacity=".5" strokeWidth="1" />
                <path d="M9 24h8m14 0h8M24 9v8m0 14v8" stroke="var(--primary-foreground)" strokeLinecap="round" strokeOpacity=".75" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="5" fill="var(--primary-foreground)" />
                <circle cx="24" cy="24" r="1.6" fill="var(--primary)" />
            </svg>
            <span className="tunes-logo-word">TUNES<span>.</span></span>
        </span>
    );
}
