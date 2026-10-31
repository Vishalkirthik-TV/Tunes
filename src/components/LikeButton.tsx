/**
 * LikeButton Component
 * Heart icon toggle for liking/unliking tracks.
 * Integrates with libraryStore for persistence.
 */

import { useLibraryStore } from "@/stores/libraryStore";
import type { JamendoTrack } from "@/services/jamendo";
import { Button } from "@/components/ui/button";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
    track: JamendoTrack;
    size?: "sm" | "md";
    className?: string;
}

export default function LikeButton({ track, size = "sm", className = "" }: LikeButtonProps) {
    const { toggleLike, isLiked } = useLibraryStore();
    const liked = isLiked(track.id);

    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`${btnSize} p-0 ${className}`}
            onClick={(e) => {
                e.stopPropagation();
                toggleLike(track);
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {liked ? (
                    <motion.div
                        key="liked"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <IoHeart className={`${iconSize} text-tunes`} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="unliked"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <IoHeartOutline className={`${iconSize} text-muted-foreground hover:text-foreground transition-colors`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
