/**
 * GenrePage Component
 * Genre/category detail page showing tracks for a specific genre tag.
 * Gradient header with genre name and grid of tracks.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTracksByTag } from "@/services/jamendo";
import type { JamendoTrack } from "@/services/jamendo";
import { usePlayerStore } from "@/stores/playerStore";
import TrackCard from "@/components/TrackCard";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IoPlaySharp, IoShuffleSharp } from "react-icons/io5";
import { motion } from "framer-motion";

/** Map genre names to gradient colors */
const genreGradients: Record<string, string> = {
    pop: "from-pink-500 to-rose-600",
    rock: "from-red-600 to-orange-600",
    electronic: "from-blue-500 to-cyan-500",
    jazz: "from-amber-500 to-yellow-600",
    "hip hop": "from-purple-600 to-violet-600",
    hiphop: "from-purple-600 to-violet-600",
    classical: "from-emerald-500 to-teal-600",
    chill: "from-sky-400 to-indigo-500",
    ambient: "from-slate-500 to-zinc-600",
    metal: "from-gray-700 to-zinc-900",
    country: "from-amber-600 to-orange-700",
    rnb: "from-indigo-600 to-purple-700",
    reggae: "from-green-500 to-yellow-500",
    blues: "from-blue-700 to-indigo-900",
    folk: "from-orange-400 to-amber-600",
    latin: "from-red-500 to-pink-500",
    soul: "from-purple-500 to-pink-600",
    punk: "from-green-600 to-lime-500",
    indie: "from-teal-500 to-emerald-600",
};

function getGradient(genre: string): string {
    const key = genre.toLowerCase();
    return genreGradients[key] || "from-emerald-500 to-teal-700";
}

export default function GenrePage() {
    const { genreName } = useParams<{ genreName: string }>();
    const [tracks, setTracks] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrackFromQueue } = usePlayerStore();

    const displayName = genreName
        ? genreName.charAt(0).toUpperCase() + genreName.slice(1)
        : "";

    useEffect(() => {
        if (!genreName) return;

        async function fetchData() {
            setLoading(true);
            try {
                const data = await getTracksByTag(genreName!, 40);
                setTracks(data);
            } catch (error) {
                console.error("Failed to fetch genre tracks:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [genreName]);

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

            {/* ── Genre Header ──────────────────────────── */}
            <motion.div
                className={`detail-hero genre-hero bg-gradient-to-b ${getGradient(genreName || "")} px-3 sm:px-6 pb-6 sm:pb-8 pt-6 -mt-[60px] pt-[80px]`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
                    {displayName}
                </h1>
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

            {/* ── Tracks Grid ────────────────────────────── */}
            <div className="px-3 sm:px-6 pb-8">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="p-3">
                                <Skeleton className="aspect-square rounded-md mb-3" />
                                <Skeleton className="h-4 w-3/4 mb-1.5" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : tracks.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-semibold mb-2">No tracks found</p>
                        <p className="text-muted-foreground">
                            We couldn't find any {displayName} tracks right now
                        </p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        {tracks.map((track) => (
                            <TrackCard key={track.id} track={track} tracks={tracks} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
