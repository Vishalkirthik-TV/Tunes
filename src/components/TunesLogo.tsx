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
                <circle cx="24" cy="24" r="22.5" fill="#1b1715" />
                <path d="M8.2 17.4a17 17 0 0 1 24.7-5.8M7 25.8a17 17 0 0 1 32-6.1M9.3 34.2a17 17 0 0 1 31-4.1" fill="none" stroke="#f3f0e9" strokeOpacity=".27" strokeWidth="1" />
                <path d="m36.6 8.7-5.8 5.8 1.8 1.8-3.6 3.6" fill="none" stroke="var(--primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <circle cx="24" cy="24" r="5.8" fill="var(--primary)" />
                <circle cx="24" cy="24" r="1.4" fill="#1b1715" />
            </svg>
            <span className="tunes-logo-word">TUNES<span>.</span></span>
        </span>
    );
}
