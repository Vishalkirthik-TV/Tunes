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
function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <motion.h2
            className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.h2>
    );
}

export default function HomePage() {
    const [popularTracks, setPopularTracks] = useState<JamendoTrack[]>([]);
    const [chillTracks, setChillTracks] = useState<JamendoTrack[]>([]);
    const [electronicTracks, setElectronicTracks] = useState<JamendoTrack[]>([]);
    const [popularArtists, setPopularArtists] = useState<JamendoArtist[]>([]);
    const [popularAlbums, setPopularAlbums] = useState<JamendoAlbum[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-full">
            <TopBar />

            <div className="px-3 sm:px-6 pb-8">
                {/* Greeting */}
                <motion.h1
                    className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {greeting}
                </motion.h1>

                {/* Popular Tracks (Grid) */}
                <section className="mb-6 sm:mb-8">
                    <SectionTitle>Popular right now</SectionTitle>
                    {loading ? (
                        <TrackGridSkeleton count={10} />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {popularTracks.map((track) => (
                                <TrackCard key={track.id} track={track} tracks={popularTracks} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Popular Artists (Horizontal Scroll) */}
                <section className="mb-6 sm:mb-8">
                    <SectionTitle>Popular artists</SectionTitle>
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
                <section className="mb-6 sm:mb-8">
                    <SectionTitle>Popular albums</SectionTitle>
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
                <section className="mb-6 sm:mb-8">
                    <SectionTitle>Chill vibes</SectionTitle>
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
                <section className="mb-6 sm:mb-8">
                    <SectionTitle>Electronic beats</SectionTitle>
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
