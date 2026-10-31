/**
 * Zustand Library Store
 * Manages liked songs, saved albums, and followed artists.
 * Persisted to localStorage for cross-session survival.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JamendoTrack } from "@/services/jamendo";

interface SavedAlbum {
    id: string;
    name: string;
    image: string;
    artist_name: string;
    artist_id: string;
}

interface FollowedArtist {
    id: string;
    name: string;
    image: string;
}

interface LibraryState {
    // State
    likedSongs: JamendoTrack[];
    savedAlbums: SavedAlbum[];
    followedArtists: FollowedArtist[];

    // Liked Songs Actions
    toggleLike: (track: JamendoTrack) => void;
    isLiked: (trackId: string) => boolean;

    // Album Actions
    toggleSaveAlbum: (album: SavedAlbum) => void;
    isAlbumSaved: (albumId: string) => boolean;

    // Artist Actions
    toggleFollowArtist: (artist: FollowedArtist) => void;
    isArtistFollowed: (artistId: string) => boolean;
}

const libraryStorageKey = "tunes-library";
const legacyLibraryStorageKey = "tevify-library";

if (typeof window !== "undefined" && window.localStorage.getItem(libraryStorageKey) === null) {
    const legacyLibrary = window.localStorage.getItem(legacyLibraryStorageKey);
    if (legacyLibrary !== null) {
        window.localStorage.setItem(libraryStorageKey, legacyLibrary);
    }
}

export const useLibraryStore = create<LibraryState>()(
    persist(
        (set, get) => ({
            likedSongs: [],
            savedAlbums: [],
            followedArtists: [],

            // ── Liked Songs ─────────────────────────
            toggleLike: (track) => {
                const { likedSongs } = get();
                const exists = likedSongs.some((t) => t.id === track.id);
                if (exists) {
                    set({ likedSongs: likedSongs.filter((t) => t.id !== track.id) });
                } else {
                    set({ likedSongs: [track, ...likedSongs] });
                }
            },

            isLiked: (trackId) => {
                return get().likedSongs.some((t) => t.id === trackId);
            },

            // ── Saved Albums ────────────────────────
            toggleSaveAlbum: (album) => {
                const { savedAlbums } = get();
                const exists = savedAlbums.some((a) => a.id === album.id);
                if (exists) {
                    set({ savedAlbums: savedAlbums.filter((a) => a.id !== album.id) });
                } else {
                    set({ savedAlbums: [album, ...savedAlbums] });
                }
            },

            isAlbumSaved: (albumId) => {
                return get().savedAlbums.some((a) => a.id === albumId);
            },

            // ── Followed Artists ────────────────────
            toggleFollowArtist: (artist) => {
                const { followedArtists } = get();
                const exists = followedArtists.some((a) => a.id === artist.id);
                if (exists) {
                    set({ followedArtists: followedArtists.filter((a) => a.id !== artist.id) });
                } else {
                    set({ followedArtists: [artist, ...followedArtists] });
                }
            },

            isArtistFollowed: (artistId) => {
                return get().followedArtists.some((a) => a.id === artistId);
            },
        }),
        {
            name: libraryStorageKey,
        }
    )
);
