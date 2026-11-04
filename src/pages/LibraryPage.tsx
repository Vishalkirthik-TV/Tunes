/**
 * LibraryPage Component
 * Browse liked songs, saved albums, and followed artists.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoArrowForward,
    IoDisc,
    IoHeart,
    IoMusicalNotes,
    IoPerson,
    IoPlaySharp,
} from "react-icons/io5";
import { useLibraryStore } from "@/stores/libraryStore";
import { usePlayerStore } from "@/stores/playerStore";
import TopBar from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";

type FilterTab = "all" | "playlists" | "artists" | "albums";

export default function LibraryPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const { likedSongs, savedAlbums, followedArtists } = useLibraryStore();
    const { playTrackFromQueue } = usePlayerStore();

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        { key: "all", label: "All", count: likedSongs.length + savedAlbums.length + followedArtists.length },
        { key: "playlists", label: "Playlists", count: likedSongs.length > 0 ? 1 : 0 },
        { key: "artists", label: "Artists", count: followedArtists.length },
        { key: "albums", label: "Albums", count: savedAlbums.length },
    ];

    const handlePlayLiked = () => {
        if (likedSongs.length > 0) {
            playTrackFromQueue(likedSongs[0], likedSongs);
        }
    };

    const showLikedSongs = activeTab === "all" || activeTab === "playlists";
    const showAlbums = activeTab === "all" || activeTab === "albums";
    const showArtists = activeTab === "all" || activeTab === "artists";
    const hasVisibleItems =
        (activeTab === "all" && likedSongs.length + savedAlbums.length + followedArtists.length > 0) ||
        (activeTab === "playlists" && likedSongs.length > 0) ||
        (showAlbums && savedAlbums.length > 0) ||
        (showArtists && followedArtists.length > 0);

    return (
        <div className="page-root min-h-full">
            <TopBar />

            <div className="page-content px-3 pb-8 sm:px-6">
                <motion.header
                    className="mb-7 flex flex-col justify-between gap-5 pt-4 sm:mb-9 sm:flex-row sm:items-end sm:pt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <div>
                        <p className="mb-2 text-xs font-extrabold tracking-widest text-tunes">YOUR MUSIC, YOUR WORLD</p>
                        <h1 className="m-0 text-4xl font-bold leading-none tracking-tighter sm:text-5xl">Your Library</h1>
                        <p className="mb-0 mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                            The artists, albums, and songs you’ve made your own.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start rounded-full border border-border/70 bg-card/60 px-3.5 py-2 text-xs text-muted-foreground sm:self-auto">
                        <IoMusicalNotes className="h-4 w-4 text-tunes" aria-hidden="true" />
                        <span><strong className="font-semibold text-foreground">{likedSongs.length + savedAlbums.length + followedArtists.length}</strong> saved</span>
                    </div>
                </motion.header>

                <div className="mb-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Library filters">
                    {tabs.map((tab) => {
                        const selected = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border/70 bg-card/40 text-muted-foreground hover:border-tunes/40 hover:bg-accent/70 hover:text-foreground"
                                    }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                                <span className={`text-xs tabular-nums ${selected ? "text-background/70" : "text-muted-foreground/75"}`}>{tab.count}</span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        {hasVisibleItems ? (
                            <div className="space-y-8">
                                {showLikedSongs && likedSongs.length > 0 && (
                                    <article className="group relative min-h-40 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-tunes/25 via-card to-card shadow-xl">
                                        <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-tunes/15 blur-3xl" aria-hidden="true" />
                                        <div className="relative flex min-h-40 items-center gap-4 p-4 sm:gap-6 sm:p-5">
                                            <button
                                                type="button"
                                                className="relative grid h-24 w-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-tunes via-rose-700 to-violet-900 text-white shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28"
                                                onClick={() => navigate("/liked")}
                                                aria-label="Open Liked Songs"
                                            >
                                                {likedSongs.length > 0 ? (
                                                    <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                                                        {likedSongs.slice(0, 4).map((track) => (
                                                            track.image
                                                                ? <img key={track.id} className="h-full w-full object-cover" src={track.image} alt="" />
                                                                : <div key={track.id} className="grid h-full w-full place-items-center bg-tunes/40"><IoMusicalNotes className="h-5 w-5 text-white/80" /></div>
                                                        ))}
                                                        {likedSongs.length < 4 && (
                                                            <div className="absolute inset-0 grid place-items-center bg-black/35">
                                                                <IoHeart className="h-9 w-9 drop-shadow-lg" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <IoHeart className="h-10 w-10 drop-shadow-md" />
                                                )}
                                            </button>
                                            <button type="button" className="relative z-10 min-w-0 flex-1 cursor-pointer text-left" onClick={() => navigate("/liked")}>
                                                <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-tunes">
                                                    <IoHeart className="h-3 w-3" aria-hidden="true" /> YOUR MIX
                                                </span>
                                                <span className="block truncate text-xl font-bold tracking-tight text-white sm:text-2xl">Liked Songs</span>
                                                <span className="mt-1 block text-xs text-white/65">{likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"} saved</span>
                                                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 transition-colors group-hover:text-white">
                                                    Open playlist <IoArrowForward className="h-3.5 w-3.5" aria-hidden="true" />
                                                </span>
                                            </button>
                                            {likedSongs.length > 0 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    aria-label="Play liked songs"
                                                    className="absolute bottom-4 right-4 z-10 h-10 w-10 rounded-full bg-tunes text-white shadow-lg transition-transform hover:scale-105 hover:bg-tunes/90"
                                                    onClick={handlePlayLiked}
                                                >
                                                    <IoPlaySharp className="ml-0.5 h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </article>
                                )}

                                {(showAlbums && savedAlbums.length > 0) || (showArtists && followedArtists.length > 0) ? (
                                    <section className="m-0">
                                        {activeTab === "all" && (
                                            <div className="mb-4 flex items-end justify-between gap-3">
                                                <div>
                                                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">YOUR COLLECTION</p>
                                                    <h2 className="m-0 text-lg font-semibold tracking-tight">Saved to your library</h2>
                                                </div>
                                                <span className="pb-0.5 text-xs text-muted-foreground">{savedAlbums.length + followedArtists.length} items</span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                                            {showAlbums && savedAlbums.map((album) => (
                                                <article key={album.id} className="group w-full max-w-52 min-w-0 rounded-xl border border-transparent bg-card/35 p-2.5 transition-all duration-200 hover:-translate-y-1 hover:border-border hover:bg-card/80 sm:p-3">
                                                    <button type="button" className="relative mb-3 block aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-muted text-left shadow-lg" onClick={() => navigate(`/album/${album.id}`)} aria-label={`Open album ${album.name}`}>
                                                        {album.image ? (
                                                            <img src={album.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                                        ) : (
                                                            <span className="grid h-full w-full place-items-center bg-gradient-to-br from-tunes/60 to-card"><IoDisc className="h-10 w-10 text-white/70" /></span>
                                                        )}
                                                    </button>
                                                    <button type="button" className="block w-full truncate text-left text-sm font-semibold text-foreground hover:text-tunes" onClick={() => navigate(`/album/${album.id}`)}>{album.name}</button>
                                                    <p className="mb-0 mt-1 truncate text-xs text-muted-foreground">Album <span className="px-0.5 text-tunes">·</span> {album.artist_name}</p>
                                                </article>
                                            ))}

                                            {showArtists && followedArtists.map((artist) => (
                                                <article key={artist.id} className="group w-full max-w-52 min-w-0 rounded-xl border border-transparent bg-card/35 p-2.5 transition-all duration-200 hover:-translate-y-1 hover:border-border hover:bg-card/80 sm:p-3">
                                                    <button type="button" className="relative mb-3 block aspect-square w-full cursor-pointer overflow-hidden rounded-full bg-muted text-left shadow-lg" onClick={() => navigate(`/artist/${artist.id}`)} aria-label={`Open artist ${artist.name}`}>
                                                        {artist.image ? (
                                                            <img src={artist.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                                        ) : (
                                                            <span className="grid h-full w-full place-items-center bg-gradient-to-br from-tunes/60 to-card"><IoPerson className="h-10 w-10 text-white/70" /></span>
                                                        )}
                                                    </button>
                                                    <button type="button" className="block w-full truncate text-left text-sm font-semibold text-foreground hover:text-tunes" onClick={() => navigate(`/artist/${artist.id}`)}>{artist.name}</button>
                                                    <p className="mb-0 mt-1 text-xs text-muted-foreground">Artist</p>
                                                </article>
                                            ))}
                                        </div>
                                    </section>
                                ) : null}
                            </div>
                        ) : (
                            <div className="relative isolate flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-card/35 px-5 py-10 text-center">
                                <div className="absolute -top-20 h-48 w-48 rounded-full bg-tunes/10 blur-3xl" aria-hidden="true" />
                                <span className="relative mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-tunes/20 bg-tunes/10 text-tunes">
                                    {activeTab === "albums" ? <IoDisc className="h-6 w-6" /> : activeTab === "artists" ? <IoPerson className="h-6 w-6" /> : <IoMusicalNotes className="h-6 w-6" />}
                                </span>
                                <h2 className="relative m-0 text-lg font-semibold tracking-tight">
                                    {activeTab === "albums" ? "No saved albums yet" : activeTab === "artists" ? "No followed artists yet" : "Your library is waiting"}
                                </h2>
                                <p className="relative mb-5 mt-2 max-w-sm text-sm text-muted-foreground">
                                    {activeTab === "albums"
                                        ? "Save albums you love and they’ll find a home here."
                                        : activeTab === "artists"
                                            ? "Follow artists to keep their music close."
                                            : activeTab === "playlists"
                                                ? "Like tracks to build your personal playlist."
                                                : "Save albums, follow artists, or like songs to start your collection."}
                                </p>
                                <Button
                                    type="button"
                                    className="relative rounded-full bg-tunes px-5 font-semibold text-white hover:bg-tunes/90"
                                    onClick={() => navigate("/listen")}
                                >
                                    Discover music <IoArrowForward className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
