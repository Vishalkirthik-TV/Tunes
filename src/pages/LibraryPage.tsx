/**
 * LibraryPage Component
 * "Your Library" page — shows liked songs, saved albums, and followed artists.
 * Filter tabs for switching between content types.
 */

import { useNavigate } from "react-router-dom";
import { useLibraryStore } from "@/stores/libraryStore";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    IoHeart,
    IoMusicalNotes,
    IoDisc,
    IoPerson,
    IoPlaySharp,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePlayerStore } from "@/stores/playerStore";

type FilterTab = "all" | "playlists" | "artists" | "albums";

export default function LibraryPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const { likedSongs, savedAlbums, followedArtists } = useLibraryStore();
    const { playTrackFromQueue } = usePlayerStore();

    const tabs: { key: FilterTab; label: string }[] = [
        { key: "all", label: "All" },
        { key: "playlists", label: "Playlists" },
        { key: "artists", label: "Artists" },
        { key: "albums", label: "Albums" },
    ];

    const handlePlayLiked = () => {
        if (likedSongs.length > 0) {
            playTrackFromQueue(likedSongs[0], likedSongs);
        }
    };

    return (
        <div className="min-h-full">
            <TopBar />

            <div className="px-3 sm:px-6 pb-8">
                {/* Header */}
                <motion.h1
                    className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Your Library
                </motion.h1>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.key}
                            variant={activeTab === tab.key ? "default" : "secondary"}
                            size="sm"
                            className={`rounded-full text-xs font-semibold px-4 ${activeTab === tab.key
                                ? "bg-foreground text-background"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                                }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                    >
                        {/* Liked Songs Card */}
                        {(activeTab === "all" || activeTab === "playlists") && (
                            <Card
                                className="group flex items-center gap-4 p-3 bg-card/50 hover:bg-muted/50 border-0 cursor-pointer transition-colors"
                                onClick={() => navigate("/liked")}
                            >
                                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-600 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <IoHeart className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-tunes">Liked Songs</p>
                                    <p className="text-xs text-muted-foreground">
                                        Playlist · {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
                                    </p>
                                </div>
                                {likedSongs.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-tunes text-tunes-foreground hover:bg-tunes/90"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayLiked();
                                        }}
                                    >
                                        <IoPlaySharp className="w-4 h-4 ml-0.5" />
                                    </Button>
                                )}
                            </Card>
                        )}

                        {/* Saved Albums */}
                        {(activeTab === "all" || activeTab === "albums") &&
                            savedAlbums.map((album) => (
                                <Card
                                    key={album.id}
                                    className="group flex items-center gap-4 p-3 bg-card/50 hover:bg-muted/50 border-0 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/album/${album.id}`)}
                                >
                                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 shadow-md bg-muted">
                                        {album.image ? (
                                            <img
                                                src={album.image}
                                                alt={album.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IoDisc className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{album.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            Album · {album.artist_name}
                                        </p>
                                    </div>
                                </Card>
                            ))}

                        {/* Followed Artists */}
                        {(activeTab === "all" || activeTab === "artists") &&
                            followedArtists.map((artist) => (
                                <Card
                                    key={artist.id}
                                    className="group flex items-center gap-4 p-3 bg-card/50 hover:bg-muted/50 border-0 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/artist/${artist.id}`)}
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md bg-muted">
                                        {artist.image ? (
                                            <img
                                                src={artist.image}
                                                alt={artist.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IoPerson className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{artist.name}</p>
                                        <p className="text-xs text-muted-foreground">Artist</p>
                                    </div>
                                </Card>
                            ))}

                        {/* Empty States */}
                        {activeTab === "all" &&
                            likedSongs.length === 0 &&
                            savedAlbums.length === 0 &&
                            followedArtists.length === 0 && (
                                <div className="text-center py-12">
                                    <IoMusicalNotes className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-semibold mb-2">
                                        Your library is empty
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Start building your collection by liking songs, saving albums, and following artists
                                    </p>
                                    <Button
                                        className="rounded-full bg-foreground text-background hover:scale-105 transition-transform font-semibold"
                                        onClick={() => navigate("/")}
                                    >
                                        Browse music
                                    </Button>
                                </div>
                            )}

                        {activeTab === "albums" && savedAlbums.length === 0 && (
                            <div className="text-center py-12">
                                <IoDisc className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-base font-semibold mb-1">No saved albums</p>
                                <p className="text-sm text-muted-foreground">
                                    Save albums to see them here
                                </p>
                            </div>
                        )}

                        {activeTab === "artists" && followedArtists.length === 0 && (
                            <div className="text-center py-12">
                                <IoPerson className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-base font-semibold mb-1">No followed artists</p>
                                <p className="text-sm text-muted-foreground">
                                    Follow artists to see them here
                                </p>
                            </div>
                        )}

                        {activeTab === "playlists" && likedSongs.length === 0 && (
                            <div className="text-center py-12">
                                <IoMusicalNotes className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-base font-semibold mb-1">No playlists yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Like songs to build your collection
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
