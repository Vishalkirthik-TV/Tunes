/**
 * AlbumCard Component
 * Square album card for grid/row display.
 * Shows album art, name, artist name, and year.
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoPlaySharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { JamendoAlbum } from "@/services/jamendo";

interface AlbumCardProps {
    album: JamendoAlbum;
}

export default function AlbumCard({ album }: AlbumCardProps) {
    const navigate = useNavigate();
    const year = album.releasedate ? new Date(album.releasedate).getFullYear() : "";

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }}>
            <Card
                className="group relative bg-card/50 hover:bg-muted/50 border-0 p-3 cursor-pointer transition-colors duration-200 overflow-hidden"
                onClick={() => navigate(`/album/${album.id}`)}
            >
                {/* Album Art */}
                <div className="relative aspect-square mb-3 rounded-md overflow-hidden shadow-lg">
                    {album.image ? (
                        <img
                            src={album.image}
                            alt={album.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                            <span className="text-2xl font-bold text-muted-foreground">♪</span>
                        </div>
                    )}

                    {/* Play Button Overlay */}
                    <Button
                        size="icon"
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-tunes hover:bg-tunes/90 text-tunes-foreground shadow-xl hover:scale-105 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/album/${album.id}`);
                        }}
                    >
                        <IoPlaySharp className="w-5 h-5 ml-0.5" />
                    </Button>
                </div>

                {/* Album Info */}
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{album.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {year && `${year} · `}
                        <span
                            className="hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/artist/${album.artist_id}`);
                            }}
                        >
                            {album.artist_name}
                        </span>
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
