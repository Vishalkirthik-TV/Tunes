/**
 * Zustand Player Store
 * Global state management for the music player.
 * Handles current track, playback state, queue, and volume.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JamendoTrack } from "@/services/jamendo";

interface PlayerState {
    // State
    currentTrack: JamendoTrack | null;
    isPlaying: boolean;
    queue: JamendoTrack[];
    isShuffleEnabled: boolean;
    isRepeatEnabled: boolean;
    volume: number;
    progress: number;
    duration: number;

    // Actions
    setTrack: (track: JamendoTrack) => void;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setQueue: (tracks: JamendoTrack[]) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    playTrackFromQueue: (track: JamendoTrack, queue?: JamendoTrack[]) => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setVolume: (volume: number) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            // Initial state
            currentTrack: null,
            isPlaying: false,
            queue: [],
            isShuffleEnabled: false,
            isRepeatEnabled: false,
            volume: 0.7,
            progress: 0,
            duration: 0,

            // Actions
            setTrack: (track) => set({ currentTrack: track, isPlaying: true, progress: 0 }),

            play: () => set({ isPlaying: true }),

            pause: () => set({ isPlaying: false }),

            togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

            setQueue: (tracks) => set({ queue: tracks }),

            toggleShuffle: () => set((state) => ({ isShuffleEnabled: !state.isShuffleEnabled })),

            toggleRepeat: () => set((state) => ({ isRepeatEnabled: !state.isRepeatEnabled })),

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
                const { queue, currentTrack, isShuffleEnabled } = get();
                if (queue.length === 0 || !currentTrack) return;

                if (isShuffleEnabled) {
                    if (queue.length === 1) {
                        set({ isPlaying: false });
                        return;
                    }

                    const candidates = queue.filter((track) => track.id !== currentTrack.id);
                    const nextTrack = candidates[Math.floor(Math.random() * candidates.length)];
                    set({ currentTrack: nextTrack, isPlaying: true, progress: 0 });
                    return;
                }

                const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
                const isLastTrack = currentIndex === queue.length - 1;
                if (isLastTrack) {
                    set({ isPlaying: false });
                    return;
                }

                const nextIndex = currentIndex < 0 || isLastTrack ? 0 : currentIndex + 1;
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
        }),
        {
            name: "tunes-player",
            partialize: (state) => ({
                currentTrack: state.currentTrack,
                queue: state.queue,
                volume: state.volume,
                progress: state.progress,
                isShuffleEnabled: state.isShuffleEnabled,
                isRepeatEnabled: state.isRepeatEnabled,
            }),
        },
    ),
);
