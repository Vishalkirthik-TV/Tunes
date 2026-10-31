/**
 * LikedSongsPage Component
 * Spotify's iconic Liked Songs page with purple gradient header.
 * Shows all user's liked songs from the library store.
 */

import { useLibraryStore } from "@/stores/libraryStore";
import { usePlayerStore } from "@/stores/playerStore";
import TrackListItem from "@/components/TrackListItem";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IoPlaySharp, IoShuffleSharp, IoHeart, IoMusicalNotes } from "react-icons/io5";
import { motion } from "framer-motion";

function formatTotalDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} hr ${mins} min`;
    return `${mins} min`;
}

export default function LikedSongsPage() {
    const { likedSongs } = useLibraryStore();
    const { playTrackFromQueue } = usePlayerStore();

    const totalDuration = likedSongs.reduce((sum, t) => sum + t.duration, 0);

    const handlePlayAll = () => {
        if (likedSongs.length > 0) {
            playTrackFromQueue(likedSongs[0], likedSongs);
        }
    };

    const handleShuffle = () => {
        if (likedSongs.length > 0) {
            const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
            playTrackFromQueue(shuffled[0], shuffled);
        }
    };

    return (
        <div className="page-root min-h-full">
            <TopBar />

            {/* ── Liked Songs Header (Purple Gradient) ──── */}
            <motion.div
                className="detail-hero flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-3 sm:px-6 pb-6 sm:pb-8 pt-6 bg-gradient-to-b from-indigo-600/50 via-purple-600/30 to-transparent -mt-[60px] pt-[80px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Gradient Icon */}
                <div className="detail-art w-36 h-36 sm:w-56 sm:h-56 rounded-md overflow-hidden shadow-2xl flex-shrink-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-400 flex items-center justify-center">
                    <IoHeart className="w-14 h-14 sm:w-20 sm:h-20 text-white" />
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide">Playlist</p>
                    <h1 className="text-3xl sm:text-6xl font-extrabold mt-1 mb-2 sm:mb-3">
                        Liked Songs
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
                        {likedSongs.length > 0 && `, ${formatTotalDuration(totalDuration)}`}
                    </p>
                </div>
            </motion.div>

            {/* ── Action Buttons ──────────────────────────── */}
            {likedSongs.length > 0 && (
                <>
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
                    </div>

                    <Separator className="mx-3 sm:mx-6" />
                </>
            )}

            {/* ── Track List ─────────────────────────────── */}
            <div className="px-1 sm:px-6 py-3 sm:py-4">
                {likedSongs.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <IoMusicalNotes className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl font-semibold mb-2">
                            Songs you like will appear here
                        </p>
                        <p className="text-muted-foreground">
                            Save songs by tapping the heart icon
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-1">
                        {likedSongs.map((track, index) => (
                            <TrackListItem
                                key={track.id}
                                track={track}
                                index={index}
                                tracks={likedSongs}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
