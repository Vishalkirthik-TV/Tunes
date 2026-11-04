import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Headphones, Search, Sparkles } from "lucide-react";
import { getPopularTracks, searchTracks } from "@/services/jamendo";
import type { JamendoTrack } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import TunesLogo from "@/components/TunesLogo";
import { motion } from "framer-motion";

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
    const { currentTrack, playTrackFromQueue } = usePlayerStore();
    const slide = slides[activeSlide];

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 8000);

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
        <main className={`min-h-screen overflow-hidden bg-[#11110f] font-sans text-[#f3f0e9]${currentTrack ? " pb-32" : ""}`}>
            <header className="mx-auto flex min-h-[88px] w-[calc(100%-64px)] max-w-[1240px] items-center justify-between max-[760px]:min-h-[70px] max-[760px]:w-[min(100%-36px,600px)] max-[390px]:w-[min(100%-28px,600px)]">
                <button className="inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-inherit [&_.tunes-logo]:text-[#f3f0e9] [&_.tunes-logo-mark]:h-[2.2rem] [&_.tunes-logo-mark]:w-[2.2rem] [&_.tunes-logo-word]:text-[0.95rem] max-[390px]:[&_.tunes-logo]:gap-2 max-[390px]:[&_.tunes-logo-mark]:h-[1.9rem] max-[390px]:[&_.tunes-logo-mark]:w-[1.9rem] max-[390px]:[&_.tunes-logo-word]:text-[0.8rem]" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Tunes home">
                    <TunesLogo />
                </button>
                <nav className="flex items-center gap-[clamp(18px,3vw,42px)] text-xs font-semibold max-[760px]:gap-3" aria-label="Main navigation">
                    <a className="text-[#d7d4ce] no-underline transition-colors hover:text-[#ff6138] max-[760px]:hidden" href="#discover">Discover</a>
                    <a className="text-[#d7d4ce] no-underline transition-colors hover:text-[#ff6138] max-[760px]:hidden" href="#about">Our story</a>
                    <button className="inline-flex min-h-[41px] cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-[17px] text-xs font-bold transition-[background-color,color,transform] duration-150 hover:text-[#ff6138] max-[760px]:hidden" onClick={() => navigate("/listen")}>Open player</button>
                    <button className="inline-flex min-h-[41px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#f3f0e9] bg-[#f3f0e9] px-[17px] text-xs font-bold text-[#171613] transition-transform duration-150 hover:-translate-y-0.5 max-[760px]:min-h-[37px] max-[760px]:px-[13px] max-[760px]:text-[10px] max-[390px]:min-h-[34px] max-[390px]:px-[10px] max-[390px]:text-[9px]" onClick={() => navigate("/listen")}>Start listening <ArrowRight size={15} /></button>
                </nav>
            </header>

            <section className="relative isolate mx-auto h-[clamp(360px,29.6vw,535px)] w-[min(82vw,1480px)] overflow-hidden rounded-[20px] bg-[#373631] max-[760px]:h-auto max-[760px]:min-h-[540px] max-[760px]:w-[min(100%-36px,600px)] max-[760px]:rounded-2xl max-[390px]:w-[min(100%-28px,600px)] max-[390px]:min-h-[500px]" aria-roledescription="carousel" aria-label="Featured music stories">
                <motion.div
                    className="absolute inset-0 -z-[2] bg-cover bg-[position:center_42%] max-[760px]:bg-[position:58%_center]"
                    key={slide.image}
                    style={{ backgroundImage: `url("${slide.image}")` }}
                    initial={{ opacity: 0.55, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.2, 0.75, 0.25, 1] }}
                />
                <div className="pointer-events-none absolute inset-0 -z-[1] bg-[linear-gradient(90deg,rgba(12,12,11,0.82)_0%,rgba(12,12,11,0.57)_39%,rgba(12,12,11,0.06)_76%),linear-gradient(0deg,rgba(12,12,11,0.53),transparent_34%,rgba(12,12,11,0.12))] max-[760px]:bg-[linear-gradient(90deg,rgba(12,12,11,0.72),rgba(12,12,11,0.1)),linear-gradient(0deg,rgba(12,12,11,0.58),transparent_45%,rgba(12,12,11,0.2))]" />
                <motion.div
                    className="absolute left-[clamp(30px,5vw,76px)] top-1/2 w-[min(76%,900px)] -translate-y-1/2 max-[760px]:bottom-[102px] max-[760px]:left-[22px] max-[760px]:top-auto max-[760px]:w-[calc(100%-44px)] max-[760px]:translate-y-0"
                    key={slide.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.2, 0.75, 0.25, 1] }}
                >
                    <p className="mb-[13px] text-[10px] font-extrabold tracking-[0.2em] text-[#ff6138]">{slide.eyebrow}</p>
                    <h1 className="m-0 h-[1.76em] text-[clamp(34px,4vw,62px)] font-black uppercase leading-[0.88] tracking-[-0.075em] max-[760px]:h-auto max-[760px]:text-[clamp(42px,11vw,67px)]">
                        {slide.title.split("\n").map((line) => <span className="block whitespace-nowrap max-[760px]:whitespace-normal" key={line}>{line}</span>)}
                    </h1>
                    <p className="mb-[17px] mt-[14px] h-[66px] max-w-[355px] text-sm leading-[22px] text-white/85 max-[760px]:mb-[19px] max-[760px]:mt-[15px] max-[760px]:h-auto max-[760px]:min-h-14 max-[760px]:max-w-[300px] max-[760px]:text-xs">{slide.description}</p>
                    <button className="inline-flex min-h-[45px] cursor-pointer items-center justify-center gap-3 rounded-full border border-transparent bg-[#f3f0e9] px-5 text-xs font-extrabold text-[#171613] transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5" onClick={() => navigate("/listen")}>
                        Explore the sound <ArrowRight size={16} />
                    </button>
                </motion.div>
                <div className="absolute bottom-[76px] right-8 flex flex-col items-end gap-1 text-xs font-bold max-[760px]:bottom-[38px] max-[760px]:right-5 max-[760px]:text-[10px]">
                    <span>{slide.artist}</span>
                    <small className="text-[9px] tracking-[0.17em] text-white/70">{slide.era}</small>
                </div>
                <div className="absolute bottom-6 right-1/2 flex -translate-x-1/2 translate-x-1/2 items-center gap-[18px] max-[760px]:bottom-[30px] max-[760px]:left-5 max-[760px]:right-auto max-[760px]:translate-x-0 max-[760px]:gap-2.5">
                    <button className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/45 bg-black/20 transition-colors hover:border-[#ff6138] hover:bg-[#ff6138] max-[760px]:h-7 max-[760px]:w-7" aria-label="Previous slide" onClick={() => moveSlide(-1)}><ChevronLeft size={18} /></button>
                    <div className="flex items-center gap-2" role="group" aria-label="Choose featured story">
                        {slides.map((item, index) => (
                            <button
                                key={item.image}
                                aria-label={`Show story ${index + 1}: ${item.eyebrow}`}
                                aria-pressed={index === activeSlide}
                                className={`h-[7px] cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-200 ${index === activeSlide ? "w-[23px] bg-[#ff6138]" : "w-[7px] bg-white/50"}`}
                                onClick={() => setActiveSlide(index)}
                            />
                        ))}
                    </div>
                    <button className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/45 bg-black/20 transition-colors hover:border-[#ff6138] hover:bg-[#ff6138] max-[760px]:h-7 max-[760px]:w-7" aria-label="Next slide" onClick={() => moveSlide(1)}><ChevronRight size={18} /></button>
                </div>
            </section>

            <section className="mx-auto w-[min(100%-64px,1240px)] py-[60px] pb-[74px] max-[760px]:w-[min(100%-36px,600px)] max-[760px]:py-11 max-[760px]:pb-[54px] max-[390px]:w-[min(100%-28px,600px)]" id="discover">
                <div className="relative mb-[78px] flex flex-col items-center max-[760px]:mb-[57px]">
                    <form className="flex min-h-[52px] w-full max-w-[495px] items-center gap-3 rounded-full border border-white/10 bg-[#242421] py-0 pl-[17px] pr-2 text-[#a9a69f] transition-[border-color,background-color] focus-within:border-[#ff6138b8] focus-within:bg-[#292824] max-[760px]:min-h-12" onSubmit={handleSearch}>
                        <Search size={19} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => handleSearchInput(event.target.value)}
                            placeholder="Search artists, tracks, moods..."
                            className="w-full min-w-0 border-0 bg-transparent text-[13px] text-[#f3f0e9] outline-none placeholder:text-[#99968e] max-[760px]:text-[11px] [&::-webkit-search-cancel-button]:invert"
                            aria-label="Search artists, tracks, and moods"
                            aria-expanded={searchQuery.trim().length >= 2}
                            aria-controls="landing-search-results"
                        />
                        <button className="min-h-9 cursor-pointer rounded-full border-0 bg-[#f3f0e9] px-[17px] text-[11px] font-extrabold text-[#161512] transition-colors hover:bg-[#ff6138]" type="submit">Search</button>
                    </form>
                    {searchQuery.trim().length >= 2 && (
                        <div className="absolute left-1/2 top-[60px] z-[5] w-full max-w-[495px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#211f1c] shadow-[0_16px_38px_rgba(0,0,0,0.35)]" id="landing-search-results" role="list" aria-label="Track search results">
                            {searchLoading ? (
                                <p role="status">Searching tracks...</p>
                            ) : searchError ? (
                                <p role="status">Search is unavailable right now. Please try again.</p>
                            ) : searchResults.length ? (
                                searchResults.map((track) => (
                                    <button
                                        className="flex min-h-16 w-full cursor-pointer items-center gap-3 border-0 border-b border-white/[0.08] bg-transparent px-3.5 py-2 text-left text-inherit transition-colors last:border-b-0 hover:bg-[#ff61381f] focus-visible:bg-[#ff61381f]"
                                        key={track.id}
                                        role="listitem"
                                        onClick={() => handleTrackSelect(track, searchResults)}
                                    >
                                        <img className="h-11 w-11 flex-none rounded-[5px] object-cover" src={track.image} alt="" loading="lazy" />
                                        <span className="grid min-w-0 gap-[3px]">
                                            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">{track.name}</strong>
                                            <small className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#a9a39a]">{track.artist_name}</small>
                                        </span>
                                        <ArrowRight className="ml-auto flex-none text-[#ff6138]" size={16} aria-hidden="true" />
                                    </button>
                                ))
                            ) : (
                                <p role="status">No tracks found.</p>
                            )}
                        </div>
                    )}
                    <p className="mb-0 mt-2.5 text-[11px] text-[#8d8a82]">One song can take you anywhere.</p>
                </div>

                <div className="mb-[27px] flex items-end justify-between max-[390px]:gap-2">
                    <div>
                        <p className="mb-[10px] text-[10px] font-extrabold tracking-[0.2em] text-[#ff6138]">THE RIGHT NOW</p>
                        <h2 className="m-0 text-[clamp(34px,4vw,50px)] font-black uppercase leading-[0.88] tracking-[-0.075em] max-[760px]:text-[clamp(36px,9vw,46px)]">Hear what’s<br className="hidden max-[390px]:inline" /> moving.</h2>
                    </div>
                    <button className="inline-flex cursor-pointer items-center gap-2.5 border-0 bg-transparent px-0 py-2 text-xs font-bold text-[#ccc8bf] max-[760px]:gap-[5px] max-[760px]:whitespace-nowrap max-[760px]:text-[10px] max-[390px]:max-w-[100px] max-[390px]:whitespace-normal max-[390px]:text-left" onClick={() => navigate("/listen")}>
                        Explore all sounds <ArrowRight className="text-[#ff6138] transition-transform duration-150 group-hover:translate-x-1" size={16} />
                    </button>
                </div>

                {tracksLoading ? (
                    <div className="grid grid-cols-3 gap-x-9 gap-y-3 max-[760px]:grid-cols-2 max-[760px]:gap-x-[18px]" aria-label="Loading featured tracks">
                        {Array.from({ length: 6 }, (_, index) => <span className="h-[92px] animate-pulse border-b border-white/10 bg-gradient-to-r from-[#1d1d1a] via-[#282824] to-[#1d1d1a]" key={index} />)}
                    </div>
                ) : tracksError ? (
                    <div className="py-[22px] text-[13px] text-[#a6a39b]" role="status">
                        <p className="mb-2.5 mt-0">Featured tracks took too long to load.</p>
                        <button
                            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-bold text-[#ff6138] hover:underline hover:underline-offset-[3px]"
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
                    <div className="grid grid-cols-3 gap-x-9 max-[760px]:grid-cols-2 max-[760px]:gap-x-[18px]">
                        {trendingTracks.slice(0, 6).map((track, index) => {
                            return (
                                <article className="group flex min-w-0 items-center gap-[13px] border-b border-white/10 py-[13px] max-[760px]:gap-[9px]" key={track.id}>
                                    <button
                                        className="group/art relative h-[66px] w-[66px] flex-none cursor-pointer overflow-hidden rounded border-0 bg-[#292824] p-0 max-[760px]:h-[52px] max-[760px]:w-[52px] max-[390px]:h-[45px] max-[390px]:w-[45px]"
                                        onClick={() => handleTrackSelect(track, trendingTracks)}
                                        aria-label={`Listen to ${track.name} on the player`}
                                    >
                                        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.08] group-focus-visible/art:scale-[1.08]" src={track.image} alt="" loading="lazy" />
                                        <span className="absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible/art:opacity-100"><ArrowRight size={18} /></span>
                                    </button>
                                    <div className="grid min-w-0 grid-cols-[25px_minmax(0,1fr)] items-center gap-x-[5px] max-[760px]:grid-cols-[19px_minmax(0,1fr)] max-[760px]:gap-x-[3px]">
                                        <span className="row-span-2 text-[10px] tabular-nums text-[#77746d] max-[390px]:text-[9px]">0{index + 1}</span>
                                        <button className="overflow-hidden border-0 bg-transparent p-0 text-left text-xs font-bold text-[#f3f0e9] hover:text-[#ff6138] max-[760px]:text-[10px] [text-overflow:ellipsis] whitespace-nowrap" onClick={() => handleTrackSelect(track, trendingTracks)}>{track.name}</button>
                                        <small className="col-start-2 mt-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#97948c] max-[760px]:text-[9px]">{track.artist_name}</small>
                                    </div>
                                    <span className="ml-auto flex h-[23px] items-center gap-0.5 opacity-70 max-[760px]:hidden" aria-hidden="true">
                                        {[7, 15, 21, 12, 21, 15, 7].map((height, waveIndex) => <i className="w-0.5 rounded-sm bg-[#ff6138]" style={{ height }} key={waveIndex} />)}
                                    </span>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-[22px] text-[13px] text-[#a6a39b]" role="status">No featured tracks are available right now.</p>
                )}
            </section>

            <section className="relative mx-auto mb-[84px] grid min-h-[500px] w-[min(100%-64px,1240px)] grid-cols-2 items-center overflow-hidden rounded-lg bg-[#e7e1d4] px-[clamp(28px,8vw,110px)] py-10 text-[#1a1916] max-[760px]:mb-[65px] max-[760px]:min-h-0 max-[760px]:w-[min(100%-36px,600px)] max-[760px]:grid-cols-1 max-[760px]:px-[26px] max-[760px]:pb-[26px] max-[760px]:pt-[38px] max-[390px]:w-[min(100%-28px,600px)]" id="about">
                <div className="relative z-[1]">
                    <p className="mb-[13px] text-[10px] font-extrabold tracking-[0.2em] text-[#be472b]">TAKE IT WITH YOU</p>
                    <h2 className="m-0 text-[clamp(48px,6vw,76px)] font-black uppercase leading-[0.88] tracking-[-0.075em] max-[760px]:text-[clamp(50px,13vw,70px)]">Never stop<br />listening.</h2>
                    <p className="mb-6 mt-5 max-w-[340px] text-sm leading-[1.65] text-[#555147]">Good music doesn’t belong in one place. Find a new favorite, build your own world, and bring it wherever you go.</p>
                    <button className="inline-flex min-h-[45px] cursor-pointer items-center justify-center gap-3 rounded-full border border-transparent bg-[#ff6138] px-5 text-xs font-extrabold text-[#171411] transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:bg-[#f24d26]" onClick={() => navigate("/listen")}>
                        Find your next favorite <ArrowRight size={16} />
                    </button>
                </div>
                <div className="relative grid min-h-[360px] place-items-center max-[760px]:mt-3 max-[760px]:min-h-[290px]" aria-hidden="true">
                    <img className="relative z-[1] aspect-square w-[min(100%,385px)] rotate-1 rounded-full object-cover [mix-blend-mode:multiply] max-[760px]:max-h-[270px] max-[760px]:w-[min(80%,300px)]" src="/images/listen-ensemble.png" alt="" />
                    <div className="absolute right-[2%] top-[18%] z-[2] flex h-[87px] w-[87px] rotate-[10deg] flex-col items-center justify-center gap-[5px] rounded-full bg-[#ff6138] text-center text-[8px] font-black tracking-[0.09em] text-[#161411] max-[760px]:right-[8%] max-[760px]:top-[10%] max-[760px]:h-[72px] max-[760px]:w-[72px]"><Headphones size={24} /><span>MADE<br />TO FEEL</span></div>
                    <span className="absolute h-[310px] w-[310px] rounded-full border border-[#1b181538] max-[760px]:h-[230px] max-[760px]:w-[230px]" />
                    <span className="absolute h-[250px] w-[390px] rotate-[-31deg] rounded-[50%] border border-[#1b181538] max-[760px]:h-[190px] max-[760px]:w-[300px]" />
                </div>
                <span className="absolute bottom-[21px] right-[23px] text-[8px] font-extrabold tracking-[0.15em] text-[#726d62] max-[760px]:bottom-3 max-[760px]:right-[15px] max-[760px]:text-[7px]">PRESS PLAY / TUNE IN / REPEAT</span>
            </section>

            <section className="relative mx-auto grid w-[min(100%-64px,1240px)] grid-cols-[1.1fr_0.9fr] items-center gap-[clamp(32px,7vw,90px)] py-3 pb-[92px] max-[760px]:w-[min(100%-36px,600px)] max-[760px]:grid-cols-1 max-[760px]:gap-[30px] max-[760px]:pb-[65px] max-[390px]:w-[min(100%-28px,600px)]">
                <div className="group relative min-h-[350px] overflow-hidden rounded-[5px] bg-[#27231f] max-[760px]:min-h-[280px]">
                    <img className="absolute inset-0 h-full w-full object-cover saturate-[0.78] transition-transform duration-500 group-hover:scale-[1.035]" src="/images/listen-live.png" alt="Musicians performing together on stage" loading="lazy" />
                    <span className="absolute bottom-[17px] left-[18px] border border-white/40 bg-[#11110f8c] px-2.5 py-[7px] text-[8px] tracking-[0.15em] text-white backdrop-blur-lg">SOUND IS BETTER TOGETHER · 01/04</span>
                </div>
                <div className="max-[760px]:pl-1">
                    <p className="mb-[14px] text-[10px] font-extrabold tracking-[0.2em] text-[#ff6138]">FOR THE ONES WHO MAKE IT</p>
                    <h2 className="m-0 text-[clamp(48px,6vw,76px)] font-black uppercase leading-[0.88] tracking-[-0.075em] max-[760px]:text-[clamp(50px,13vw,70px)]">Make some<br />noise.</h2>
                    <p className="mb-6 mt-[19px] max-w-[355px] text-sm leading-[1.7] text-[#a6a39b]">Every voice starts somewhere. Tune in to independent artists, fresh ideas, and the next sound worth sharing.</p>
                    <button className="inline-flex min-h-[45px] cursor-pointer items-center justify-center gap-3 rounded-full border border-white/50 bg-transparent px-5 text-xs font-extrabold text-[#f3f0e9] transition-[transform,background-color,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-[#ff6138] hover:bg-[#ff6138] hover:text-[#171411]" onClick={() => navigate("/listen")}>
                        Meet the music <ArrowRight size={16} />
                    </button>
                </div>
                <Sparkles className="absolute right-[10%] top-[5px] rotate-[12deg] text-[#ff6138] max-[760px]:bottom-[38px] max-[760px]:right-[9px] max-[760px]:top-auto" size={28} aria-hidden="true" />
            </section>

            <footer className="relative mx-auto flex min-h-[135px] w-[min(100%-64px,1240px)] items-start justify-between border-t border-white/15 py-7 pb-[50px] max-[760px]:min-h-[155px] max-[760px]:w-[min(100%-36px,600px)] max-[760px]:flex-wrap max-[760px]:gap-[14px] max-[760px]:pt-[23px] max-[390px]:w-[min(100%-28px,600px)]">
                <button className="inline-flex cursor-pointer items-center border-0 bg-transparent p-0 text-inherit [&_.tunes-logo]:text-[#f3f0e9] [&_.tunes-logo-mark]:h-[2.2rem] [&_.tunes-logo-mark]:w-[2.2rem] [&_.tunes-logo-word]:text-[0.95rem] max-[390px]:[&_.tunes-logo]:gap-2 max-[390px]:[&_.tunes-logo-mark]:h-[1.9rem] max-[390px]:[&_.tunes-logo-mark]:w-[1.9rem] max-[390px]:[&_.tunes-logo-word]:text-[0.8rem]" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Tunes home">
                    <TunesLogo />
                </button>
                <p className="mx-auto mt-2 ml-6 text-[11px] text-[#8d8a82] max-[760px]:order-3 max-[760px]:m-0 max-[760px]:w-full">A little more feeling in every frequency.</p>
                <button className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent py-[5px] text-[11px] text-[#c9c6be]" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Back to top <ArrowDown className="rotate-180" size={14} />
                </button>
                <span className="absolute bottom-[21px] right-0 text-[8px] tracking-[0.14em] text-[#69675f] max-[760px]:bottom-5 max-[760px]:left-0 max-[760px]:right-auto max-[760px]:text-[7px]">© 2026 TUNES · MADE FOR THE LOVE OF SOUND</span>
            </footer>
        </main>
    );
}
