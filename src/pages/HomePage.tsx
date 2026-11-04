/**
 * HomePage Component
 * Landing page displaying trending/popular tracks, popular artists,
 * new releases, and genre sections from Jamendo.
 */

import { useEffect, useState } from "react";
import { getPopularTracks, getTracksByTag, getPopularArtists, getPopularAlbums } from "@/services/jamendo";
import type { JamendoTrack, JamendoArtist, JamendoAlbum } from "@/services/jamendo";
import TrackCard from "@/components/TrackCard";
import ArtistCard from "@/components/ArtistCard";
import AlbumCard from "@/components/AlbumCard";
import TopBar from "@/components/layout/TopBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5";
import { usePlayerStore } from "@/stores/playerStore";

/** Skeleton grid for loading state */
function TrackGridSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-2 sm:p-3">
                    <Skeleton className="aspect-square rounded-md mb-2 sm:mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-1.5" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );
}

/** Horizontal skeleton row */
function HorizontalSkeleton({ count = 6, circular = false }: { count?: number; circular?: boolean }) {
    return (
        <div className="flex gap-3 sm:gap-4 pb-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-[140px] sm:w-[180px] flex-shrink-0 p-2 sm:p-3">
                    <Skeleton className={`aspect-square mb-2 sm:mb-3 ${circular ? "rounded-full" : "rounded-md"}`} />
                    <Skeleton className="h-4 w-3/4 mb-1.5 mx-auto" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
            ))}
        </div>
    );
}

/** Section heading with animation */
function SectionTitle({ children, eyebrow }: { children: React.ReactNode; eyebrow: string }) {
    return (
        <motion.div
            className="mb-4 flex items-end justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div>
                <p className="m-0 text-[0.56rem] font-extrabold tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
                <h2 className="m-0 mt-[0.3rem] text-[clamp(1.35rem,2.3vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.045em]">{children}</h2>
            </div>
        </motion.div>
    );
}

export default function HomePage() {
    const [popularTracks, setPopularTracks] = useState<JamendoTrack[]>([]);
    const [featuredTrack, setFeaturedTrack] = useState<JamendoTrack | null>(null);
    const [chillTracks, setChillTracks] = useState<JamendoTrack[]>([]);
    const [electronicTracks, setElectronicTracks] = useState<JamendoTrack[]>([]);
    const [popularArtists, setPopularArtists] = useState<JamendoArtist[]>([]);
    const [popularAlbums, setPopularAlbums] = useState<JamendoAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentTrack, isPlaying, playTrackFromQueue, togglePlay } = usePlayerStore();

    useEffect(() => {
        async function fetchData() {
            try {
                const [popular, chill, electronic, artists, albums] = await Promise.all([
                    getPopularTracks(20),
                    getTracksByTag("chill", 10),
                    getTracksByTag("electronic", 10),
                    getPopularArtists(10),
                    getPopularAlbums(10),
                ]);
                setPopularTracks(popular);
                setFeaturedTrack(popular[Math.floor(Math.random() * popular.length)] ?? null);
                setChillTracks(chill);
                setElectronicTracks(electronic);
                setPopularArtists(artists);
                setPopularAlbums(albums);
            } catch (error) {
                console.error("Failed to fetch tracks:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Generate greeting based on time of day
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const isFeaturedSelected = featuredTrack?.id === currentTrack?.id;
    const isFeaturedPlaying = isFeaturedSelected && isPlaying;

    const playFeaturedTrack = () => {
        if (!featuredTrack) return;
        if (isFeaturedSelected) {
            togglePlay();
        } else {
            const featuredQueue = [
                featuredTrack,
                ...popularTracks.filter((track) => track.id !== featuredTrack.id),
            ];
            playTrackFromQueue(featuredTrack, featuredQueue);
        }
    };

    return (
        <div className="page-root min-h-full text-[#f7f1ec]">
            <TopBar className="!px-[clamp(1.5rem,3.8vw,3.75rem)] max-md:!px-4" />

            <div className="page-content px-3 pb-8 pt-5 sm:px-6 sm:pt-8">
                <motion.header
                    className="mb-6 flex items-end justify-between gap-6 md:mb-9"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <div>
                        <p className="m-0 text-[0.65rem] font-extrabold tracking-[0.17em] text-[#ff744c]">A LITTLE SOUND FOR RIGHT NOW</p>
                        <h1 className="m-0 mt-[0.45rem] text-[clamp(2.35rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.065em]">{greeting}</h1>
                    </div>
                    <p className="mb-1 max-w-[17rem] text-right text-sm text-[#b8a9a0] max-md:hidden">Find a feeling. Follow it somewhere new.</p>
                </motion.header>

                <section className="mb-9 md:mb-12" aria-label="Featured track">
                    {loading ? (
                        <div
                            className="relative isolate grid min-h-[18rem] grid-cols-1 items-start overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_82%_55%,rgba(196,79,45,0.24),transparent_35%),linear-gradient(115deg,#261a16_4%,#201815_56%,#2c1b15_100%)] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.19)] md:min-h-[17.5rem] md:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)] md:items-center md:p-7"
                            aria-label="Loading featured track"
                        >
                            <div className="relative z-10">
                                <Skeleton className="mb-4 h-4 w-32" />
                                <Skeleton className="mb-3 h-10 w-3/4" />
                                <Skeleton className="mb-4 h-4 w-1/2" />
                                <Skeleton className="h-12 w-36 rounded-full" />
                            </div>
                            <Skeleton className="absolute bottom-4 right-4 aspect-square w-28 rounded-2xl md:relative md:bottom-auto md:right-auto md:w-[min(66%,15rem)] md:justify-self-center" />
                        </div>
                    ) : featuredTrack ? (
                        <motion.div
                            className="relative isolate grid min-h-[18rem] grid-cols-1 items-start overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_82%_55%,rgba(196,79,45,0.24),transparent_35%),linear-gradient(115deg,#261a16_4%,#201815_56%,#2c1b15_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.19)] after:pointer-events-none after:absolute after:inset-0 after:-z-[1] after:bg-[linear-gradient(90deg,rgba(28,19,16,0.5),transparent_80%)] after:content-[''] md:min-h-[17.5rem] md:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)] md:items-center"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <img className="absolute -right-[5%] -top-1/4 -z-[2] h-[150%] w-[68%] scale-[1.08] object-cover opacity-25 blur-[35px] saturate-90" src={featuredTrack.image} alt="" aria-hidden="true" />
                            <div className="relative z-10 px-6 pb-28 pt-6 sm:px-10 md:px-8 md:py-6">
                                <p className="mb-0 mt-3 text-xs font-medium text-white/70">A good place to start</p>
                                <h2 className="m-0 mt-1 line-clamp-2 max-w-[11ch] overflow-hidden text-ellipsis text-[clamp(2rem,3.2vw,3rem)] font-bold leading-[0.98] tracking-[-0.06em] md:max-w-[15ch]">{featuredTrack.name}</h2>
                                <p className="mb-3 mt-2 text-[0.95rem] text-white/75">{featuredTrack.artist_name}</p>
                                <button
                                    type="button"
                                    className="inline-flex min-h-[2.9rem] items-center gap-2.5 rounded-full border border-white/85 bg-[#fff8f2] pl-4 pr-5 text-[0.82rem] font-bold text-[#261813] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_26px_rgba(0,0,0,0.24)] active:scale-[0.97] motion-reduce:transition-none"
                                    onClick={playFeaturedTrack}
                                    aria-label={`${isFeaturedPlaying ? "Pause" : isFeaturedSelected ? "Resume" : "Play"} ${featuredTrack.name} by ${featuredTrack.artist_name}`}
                                >
                                    {isFeaturedPlaying ? <IoPauseSharp className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" /> : <IoPlaySharp className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />}
                                    <span>{isFeaturedPlaying ? "Pause track" : isFeaturedSelected ? "Keep listening" : "Listen now"}</span>
                                </button>
                                <p className="mb-0 mt-3 max-w-48 text-[0.7rem] text-white/55 max-md:hidden">A little discovery, picked from what’s moving.</p>
                            </div>
                            <div className="absolute -bottom-2 -right-2 grid min-h-[8.5rem] w-[8.5rem] place-items-center opacity-75 md:relative md:bottom-auto md:right-auto md:min-h-[16rem] md:w-auto md:opacity-100" aria-hidden="true">
                                <div className="absolute aspect-square w-[84%] translate-x-[10%] translate-y-[2%] rounded-full border border-white/10 bg-[radial-gradient(circle,#d6532e_0_9%,#17110e_9.5%_11%,transparent_11.5%),repeating-radial-gradient(circle,#41342d_0_1px,#1a1512_2px_4px)] shadow-[0_24px_60px_rgba(0,0,0,0.4)] md:w-[min(74%,15rem)]" />
                                <img className="relative aspect-square w-[69%] -translate-x-[13%] -translate-y-[4%] rounded-xl border border-white/20 object-cover shadow-[0_26px_55px_rgba(0,0,0,0.38)] md:w-[min(62%,13rem)]" src={featuredTrack.image} alt="" />
                                <span className="absolute bottom-[12%] right-[12%] text-right text-[0.42rem] font-extrabold leading-[1.7] tracking-[0.15em] text-white/70 md:bottom-[13%] md:right-[7%] md:text-[0.55rem]">FEATURED<br />THIS WEEK</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="relative isolate flex min-h-64 items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_82%_55%,rgba(196,79,45,0.24),transparent_35%),linear-gradient(115deg,#261a16_4%,#201815_56%,#2c1b15_100%)] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.19)] sm:p-10 md:p-12">
                            <div>
                                <p className="m-0 text-[0.62rem] font-extrabold tracking-[0.17em] text-[#ffd2be]">YOUR NEXT LISTEN</p>
                                <h2 className="mb-2 mt-4 max-w-[18ch] text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.055em]">A new favorite is just around the corner.</h2>
                                <p className="m-0 text-sm text-[#b8a9a0]">We couldn’t load the latest picks right now. Try again in a little while.</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Popular Tracks (Grid) */}
                <section className="mb-11 md:mb-16">
                    <SectionTitle eyebrow="THE HEADLINERS">Popular right now</SectionTitle>
                    {loading ? (
                        <TrackGridSkeleton count={10} />
                    ) : popularTracks.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {popularTracks.map((track) => (
                                <TrackCard key={track.id} track={track} tracks={popularTracks} />
                            ))}
                        </div>
                    ) : (
                        <p className="m-0 py-5 text-sm text-[#b8a9a0]">Popular tracks will be back as soon as we reconnect.</p>
                    )}
                </section>

                {/* Popular Artists (Horizontal Scroll) */}
                <section className="mb-11 md:mb-16">
                    <SectionTitle eyebrow="PEOPLE TO KNOW">Popular artists</SectionTitle>
                    {loading ? (
                        <HorizontalSkeleton count={6} circular />
                    ) : (
                        <ScrollArea className="w-full">
                            <div className="flex gap-3 sm:gap-4 pb-4">
                                {popularArtists.map((artist) => (
                                    <div key={artist.id} className="w-[140px] sm:w-[180px] flex-shrink-0">
                                        <ArtistCard artist={artist} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </section>

                {/* Popular Albums (Horizontal Scroll) */}
                <section className="mb-11 md:mb-16">
                    <SectionTitle eyebrow="MADE TO BE PLAYED TOGETHER">Popular albums</SectionTitle>
                    {loading ? (
                        <HorizontalSkeleton count={6} />
                    ) : (
                        <ScrollArea className="w-full">
                            <div className="flex gap-3 sm:gap-4 pb-4">
                                {popularAlbums.map((album) => (
                                    <div key={album.id} className="w-[140px] sm:w-[180px] flex-shrink-0">
                                        <AlbumCard album={album} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </section>

                {/* Chill section (Horizontal Scroll) */}
                <section className="mb-11 md:mb-16">
                    <SectionTitle eyebrow="SLOW THINGS DOWN">Chill vibes</SectionTitle>
                    {loading ? (
                        <HorizontalSkeleton />
                    ) : (
                        <ScrollArea className="w-full">
                            <div className="flex gap-3 sm:gap-4 pb-4">
                                {chillTracks.map((track) => (
                                    <div key={track.id} className="w-[140px] sm:w-[180px] flex-shrink-0">
                                        <TrackCard track={track} tracks={chillTracks} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </section>

                {/* Electronic section (Horizontal Scroll) */}
                <section className="mb-11 md:mb-16">
                    <SectionTitle eyebrow="FIND YOUR FREQUENCY">Electronic beats</SectionTitle>
                    {loading ? (
                        <HorizontalSkeleton />
                    ) : (
                        <ScrollArea className="w-full">
                            <div className="flex gap-3 sm:gap-4 pb-4">
                                {electronicTracks.map((track) => (
                                    <div key={track.id} className="w-[140px] sm:w-[180px] flex-shrink-0">
                                        <TrackCard track={track} tracks={electronicTracks} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </section>
            </div>
        </div>
    );
}
