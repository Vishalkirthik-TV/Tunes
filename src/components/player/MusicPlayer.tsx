/**
 * MusicPlayer Component
 * Desktop: Full 3-column bar (track info | controls+progress | volume).
 * Mobile: Compact mini-bar with track info, play/pause, and thin progress line.
 * Sits above the MobileNav on small screens.
 */

import { useRef, useEffect, useCallback } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    IoPlaySharp,
    IoPauseSharp,
    IoPlaySkipForwardSharp,
    IoPlaySkipBackSharp,
    IoVolumeMediumSharp,
    IoVolumeMuteSharp,
    IoShuffleSharp,
    IoRepeatSharp,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import LikeButton from "@/components/LikeButton";

function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
    const {
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        togglePlay,
        nextTrack,
        previousTrack,
        setVolume,
        setProgress,
        setDuration,
        pause,
    } = usePlayerStore();

    const audioRef = useRef<HTMLAudioElement>(null);

    // Sync play/pause with audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(() => pause());
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack, pause]);

    // Update volume
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) audio.volume = volume;
    }, [volume]);

    // Audio event handlers
    const handleTimeUpdate = useCallback(() => {
        const audio = audioRef.current;
        if (audio) setProgress(audio.currentTime);
    }, [setProgress]);

    const handleLoadedMetadata = useCallback(() => {
        const audio = audioRef.current;
        if (audio) setDuration(audio.duration);
    }, [setDuration]);

    const handleEnded = useCallback(() => {
        nextTrack();
    }, [nextTrack]);

    const handleSeek = useCallback(
        (value: number[]) => {
            const audio = audioRef.current;
            if (audio && value[0] !== undefined) {
                audio.currentTime = value[0];
                setProgress(value[0]);
            }
        },
        [setProgress]
    );

    const handleVolumeChange = useCallback(
        (value: number[]) => {
            if (value[0] !== undefined) setVolume(value[0]);
        },
        [setVolume]
    );

    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

    // ── Empty state ──────────────────────────────────────
    if (!currentTrack) {
        return (
            <>
                {/* Desktop empty */}
                <footer className="hidden md:flex h-[90px] border-t border-border bg-card/95 backdrop-blur-lg items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        Select a track to start listening
                    </p>
                </footer>
                {/* Mobile empty — just a thin line */}
                <footer className="md:hidden h-[56px] border-t border-border bg-card/95 backdrop-blur-lg flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                        Select a track to start listening
                    </p>
                </footer>
            </>
        );
    }

    return (
        <>
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={currentTrack.audio}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* ══════════════════════════════════════════════════
                MOBILE MINI-PLAYER (< md)
                ══════════════════════════════════════════════════ */}
            <footer className="md:hidden relative bg-card/95 backdrop-blur-lg border-t border-border">
                {/* Progress line at top of mini-player */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-muted">
                    <div
                        className="h-full bg-tunes transition-[width] duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="flex items-center gap-3 px-3 py-2">
                    {/* Track art + info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTrack.id}
                            className="flex items-center gap-3 flex-1 min-w-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <img
                                src={currentTrack.image}
                                alt={currentTrack.name}
                                className="w-10 h-10 rounded object-cover shadow-md flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate leading-tight">
                                    {currentTrack.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                                    {currentTrack.artist_name}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Like + Play/Pause */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <LikeButton track={currentTrack} size="sm" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 p-0"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <IoPauseSharp className="w-6 h-6" />
                            ) : (
                                <IoPlaySharp className="w-6 h-6 ml-0.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </footer>

            {/* ══════════════════════════════════════════════════
                DESKTOP FULL PLAYER (>= md)
                ══════════════════════════════════════════════════ */}
            <footer className="hidden md:grid h-[90px] border-t border-border bg-card/95 backdrop-blur-lg px-4 grid-cols-3 items-center gap-4">
                {/* ── Left: Track Info ────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTrack.id}
                        className="flex items-center gap-3 min-w-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <img
                            src={currentTrack.image}
                            alt={currentTrack.name}
                            className="w-14 h-14 rounded-md object-cover shadow-lg"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate hover:underline cursor-pointer">
                                {currentTrack.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {currentTrack.artist_name}
                            </p>
                        </div>
                        <LikeButton track={currentTrack} />
                    </motion.div>
                </AnimatePresence>

                {/* ── Center: Controls + Progress ──────────────── */}
                <div className="flex flex-col items-center gap-1 max-w-[722px] w-full mx-auto">
                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                            <IoShuffleSharp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-foreground"
                            onClick={previousTrack}
                        >
                            <IoPlaySkipBackSharp className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-full bg-foreground text-background hover:scale-105 transition-transform"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <IoPauseSharp className="w-5 h-5" />
                            ) : (
                                <IoPlaySharp className="w-5 h-5 ml-0.5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-foreground"
                            onClick={nextTrack}
                        >
                            <IoPlaySkipForwardSharp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                            <IoRepeatSharp className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
                            {formatTime(progress)}
                        </span>
                        <Slider
                            value={[progress]}
                            max={duration || 100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="flex-1 cursor-pointer [&_[data-slot=slider-range]]:bg-foreground hover:[&_[data-slot=slider-range]]:bg-tunes [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:opacity-0 hover:[&_[data-slot=slider-thumb]]:opacity-100 [&_[data-slot=slider-track]]:h-1"
                        />
                        <span className="text-[11px] text-muted-foreground w-10 tabular-nums">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* ── Right: Volume ────────────────────────────── */}
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                    >
                        {volume === 0 ? (
                            <IoVolumeMuteSharp className="w-4 h-4" />
                        ) : (
                            <IoVolumeMediumSharp className="w-4 h-4" />
                        )}
                    </Button>
                    <Slider
                        value={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-24 cursor-pointer [&_[data-slot=slider-range]]:bg-foreground hover:[&_[data-slot=slider-range]]:bg-tunes [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:opacity-0 hover:[&_[data-slot=slider-thumb]]:opacity-100 [&_[data-slot=slider-track]]:h-1"
                    />
                </div>
            </footer>
        </>
    );
}
