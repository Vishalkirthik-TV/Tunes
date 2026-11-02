/**
 * ArtistCard Component
 * Circular artist card for horizontal browsing rows (like Spotify's "Popular Artists").
 * Shows circular image and artist name with hover animation.
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoMusicalNotes, IoPlaySharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { JamendoArtist } from "@/services/jamendo";

interface ArtistCardProps {
    artist: JamendoArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const navigate = useNavigate();
    const [failedImage, setFailedImage] = useState<string | null>(null);

    const initials = artist.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
            <Card
                className="music-card artist-card group relative bg-card/50 hover:bg-muted/50 border-0 p-3 cursor-pointer transition-colors duration-200 overflow-hidden"
                onClick={() => navigate(`/artist/${artist.id}`)}
            >
                {/* Circular Artist Image */}
                <div className="relative aspect-square mb-4 rounded-full overflow-hidden shadow-xl mx-auto ring-1 ring-border/70">
                    {artist.image && failedImage !== artist.image ? (
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={() => setFailedImage(artist.image)}
                        />
                    ) : (
                        <div className="relative flex w-full h-full items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-400/30 via-teal-700/40 to-slate-950">
                            <IoMusicalNotes
                                aria-hidden="true"
                                className="absolute -right-2 -top-3 h-24 w-24 rotate-12 text-white/10"
                            />
                            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/15 text-2xl font-bold tracking-wide text-white shadow-inner backdrop-blur-sm">
                                {initials || <IoMusicalNotes aria-hidden="true" />}
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
