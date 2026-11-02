/**
 * ArtistCard Component
 * Circular artist card for horizontal browsing rows (like Spotify's "Popular Artists").
 * Shows circular image and artist name with hover animation.
 */

import { useState } from "react";
import { IoMusicalNotes, IoPlaySharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { JamendoArtist } from "@/services/jamendo";

interface ArtistCardProps {
    artist: JamendoArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    const [failedImage, setFailedImage] = useState<string | null>(null);

    const initials = artist.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
            <Link
                to={`/artist/${artist.id}`}
                aria-label={`View ${artist.name}`}
                className="artist-card group block cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <div className="relative mb-3 aspect-square w-full">
                    <div className="absolute inset-0 overflow-hidden rounded-full bg-muted shadow-lg ring-1 ring-border/70">
                        {artist.image && failedImage !== artist.image ? (
                            <img
                                src={artist.image}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={() => setFailedImage(artist.image)}
                            />
                        ) : (
                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-800 to-slate-950">
                                <IoMusicalNotes
                                    aria-hidden="true"
                                    className="absolute -right-3 -top-3 h-28 w-28 rotate-12 text-white/10"
                                />
                                <span className="relative text-4xl font-semibold tracking-wide text-white drop-shadow-md">
                                    {initials || <IoMusicalNotes aria-hidden="true" />}
                                </span>
                            </div>
                        )}
                    </div>

                    <span
                        aria-hidden="true"
                        className="artist-card-play absolute bottom-2 right-2 z-10 flex h-11 w-11 translate-y-1 items-center justify-center rounded-full border-2 border-background bg-tunes text-tunes-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    >
                        <IoPlaySharp className="ml-0.5 h-4 w-4" />
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{artist.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Artist</p>
                </div>
            </Link>
        </motion.div>
    );
}
