/**
 * AppLayout Component
 * Main application layout: left sidebar + scrollable main content + fixed bottom player.
 */

import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import MusicPlayer from "@/components/player/MusicPlayer";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout() {
    return (
        <div className="app-shell h-screen flex flex-col overflow-hidden bg-background">
            {/* ── Main Area: Sidebar + Content ─────────────── */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                {/* ── Main Content ────────────────────────────── */}
                <main className="app-main flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* ── Bottom Player ─────────────────────────────── */}
            <MusicPlayer />

            {/* ── Mobile Navigation ─────────────────────────── */}
            <MobileNav />
        </div>
    );
}
