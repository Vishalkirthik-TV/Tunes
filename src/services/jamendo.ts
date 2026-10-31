/**
 * Jamendo API Service
 * Handles all communication with the Jamendo REST API for music discovery and playback.
 * Music provided by Jamendo (Creative Commons).
 */

const BASE_URL = "https://api.jamendo.com/v3.0";
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;

// ─── Types ─────────────────────────────────────────────────────────
export interface JamendoTrack {
    id: string;
    name: string;
    duration: number;
    artist_id: string;
    artist_name: string;
    album_name: string;
    album_id: string;
    image: string;
    audio: string;
    audiodownload: string;
    releasedate: string;
}

export interface JamendoArtist {
    id: string;
    name: string;
    image: string;
    joindate: string;
    website: string;
}

export interface JamendoAlbum {
    id: string;
    name: string;
    artist_id: string;
    artist_name: string;
    image: string;
    releasedate: string;
    zip: string;
}

export interface JamendoPlaylist {
    id: string;
    name: string;
    creationdate: string;
    user_id: string;
    user_name: string;
    zip: string;
}

interface JamendoResponse<T> {
    headers: {
        status: string;
        code: number;
        error_message: string;
        results_count: number;
    };
    results: T[];
}

// ─── Helper ────────────────────────────────────────────────────────
async function fetchJamendo<T>(
    endpoint: string,
    params: Record<string, string> = {}
): Promise<T[]> {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("format", "jsonpretty");

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Jamendo API error: ${response.status} ${response.statusText}`);
    }

    const data: JamendoResponse<T> = await response.json();

    if (data.headers.code !== 0) {
        throw new Error(`Jamendo API: ${data.headers.error_message}`);
    }

    return data.results;
}

// ─── Track API Functions ───────────────────────────────────────────

/** Fetch popular/trending tracks */
export async function getPopularTracks(limit = 20): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("tracks", {
        order: "popularity_month",
        limit: String(limit),
        imagesize: "400",
        include: "musicinfo",
    });
}

/** Search tracks by name */
export async function searchTracks(
    query: string,
    limit = 20
): Promise<JamendoTrack[]> {
    if (!query.trim()) return [];
    return fetchJamendo<JamendoTrack>("tracks", {
        search: query,
        limit: String(limit),
        imagesize: "400",
    });
}

/** Fetch tracks by a specific artist */
export async function getArtistTracks(
    artistId: string,
    limit = 50
): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("tracks", {
        artist_id: artistId,
        limit: String(limit),
        imagesize: "400",
        order: "popularity_total",
    });
}

/** Fetch artist details */
export async function getArtist(artistId: string): Promise<JamendoArtist | null> {
    const results = await fetchJamendo<JamendoArtist>("artists", {
        id: artistId,
        imagesize: "400",
    });
    return results[0] ?? null;
}

/** Fetch tracks by genre/tag */
export async function getTracksByTag(
    tag: string,
    limit = 20
): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("tracks", {
        tags: tag,
        limit: String(limit),
        imagesize: "400",
        order: "popularity_month",
    });
}

/** Fetch new/recent tracks */
export async function getNewReleases(limit = 20): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("tracks", {
        order: "releasedate_desc",
        limit: String(limit),
        imagesize: "400",
    });
}

// ─── Album API Functions ───────────────────────────────────────────

/** Fetch single album details */
export async function getAlbum(albumId: string): Promise<JamendoAlbum | null> {
    const results = await fetchJamendo<JamendoAlbum>("albums", {
        id: albumId,
        imagesize: "600",
    });
    return results[0] ?? null;
}

/** Fetch tracks of an album */
export async function getAlbumTracks(albumId: string): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("albums/tracks", {
        id: albumId,
        imagesize: "400",
    });
}

/** Fetch popular albums */
export async function getPopularAlbums(limit = 20): Promise<JamendoAlbum[]> {
    return fetchJamendo<JamendoAlbum>("albums", {
        order: "popularity_month",
        limit: String(limit),
        imagesize: "400",
    });
}

/** Fetch artist's albums (discography) */
export async function getArtistAlbums(
    artistId: string,
    limit = 20
): Promise<JamendoAlbum[]> {
    return fetchJamendo<JamendoAlbum>("albums", {
        artist_id: artistId,
        limit: String(limit),
        imagesize: "400",
        order: "releasedate_desc",
    });
}

/** Search albums by name */
export async function searchAlbums(
    query: string,
    limit = 20
): Promise<JamendoAlbum[]> {
    if (!query.trim()) return [];
    return fetchJamendo<JamendoAlbum>("albums", {
        namesearch: query,
        limit: String(limit),
        imagesize: "400",
    });
}

// ─── Playlist API Functions ────────────────────────────────────────

/** Fetch popular playlists */
export async function getPopularPlaylists(limit = 20): Promise<JamendoPlaylist[]> {
    return fetchJamendo<JamendoPlaylist>("playlists", {
        order: "creationdate_desc",
        limit: String(limit),
    });
}

/** Fetch playlist tracks */
export async function getPlaylistTracks(playlistId: string): Promise<JamendoTrack[]> {
    return fetchJamendo<JamendoTrack>("playlists/tracks", {
        id: playlistId,
        imagesize: "400",
    });
}

// ─── Artist Discovery ──────────────────────────────────────────────

/** Fetch popular artists */
export async function getPopularArtists(limit = 20): Promise<JamendoArtist[]> {
    return fetchJamendo<JamendoArtist>("artists", {
        order: "popularity_month",
        limit: String(limit),
        imagesize: "400",
    });
}
