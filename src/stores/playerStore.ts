/**
 * Zustand Player Store
 * Global state management for the music player.
 * Handles current track, playback state, queue, and volume.
 */

import { create } from "zustand";
import type { JamendoTrack } from "@/services/jamendo";

interface PlayerState {
    // State
    currentTrack: JamendoTrack | null;
    isPlaying: boolean;
    queue: JamendoTrack[];
    volume: number;
    progress: number;
    duration: number;

    // Actions
    setTrack: (track: JamendoTrack) => void;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setQueue: (tracks: JamendoTrack[]) => void;
    playTrackFromQueue: (track: JamendoTrack, queue?: JamendoTrack[]) => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setVolume: (volume: number) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    // Initial state
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 0.7,
    progress: 0,
    duration: 0,

    // Actions
    setTrack: (track) => set({ currentTrack: track, isPlaying: true, progress: 0 }),

    play: () => set({ isPlaying: true }),

    pause: () => set({ isPlaying: false }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setQueue: (tracks) => set({ queue: tracks }),

    playTrackFromQueue: (track, queue) => {
        const updates: Partial<PlayerState> = {
            currentTrack: track,
            isPlaying: true,
            progress: 0,
        };
        if (queue) updates.queue = queue;
        set(updates);
    },

    nextTrack: () => {
        const { queue, currentTrack } = get();
        if (queue.length === 0 || !currentTrack) return;
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % queue.length;
        set({ currentTrack: queue[nextIndex], isPlaying: true, progress: 0 });
    },

    previousTrack: () => {
        const { queue, currentTrack } = get();
        if (queue.length === 0 || !currentTrack) return;
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
        set({ currentTrack: queue[prevIndex], isPlaying: true, progress: 0 });
    },

    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

    setProgress: (progress) => set({ progress }),

    setDuration: (duration) => set({ duration }),
}));
