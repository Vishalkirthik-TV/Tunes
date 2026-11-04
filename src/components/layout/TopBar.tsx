/**
 * TopBar Component
 * Header bar with back/forward navigation displayed at the top of main content.
 * Shows the Tunes logo on mobile (sidebar is hidden).
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import TunesLogo from "@/components/TunesLogo";

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <header className="app-topbar sticky top-0 z-10 flex items-center gap-3">
            {/* Tunes logo — mobile only */}
            <button
                type="button"
                className="tunes-topbar-brand cursor-pointer md:hidden"
                onClick={() => navigate("/listen")}
                aria-label="Tunes home"
            >
                <TunesLogo />
            </button>

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
