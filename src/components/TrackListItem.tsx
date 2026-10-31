/**
 * TrackListItem Component
 * Row-based track display for artist/album detail views.
 * Includes like button and album link.
 */

import { usePlayerStore } from "@/stores/playerStore";
import type { JamendoTrack } from "@/services/jamendo";
import { Button } from "@/components/ui/button";
import { IoPlaySharp, IoPauseSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LikeButton from "@/components/LikeButton";

interface TrackListItemProps {
    track: JamendoTrack;
    index: number;
    tracks?: JamendoTrack[];
    showAlbum?: boolean;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function TrackListItem({ track, index, tracks, showAlbum = true }: TrackListItemProps) {
    const navigate = useNavigate();
    const { currentTrack, isPlaying, playTrackFromQueue, togglePlay } =
        usePlayerStore();

    const isCurrentTrack = currentTrack?.id === track.id;
    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

    const handlePlay = () => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrackFromQueue(track, tracks);
        }
    };

    return (
        <motion.div
            className={`group grid items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${isCurrentTrack ? "bg-muted/30" : ""
                }`}
            style={{
                gridTemplateColumns: showAlbum
                    ? "32px 1fr minmax(0, 1fr) auto auto"
                    : "32px 1fr auto auto",
            }}
            onClick={handlePlay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
        >
            {/* Index / Play icon */}
            <div className="flex items-center justify-center w-8">
                <span
                    className={`text-sm tabular-nums group-hover:hidden ${isCurrentTrack ? "text-tunes" : "text-muted-foreground"
                        }`}
                >
                    {index + 1}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden group-hover:flex w-8 h-8 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlay();
                    }}
                >
                    {isCurrentlyPlaying ? (
                        <IoPauseSharp className="w-4 h-4" />
                    ) : (
                        <IoPlaySharp className="w-4 h-4 ml-0.5" />
                    )}
                </Button>
            </div>

            {/* Track info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <img
                    src={track.image}
                    alt={track.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <p
                        className={`text-sm font-medium truncate ${isCurrentTrack ? "text-tunes" : "text-foreground"
                            }`}
                    >
                        {track.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        <span
                            className="hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/artist/${track.artist_id}`);
                            }}
                        >
                            {track.artist_name}
                        </span>
                    </p>
                </div>
            </div>

            {/* Album name (optional) */}
            {showAlbum && track.album_name && (
                <p
                    className="text-xs text-muted-foreground truncate hidden md:block hover:underline cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/album/${track.album_id}`);
                    }}
                >
                    {track.album_name}
                </p>
            )}

            {/* Like Button */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <LikeButton track={track} />
            </div>

            {/* Duration */}
            <span className="text-sm text-muted-foreground tabular-nums">
                {formatDuration(track.duration)}
            </span>
        </motion.div>
    );
}
