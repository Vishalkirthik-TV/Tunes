/**
 * ArtistPage Component
 * Displays artist details, popular tracks, discography, and follow button.
 * Uses Jamendo API for artist info, tracks, and albums.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtist, getArtistTracks, getArtistAlbums } from "@/services/jamendo";
import type { JamendoTrack, JamendoArtist, JamendoAlbum } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import { useLibraryStore } from "@/stores/libraryStore";
import TrackListItem from "@/components/TrackListItem";
import AlbumCard from "@/components/AlbumCard";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IoPlaySharp, IoShuffleSharp } from "react-icons/io5";
import { motion } from "framer-motion";

export default function ArtistPage() {
    const { artistId } = useParams<{ artistId: string }>();
    const [artist, setArtist] = useState<JamendoArtist | null>(null);
    const [tracks, setTracks] = useState<JamendoTrack[]>([]);
    const [albums, setAlbums] = useState<JamendoAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllTracks, setShowAllTracks] = useState(false);
    const { playTrackFromQueue } = usePlayerStore();
    const { toggleFollowArtist, isArtistFollowed } = useLibraryStore();

    useEffect(() => {
        if (!artistId) return;

        async function fetchData() {
            setLoading(true);
            setShowAllTracks(false);
            try {
                const [artistData, artistTracks, artistAlbums] = await Promise.all([
                    getArtist(artistId!),
                    getArtistTracks(artistId!),
                    getArtistAlbums(artistId!, 20),
                ]);
                setArtist(artistData);
                setTracks(artistTracks);
                setAlbums(artistAlbums);
            } catch (error) {
                console.error("Failed to fetch artist:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [artistId]);

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            playTrackFromQueue(tracks[0], tracks);
        }
    };

    const handleShuffle = () => {
        if (tracks.length > 0) {
            const shuffled = [...tracks].sort(() => Math.random() - 0.5);
            playTrackFromQueue(shuffled[0], shuffled);
        }
    };

    const followed = artist ? isArtistFollowed(artist.id) : false;
    const displayTracks = showAllTracks ? tracks : tracks.slice(0, 5);

    if (loading) {
        return (
            <div className="page-root min-h-full">
                <TopBar />
                <div className="px-6 pb-8">
                    <div className="flex items-end gap-6 mb-8">
                        <Skeleton className="w-48 h-48 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-12 w-64 mb-4" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3">
                            <Skeleton className="w-8 h-4" />
                            <Skeleton className="w-10 h-10 rounded" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-48 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="page-root min-h-full">
                <TopBar />
                <div className="flex items-center justify-center py-20">
                    <p className="text-xl text-muted-foreground">Artist not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-root min-h-full">
            <TopBar />

            {/* ── Artist Header ─────────────────────────────── */}
            <motion.div
                className="detail-hero flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-3 sm:px-6 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Artist Image */}
                <div className="detail-art artist-art w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl flex-shrink-0 bg-muted">
                    {artist.image ? (
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                            <span className="text-4xl font-bold text-muted-foreground">
                                {artist.name.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Artist Info */}
                <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide">Artist</p>
                    <h1 className="text-3xl sm:text-6xl font-extrabold mt-1 mb-2 sm:mb-3">
                        {artist.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
                        {albums.length > 0 && ` · ${albums.length} ${albums.length === 1 ? "album" : "albums"}`}
                    </p>
                </div>
            </motion.div>

            {/* ── Action Buttons ────────────────────────────── */}
            <div className="detail-actions flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
                <Button
                    size="lg"
                    className="rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground font-semibold h-14 w-14 p-0 hover:scale-105 transition-transform shadow-lg"
                    onClick={handlePlayAll}
                >
                    <IoPlaySharp className="w-6 h-6 ml-0.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 text-muted-foreground hover:text-foreground"
                    onClick={handleShuffle}
                >
                    <IoShuffleSharp className="w-6 h-6" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full text-xs font-semibold px-6 h-8 ${followed
                        ? "border-tunes text-tunes hover:bg-tunes/10"
                        : "border-muted-foreground/50 text-foreground hover:border-foreground"
                        }`}
                    onClick={() => {
                        toggleFollowArtist({
                            id: artist.id,
                            name: artist.name,
                            image: artist.image,
                        });
                    }}
                >
                    {followed ? "Following" : "Follow"}
                </Button>
            </div>

            <Separator className="mx-3 sm:mx-6" />

            {/* ── Popular Tracks ──────────────────────────── */}
            <div className="px-1 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 px-2 sm:px-4">Popular</h2>
                {tracks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No tracks found for this artist
                    </p>
                ) : (
                    <>
                        <div className="space-y-1">
                            {displayTracks.map((track, index) => (
                                <TrackListItem
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    tracks={tracks}
                                    showAlbum={false}
                                />
                            ))}
                        </div>
                        {tracks.length > 5 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground font-semibold mt-2 ml-4"
                                onClick={() => setShowAllTracks(!showAllTracks)}
                            >
                                {showAllTracks ? "Show less" : "See more"}
                            </Button>
                        )}
                    </>
                )}
            </div>

            {/* ── Discography ────────────────────────────── */}
            {albums.length > 0 && (
                <div className="px-3 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Discography</h2>
                    <ScrollArea className="w-full">
                        <div className="flex gap-4 pb-4">
                            {albums.map((album) => (
                                <div key={album.id} className="w-[140px] sm:w-[180px] flex-shrink-0">
                                    <AlbumCard album={album} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
