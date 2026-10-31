/**
 * AlbumPage Component
 * Spotify-style album detail page with gradient header,
 * album info, action buttons, and numbered tracklist.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlbum, getAlbumTracks } from "@/services/jamendo";
import type { JamendoTrack, JamendoAlbum } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import { useLibraryStore } from "@/stores/libraryStore";
import TrackListItem from "@/components/TrackListItem";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { IoPlaySharp, IoShuffleSharp, IoHeartOutline, IoHeart } from "react-icons/io5";
import { motion } from "framer-motion";

function formatTotalDuration(tracks: JamendoTrack[]): string {
    const total = tracks.reduce((sum, t) => sum + t.duration, 0);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    if (hrs > 0) return `${hrs} hr ${mins} min`;
    return `${mins} min`;
}

export default function AlbumPage() {
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();
    const [album, setAlbum] = useState<JamendoAlbum | null>(null);
    const [tracks, setTracks] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrackFromQueue } = usePlayerStore();
    const { toggleSaveAlbum, isAlbumSaved } = useLibraryStore();

    useEffect(() => {
        if (!albumId) return;

        async function fetchData() {
            setLoading(true);
            try {
                const [albumData, albumTracks] = await Promise.all([
                    getAlbum(albumId!),
                    getAlbumTracks(albumId!),
                ]);
                setAlbum(albumData);
                // Album tracks endpoint returns nested, flatten if needed
                const flatTracks = albumTracks.flatMap((item: any) =>
                    item.tracks ? item.tracks : [item]
                );
                setTracks(flatTracks);
            } catch (error) {
                console.error("Failed to fetch album:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [albumId]);

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

    const saved = album ? isAlbumSaved(album.id) : false;

    if (loading) {
        return (
            <div className="min-h-full">
                <TopBar />
                <div className="px-6 pb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
                        <Skeleton className="w-48 h-48 sm:w-56 sm:h-56 rounded-md" />
                        <div className="flex-1">
                            <Skeleton className="h-3 w-16 mb-2" />
                            <Skeleton className="h-10 w-64 mb-4" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3">
                            <Skeleton className="w-8 h-4" />
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

    if (!album) {
        return (
            <div className="min-h-full">
                <TopBar />
                <div className="flex items-center justify-center py-20">
                    <p className="text-xl text-muted-foreground">Album not found</p>
                </div>
            </div>
        );
    }

    const year = album.releasedate ? new Date(album.releasedate).getFullYear() : "";

    return (
        <div className="min-h-full">
            <TopBar />

            {/* ── Album Header with Gradient ───────────────── */}
            <motion.div
                className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-3 sm:px-6 pb-6 bg-gradient-to-b from-muted/60 to-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Album Art */}
                <div className="w-36 h-36 sm:w-56 sm:h-56 rounded-md overflow-hidden shadow-2xl flex-shrink-0">
                    {album.image ? (
                        <img
                            src={album.image}
                            alt={album.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                            <span className="text-5xl">♪</span>
                        </div>
                    )}
                </div>

                {/* Album Info */}
                <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide">Album</p>
                    <h1 className="text-2xl sm:text-5xl font-extrabold mt-1 mb-2 sm:mb-3">
                        {album.name}
                    </h1>
                    <div className="flex items-center gap-1 text-sm flex-wrap justify-center sm:justify-start">
                        <span
                            className="font-semibold hover:underline cursor-pointer"
                            onClick={() => navigate(`/artist/${album.artist_id}`)}
                        >
                            {album.artist_name}
                        </span>
                        {year && (
                            <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{year}</span>
                            </>
                        )}
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                            {tracks.length} {tracks.length === 1 ? "song" : "songs"},{" "}
                            {formatTotalDuration(tracks)}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* ── Action Buttons ──────────────────────────── */}
            <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
                <Button
                    size="lg"
                    className="rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground font-semibold h-14 w-14 p-0 hover:scale-105 transition-transform shadow-lg"
                    onClick={handlePlayAll}
                >
                    <IoPlaySharp className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
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
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12"
                    onClick={() => {
                        if (album) {
                            toggleSaveAlbum({
                                id: album.id,
                                name: album.name,
                                image: album.image,
                                artist_name: album.artist_name,
                                artist_id: album.artist_id,
                            });
                        }
                    }}
                >
                    {saved ? (
                        <IoHeart className="w-6 h-6 text-tunes" />
                    ) : (
                        <IoHeartOutline className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                    )}
                </Button>
            </div>

            <Separator className="mx-3 sm:mx-6" />

            {/* ── Track List ─────────────────────────────── */}
            <div className="px-1 sm:px-6 py-3 sm:py-4">
                {tracks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No tracks found for this album
                    </p>
                ) : (
                    <div className="space-y-1">
                        {tracks.map((track, index) => (
                            <TrackListItem
                                key={track.id}
                                track={track}
                                index={index}
                                tracks={tracks}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Footer ─────────────────────────────────── */}
            {album.releasedate && (
                <div className="px-3 sm:px-6 pb-8 text-xs text-muted-foreground">
                    <p>{new Date(album.releasedate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</p>
                    <p className="mt-1">© {year} {album.artist_name}. Music provided by Jamendo (Creative Commons)</p>
                </div>
            )}
        </div>
    );
}
