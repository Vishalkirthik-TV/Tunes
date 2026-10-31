/**
 * PlaylistPage Component
 * Spotify-style playlist detail page with header, track table, and actions.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistTracks } from "@/services/jamendo";
import type { JamendoTrack } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import TrackListItem from "@/components/TrackListItem";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { IoPlaySharp, IoShuffleSharp, IoMusicalNotes } from "react-icons/io5";
import { motion } from "framer-motion";

function formatTotalDuration(tracks: JamendoTrack[]): string {
    const total = tracks.reduce((sum, t) => sum + t.duration, 0);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    if (hrs > 0) return `about ${hrs} hr ${mins} min`;
    return `${mins} min`;
}

export default function PlaylistPage() {
    const { playlistId } = useParams<{ playlistId: string }>();
    const [tracks, setTracks] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrackFromQueue } = usePlayerStore();

    useEffect(() => {
        if (!playlistId) return;

        async function fetchData() {
            setLoading(true);
            try {
                const data = await getPlaylistTracks(playlistId!);
                // Playlist tracks come nested, flatten
                const flatTracks = data.flatMap((item: any) =>
                    item.tracks ? item.tracks : [item]
                );
                setTracks(flatTracks);
            } catch (error) {
                console.error("Failed to fetch playlist:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [playlistId]);

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

    return (
        <div className="page-root min-h-full">
            <TopBar />

            {/* ── Playlist Header ──────────────────────── */}
            <motion.div
                className="detail-hero flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-3 sm:px-6 pb-6 bg-gradient-to-b from-indigo-600/30 to-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Playlist Cover */}
                <div className="detail-art playlist-art w-36 h-36 sm:w-56 sm:h-56 rounded-md overflow-hidden shadow-2xl flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center">
                    {tracks.length > 0 && tracks[0].image ? (
                        <div className="grid grid-cols-2 w-full h-full">
                            {tracks.slice(0, 4).map((t, i) => (
                                <img
                                    key={i}
                                    src={t.image}
                                    alt={t.name}
                                    className="w-full h-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <IoMusicalNotes className="w-20 h-20 text-white/60" />
                    )}
                </div>

                {/* Playlist Info */}
                <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide">Playlist</p>
                    <h1 className="text-2xl sm:text-5xl font-extrabold mt-1 mb-2 sm:mb-3">
                        Playlist
                    </h1>
                    <div className="flex items-center gap-1 text-sm flex-wrap justify-center sm:justify-start text-muted-foreground">
                        <span>{tracks.length} {tracks.length === 1 ? "song" : "songs"}</span>
                        {tracks.length > 0 && (
                            <>
                                <span>·</span>
                                <span>{formatTotalDuration(tracks)}</span>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Action Buttons ──────────────────────────── */}
            <div className="detail-actions flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
                <Button
                    size="lg"
                    className="rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground font-semibold h-14 w-14 p-0 hover:scale-105 transition-transform shadow-lg"
                    onClick={handlePlayAll}
                    disabled={loading || tracks.length === 0}
                >
                    <IoPlaySharp className="w-6 h-6 ml-0.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 text-muted-foreground hover:text-foreground"
                    onClick={handleShuffle}
                    disabled={loading || tracks.length === 0}
                >
                    <IoShuffleSharp className="w-6 h-6" />
                </Button>
            </div>

            <Separator className="mx-3 sm:mx-6" />

            {/* ── Track List ─────────────────────────────── */}
            <div className="px-1 sm:px-6 py-3 sm:py-4">
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
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
                ) : tracks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        This playlist is empty
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
        </div>
    );
}
