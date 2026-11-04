import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Headphones, Search, Sparkles } from "lucide-react";
import { getPopularTracks, searchTracks } from "@/services/jamendo";
import type { JamendoTrack } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import TunesLogo from "@/components/TunesLogo";
import "./LandingPage.css";

const slides = [
    {
        eyebrow: "A sound that outlives us",
        title: "Music has been\nfinding us for centuries.",
        description: "From the first strings to the loudest stages, every sound has a story.",
        image: "/images/listen-classical.png",
        artist: "The beginning",
        era: "THEN",
    },
    {
        eyebrow: "A little closer to the feeling",
        title: "Find your own\nkind of harmony.",
        description: "Follow the sound, find your people, and let the next song surprise you.",
        image: "/images/listen-ensemble.png",
        artist: "The gathering",
        era: "TOGETHER",
    },
    {
        eyebrow: "Turn it up. Stay a while.",
        title: "For the nights\nyou never forget.",
        description: "Discover independent artists and the tracks that hit a little different.",
        image: "/images/listen-rock.png",
        artist: "The loud years",
        era: "LOUDER",
    },
    {
        eyebrow: "The room becomes the song",
        title: "Feel every note\nlike you're there.",
        description: "A front-row seat to the artists making music their own.",
        image: "/images/listen-live.png",
        artist: "Right now",
        era: "LIVE",
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<JamendoTrack[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [trendingTracks, setTrendingTracks] = useState<JamendoTrack[]>([]);
    const [tracksLoading, setTracksLoading] = useState(true);
    const [tracksError, setTracksError] = useState(false);
    const [trendingAttempt, setTrendingAttempt] = useState(0);
    const { playTrackFromQueue } = usePlayerStore();
    const slide = slides[activeSlide];

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;
        const timeout = window.setTimeout(() => {
            controller.abort();
            if (!cancelled) {
                setTracksError(true);
                setTracksLoading(false);
            }
        }, 8000);

        getPopularTracks(6, controller.signal)
            .then((tracks) => {
                if (!cancelled) {
                    setTrendingTracks(tracks);
                    setTracksError(false);
                }
            })
            .catch((error: unknown) => {
                if (cancelled || controller.signal.aborted) return;
                console.error("Failed to load trending tracks:", error);
                setTracksError(true);
            })
            .finally(() => {
                window.clearTimeout(timeout);
                if (!cancelled && !controller.signal.aborted) setTracksLoading(false);
            });

        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [trendingAttempt]);

    useEffect(() => {
        const query = searchQuery.trim();
        if (query.length < 2) return;

        const controller = new AbortController();
        const timer = window.setTimeout(() => {
            searchTracks(query, 6, controller.signal)
                .then((tracks) => {
                    setSearchResults(tracks);
                    setSearchError(false);
                })
                .catch((error: unknown) => {
                    if (controller.signal.aborted) return;
                    console.error("Landing page search failed:", error);
                    setSearchResults([]);
                    setSearchError(true);
                })
                .finally(() => {
                    if (!controller.signal.aborted) setSearchLoading(false);
                });
        }, 350);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [searchQuery]);

    const moveSlide = (direction: number) => {
        setActiveSlide((current) => (current + direction + slides.length) % slides.length);
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = searchQuery.trim();
        navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    };

    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        setSearchResults([]);
        setSearchError(false);
        setSearchLoading(value.trim().length >= 2);
    };

    const handleTrackSelect = (track: JamendoTrack, queue: JamendoTrack[]) => {
        playTrackFromQueue(track, queue);
        navigate("/listen");
    };

    return (
        <main className="landing-page">
            <header className="landing-nav">
                <button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Tunes home">
                    <TunesLogo />
                </button>
                <nav className="landing-nav-links" aria-label="Main navigation">
                    <a href="#discover">Discover</a>
                    <a href="#about">Our story</a>
                    <button className="landing-nav-quiet" onClick={() => navigate("/listen")}>Open player</button>
                    <button className="landing-nav-cta" onClick={() => navigate("/listen")}>Start listening <ArrowRight size={15} /></button>
                </nav>
            </header>

            <section className="landing-hero" aria-roledescription="carousel" aria-label="Featured music stories">
                <div className="landing-hero-image" key={slide.image} style={{ backgroundImage: `url("${slide.image}")` }} />
                <div className="landing-hero-grain" />
                <div className="landing-hero-copy" key={slide.title}>
                    <p className="landing-eyebrow">{slide.eyebrow}</p>
                    <h1>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
                    <p className="landing-hero-description">{slide.description}</p>
                    <button className="landing-button landing-button-light" onClick={() => navigate("/listen")}>
                        Explore the sound <ArrowRight size={16} />
                    </button>
                </div>
                <div className="landing-hero-caption">
                    <span>{slide.artist}</span>
                    <small>{slide.era}</small>
                </div>
                <div className="landing-hero-controls">
                    <button aria-label="Previous slide" onClick={() => moveSlide(-1)}><ChevronLeft size={18} /></button>
                    <div className="landing-dots" role="group" aria-label="Choose featured story">
                        {slides.map((item, index) => (
                            <button
                                key={item.image}
                                aria-label={`Show story ${index + 1}: ${item.eyebrow}`}
                                aria-pressed={index === activeSlide}
                                className={index === activeSlide ? "is-active" : ""}
                                onClick={() => setActiveSlide(index)}
                            />
                        ))}
                    </div>
                    <button aria-label="Next slide" onClick={() => moveSlide(1)}><ChevronRight size={18} /></button>
                </div>
            </section>

            <section className="landing-discovery" id="discover">
                <div className="landing-search-wrap">
                    <form className="landing-search" onSubmit={handleSearch}>
                        <Search size={19} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => handleSearchInput(event.target.value)}
                            placeholder="Search artists, tracks, moods..."
                            aria-label="Search artists, tracks, and moods"
                            aria-expanded={searchQuery.trim().length >= 2}
                            aria-controls="landing-search-results"
                        />
                        <button type="submit">Search</button>
                    </form>
                    {searchQuery.trim().length >= 2 && (
                        <div className="landing-search-results" id="landing-search-results" role="list" aria-label="Track search results">
                            {searchLoading ? (
                                <p role="status">Searching tracks...</p>
                            ) : searchError ? (
                                <p role="status">Search is unavailable right now. Please try again.</p>
                            ) : searchResults.length ? (
                                searchResults.map((track) => (
                                    <button
                                        className="landing-search-result"
                                        key={track.id}
                                        role="listitem"
                                        onClick={() => handleTrackSelect(track, searchResults)}
                                    >
                                        <img src={track.image} alt="" loading="lazy" />
                                        <span><strong>{track.name}</strong><small>{track.artist_name}</small></span>
                                        <ArrowRight size={16} aria-hidden="true" />
                                    </button>
                                ))
                            ) : (
                                <p role="status">No tracks found.</p>
                            )}
                        </div>
                    )}
                    <p>One song can take you anywhere.</p>
                </div>

                <div className="landing-section-heading">
                    <div>
                        <p className="landing-eyebrow">THE RIGHT NOW</p>
                        <h2>Hear what’s<br className="landing-mobile-break" /> moving.</h2>
                    </div>
                    <button className="landing-text-link" onClick={() => navigate("/listen")}>
                        Explore all sounds <ArrowRight size={16} />
                    </button>
                </div>

                {tracksLoading ? (
                    <div className="landing-tracks-skeleton" aria-label="Loading featured tracks">
                        {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
                    </div>
                ) : tracksError ? (
                    <div className="landing-trend-message" role="status">
                        <p>Featured tracks took too long to load.</p>
                        <button
                            className="landing-retry-button"
                            onClick={() => {
                                setTracksError(false);
                                setTracksLoading(true);
                                setTrendingAttempt((attempt) => attempt + 1);
                            }}
                        >
                            Try again
                        </button>
                    </div>
                ) : trendingTracks.length ? (
                    <div className="landing-tracks">
                        {trendingTracks.slice(0, 6).map((track, index) => {
                            return (
                                <article className="landing-track" key={track.id}>
                                    <button
                                        className="landing-track-art"
                                        onClick={() => handleTrackSelect(track, trendingTracks)}
                                        aria-label={`Listen to ${track.name} on the player`}
                                    >
                                        <img src={track.image} alt="" loading="lazy" />
                                        <span><ArrowRight size={18} /></span>
                                    </button>
                                    <div className="landing-track-meta">
                                        <span className="landing-track-number">0{index + 1}</span>
                                        <button onClick={() => handleTrackSelect(track, trendingTracks)}>{track.name}</button>
                                        <small>{track.artist_name}</small>
                                    </div>
                                    <span className="landing-track-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="landing-trend-message" role="status">No featured tracks are available right now.</p>
                )}
            </section>

            <section className="landing-listening" id="about">
                <div className="landing-listening-copy">
                    <p className="landing-eyebrow">TAKE IT WITH YOU</p>
                    <h2>Never stop<br />listening.</h2>
                    <p>Good music doesn’t belong in one place. Find a new favorite, build your own world, and bring it wherever you go.</p>
                    <button className="landing-button landing-button-orange" onClick={() => navigate("/listen")}>
                        Find your next favorite <ArrowRight size={16} />
                    </button>
                </div>
                <div className="landing-listening-art" aria-hidden="true">
                    <img src="/images/listen-ensemble.png" alt="" />
                    <div className="landing-art-sticker"><Headphones size={24} /><span>MADE<br />TO FEEL</span></div>
                    <span className="landing-art-orbit landing-art-orbit-one" />
                    <span className="landing-art-orbit landing-art-orbit-two" />
                </div>
                <span className="landing-listening-footnote">PRESS PLAY / TUNE IN / REPEAT</span>
            </section>

            <section className="landing-creators">
                <div className="landing-creator-image">
                    <img src="/images/listen-live.png" alt="Musicians performing together on stage" loading="lazy" />
                    <span className="landing-image-label">SOUND IS BETTER TOGETHER · 01/04</span>
                </div>
                <div className="landing-creator-copy">
                    <p className="landing-eyebrow">FOR THE ONES WHO MAKE IT</p>
                    <h2>Make some<br />noise.</h2>
                    <p>Every voice starts somewhere. Tune in to independent artists, fresh ideas, and the next sound worth sharing.</p>
                    <button className="landing-button landing-button-outline" onClick={() => navigate("/listen")}>
                        Meet the music <ArrowRight size={16} />
                    </button>
                </div>
                <Sparkles className="landing-creator-spark" size={28} aria-hidden="true" />
            </section>

            <footer className="landing-footer">
                <button className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Tunes home">
                    <TunesLogo />
                </button>
                <p>A little more feeling in every frequency.</p>
                <button className="landing-back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Back to top <ArrowDown size={14} />
                </button>
                <span className="landing-copyright">© 2026 TUNES · MADE FOR THE LOVE OF SOUND</span>
            </footer>
        </main>
    );
}
