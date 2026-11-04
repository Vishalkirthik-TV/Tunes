/**
 * Sidebar Component
 * Left navigation sidebar with Tunes branding, main nav links, and library section.
 * Uses shadcn/ui Button and react-icons.
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useLibraryStore } from "@/stores/libraryStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearch, IoSearchOutline, IoHeart, IoAdd } from "react-icons/io5";
import { BiLibrary } from "react-icons/bi";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TunesLogo from "@/components/TunesLogo";

const navItems = [
    {
        label: "Home",
        path: "/listen",
        icon: GoHomeFill,
        inactiveIcon: GoHome,
    },
    {
        label: "Search",
        path: "/search",
        icon: IoSearch,
        inactiveIcon: IoSearchOutline,
    },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { likedSongs, savedAlbums, followedArtists } = useLibraryStore();

    const libraryItemCount = savedAlbums.length + followedArtists.length;

    return (
        <aside className="app-sidebar hidden md:flex flex-col h-full">
            {/* ── Top Nav Card ──────────────────────────────── */}
            <div className="bg-card rounded-lg p-4">
                {/* Logo */}
                <motion.button
                    type="button"
                    className="mb-6 flex w-full items-center border-0 bg-transparent px-2 text-left cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/")}
                    aria-label="Tunes home"
                >
                    <TunesLogo />
                </motion.button>

                {/* Nav Items */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = isActive ? item.icon : item.inactiveIcon;

                        return (
                            <motion.div key={item.path} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                                <Button
                                    variant="ghost"
                                    className={cn("w-full justify-start gap-4 text-base font-semibold h-12 px-3", isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={() => navigate(item.path)}
                                >
                                    <Icon className="w-6 h-6" />
                                    {item.label}
                                </Button>
                            </motion.div>
                        );
                    })}
                </nav>
            </div>

            {/* ── Library Card ──────────────────────────────── */}
            <div className="bg-card rounded-lg p-4 flex-1 overflow-auto flex flex-col">
                {/* Library Header */}
                <div
                    className="flex items-center justify-between mb-4 cursor-pointer group"
                    onClick={() => navigate("/library")}
                >
                    <div className={`flex items-center gap-3 transition-colors ${location.pathname === "/library"
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                        <BiLibrary className="w-6 h-6" />
                        <span className="font-semibold">Your Library</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                        <IoAdd className="w-5 h-5" />
                    </Button>
                </div>

                <Separator className="mb-3" />

                {/* Library Content */}
                <ScrollArea className="flex-1">
                    <div className="space-y-1 pr-2">
                        {/* Liked Songs */}
                        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.1 }}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-3 h-14 px-2 ${location.pathname === "/liked" ? "bg-muted/50" : ""
                                    }`}
                                onClick={() => navigate("/liked")}
                            >
                                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-rose-700 flex items-center justify-center flex-shrink-0">
                                    <IoHeart className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="text-sm font-medium truncate text-tunes">Liked Songs</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        Playlist · {likedSongs.length} songs
                                    </p>
                                </div>
                            </Button>
                        </motion.div>

                        {/* Saved Albums */}
                        {savedAlbums.map((album) => (
                            <motion.div key={album.id} whileHover={{ x: 2 }} transition={{ duration: 0.1 }}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 h-14 px-2 ${location.pathname === `/album/${album.id}` ? "bg-muted/50" : ""
                                        }`}
                                    onClick={() => navigate(`/album/${album.id}`)}
                                >
                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                        {album.image ? (
                                            <img src={album.image} alt={album.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs">♪</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{album.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            Album · {album.artist_name}
                                        </p>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}

                        {/* Followed Artists */}
                        {followedArtists.map((artist) => (
                            <motion.div key={artist.id} whileHover={{ x: 2 }} transition={{ duration: 0.1 }}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 h-14 px-2 ${location.pathname === `/artist/${artist.id}` ? "bg-muted/50" : ""
                                        }`}
                                    onClick={() => navigate(`/artist/${artist.id}`)}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                                        {artist.image ? (
                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs">{artist.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{artist.name}</p>
                                        <p className="text-xs text-muted-foreground">Artist</p>
                                    </div>
                                </Button>
                            </motion.div>
                        ))}

                        {/* Empty State */}
                        {likedSongs.length === 0 && libraryItemCount === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6">
                                <p className="text-sm font-semibold mb-1">Create your first playlist</p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    It's easy, we'll help you
                                </p>
                                <Button
                                    size="sm"
                                    className="rounded-full bg-foreground text-background hover:scale-105 transition-transform font-semibold text-xs px-4"
                                    onClick={() => navigate("/search")}
                                >
                                    Browse music
                                </Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
}
