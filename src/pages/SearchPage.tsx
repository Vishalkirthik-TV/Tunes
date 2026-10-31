/**
 * SearchPage Component
 * Real-time search with debounce for finding music via Jamendo API.
 * Displays results as a card grid with empty state handling.
 * Genre tiles navigate to dedicated genre pages.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchTracks } from "@/services/jamendo";
import type { JamendoTrack } from "@/services/jamendo";
import TrackCard from "@/components/TrackCard";
import TopBar from "@/components/layout/TopBar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IoSearch } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<JamendoTrack[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus search input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Debounced search
    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            const tracks = await searchTracks(searchQuery, 30);
            setResults(tracks);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new debounce timer (400ms)
        debounceTimer.current = setTimeout(() => {
            handleSearch(value);
        }, 400);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    // Genre browse categories — now navigate to genre pages
    const genres = [
        { name: "Pop", color: "from-pink-500 to-rose-600" },
        { name: "Rock", color: "from-red-600 to-orange-600" },
        { name: "Electronic", color: "from-blue-500 to-cyan-500" },
        { name: "Jazz", color: "from-amber-500 to-yellow-600" },
        { name: "Hip Hop", color: "from-purple-600 to-violet-600" },
        { name: "Classical", color: "from-emerald-500 to-teal-600" },
        { name: "Chill", color: "from-sky-400 to-indigo-500" },
        { name: "Ambient", color: "from-slate-500 to-zinc-600" },
        { name: "Metal", color: "from-gray-700 to-zinc-900" },
        { name: "Country", color: "from-amber-600 to-orange-700" },
        { name: "Blues", color: "from-blue-700 to-indigo-900" },
        { name: "Folk", color: "from-orange-400 to-amber-600" },
        { name: "Latin", color: "from-red-500 to-pink-500" },
        { name: "Soul", color: "from-purple-500 to-pink-600" },
        { name: "Reggae", color: "from-green-500 to-yellow-500" },
        { name: "Indie", color: "from-teal-500 to-emerald-600" },
    ];

    return (
        <div className="min-h-full">
            <TopBar />

            <div className="px-3 sm:px-6 pb-8">
                {/* Search Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Search</h1>
                    <div className="relative max-w-md">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="What do you want to listen to?"
                            value={query}
                            onChange={handleQueryChange}
                            className="pl-10 bg-muted/50 border-0 h-12 rounded-full text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-foreground"
                        />
                    </div>
                </motion.div>

                {/* Search Results */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
                        >
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="p-3">
                                    <Skeleton className="aspect-square rounded-md mb-3" />
                                    <Skeleton className="h-4 w-3/4 mb-1.5" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </motion.div>
                    ) : hasSearched && results.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <p className="text-xl font-semibold mb-2">
                                No results found for "{query}"
                            </p>
                            <p className="text-muted-foreground">
                                Try searching for something else
                            </p>
                        </motion.div>
                    ) : results.length > 0 ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold mb-4">
                                Results for "{query}"
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                                {results.map((track) => (
                                    <TrackCard key={track.id} track={track} tracks={results} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* Browse genres when no search */
                        <motion.div
                            key="browse"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold mb-4">Browse all</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                                {genres.map((genre) => (
                                    <motion.div
                                        key={genre.name}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`bg-gradient-to-br ${genre.color} rounded-lg p-3 sm:p-4 h-24 sm:h-32 cursor-pointer relative overflow-hidden`}
                                        onClick={() => navigate(`/genre/${genre.name.toLowerCase()}`)}
                                    >
                                        <span className="text-base sm:text-lg font-bold text-white">
                                            {genre.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
