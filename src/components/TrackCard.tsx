/**
 * TrackCard Component
 * Reusable music card for displaying tracks in a grid.
 * Shows cover art, track name, artist name, and animated play button overlay.
 */

import { usePlayerStore } from "@/stores/playerStore";
import type { JamendoTrack } from "@/services/jamendo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoPlaySharp, IoPauseSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface TrackCardProps {
    track: JamendoTrack;
    tracks?: JamendoTrack[];
}

export default function TrackCard({ track, tracks }: TrackCardProps) {
    const navigate = useNavigate();
    const { currentTrack, isPlaying, playTrackFromQueue, togglePlay } =
        usePlayerStore();

    const isCurrentTrack = currentTrack?.id === track.id;
    const isCurrentlyPlaying = isCurrentTrack && isPlaying;

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrackFromQueue(track, tracks);
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
            <Card
                className="group relative bg-card/50 hover:bg-muted/50 border-0 p-3 cursor-pointer transition-colors duration-200 overflow-hidden"
                onClick={handlePlay}
            >
                {/* Cover Art */}
                <div className="relative aspect-square mb-3 rounded-md overflow-hidden shadow-lg">
                    <img
                        src={track.image}
                        alt={track.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {/* Play Button Overlay */}
                    <motion.div
                        className="absolute bottom-2 right-2"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            size="icon"
                            className={`w-12 h-12 rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground shadow-xl hover:scale-105 transition-transform opacity-0 group-hover:opacity-100 ${isCurrentlyPlaying ? "opacity-100" : ""
                                }`}
                            onClick={handlePlay}
                        >
                            {isCurrentlyPlaying ? (
                                <IoPauseSharp className="w-5 h-5" />
                            ) : (
                                <IoPlaySharp className="w-5 h-5 ml-0.5" />
                            )}
                        </Button>
                    </motion.div>
                </div>

                {/* Track Info */}
                <div className="min-w-0">
                    <p
                        className={`text-sm font-semibold truncate ${isCurrentTrack ? "text-tunes" : "text-foreground"
                            }`}
                    >
                        {track.name}
                    </p>
                    <p
                        className="text-xs text-muted-foreground truncate mt-0.5 hover:underline cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/artist/${track.artist_id}`);
                        }}
                    >
                        {track.artist_name}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
