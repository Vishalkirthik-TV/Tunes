/**
 * TopBar Component
 * Header bar with back/forward navigation displayed at the top of main content.
 * Shows the Tunes logo on mobile (sidebar is hidden).
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-10 flex items-center gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-card/80 to-transparent backdrop-blur-sm">
            {/* Tunes logo — mobile only */}
            <div
                className="flex items-center gap-2 cursor-pointer md:hidden"
                onClick={() => navigate("/")}
            >
                <div className="w-7 h-7 bg-tunes rounded-full flex items-center justify-center">
                    <span className="text-tunes-foreground font-bold text-xs">T</span>
                </div>
                <span className="text-lg font-bold tracking-tight">Tunes</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 ml-auto md:ml-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 hover:bg-black/60 w-8 h-8"
                    onClick={() => navigate(-1)}
                >
                    <IoChevronBack className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/40 hover:bg-black/60 w-8 h-8"
                    onClick={() => navigate(1)}
                >
                    <IoChevronForward className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
