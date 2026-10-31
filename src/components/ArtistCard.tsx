/**
 * ArtistCard Component
 * Circular artist card for horizontal browsing rows (like Spotify's "Popular Artists").
 * Shows circular image and artist name with hover animation.
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoPlaySharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { JamendoArtist } from "@/services/jamendo";

interface ArtistCardProps {
    artist: JamendoArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const navigate = useNavigate();

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
            <Card
                className="music-card artist-card group relative bg-card/50 hover:bg-muted/50 border-0 p-3 cursor-pointer transition-colors duration-200 overflow-hidden"
                onClick={() => navigate(`/artist/${artist.id}`)}
            >
                {/* Circular Artist Image */}
                <div className="relative aspect-square mb-4 rounded-full overflow-hidden shadow-xl mx-auto">
                    {artist.image ? (
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                            <span className="text-3xl font-bold text-muted-foreground">
                                {artist.name.charAt(0)}
                            </span>
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <Button
                        size="icon"
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground shadow-xl hover:scale-105 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/artist/${artist.id}`);
                        }}
                    >
                        <IoPlaySharp className="w-5 h-5 ml-0.5" />
                    </Button>
                </div>

                {/* Artist Info */}
                <div className="text-center min-w-0">
                    <p className="text-sm font-semibold truncate">{artist.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Artist</p>
                </div>
            </Card>
        </motion.div>
    );
}
