/**
 * MobileNav Component
 * Bottom navigation bar for mobile screens (visible only on small screens).
 * Includes Home, Search, and Library tabs.
 */

import { useLocation, useNavigate } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { BiLibrary, BiSolidBookContent } from "react-icons/bi";

const navItems = [
    { label: "Home", path: "/", icon: GoHomeFill, inactiveIcon: GoHome },
    { label: "Search", path: "/search", icon: IoSearch, inactiveIcon: IoSearchOutline },
    { label: "Library", path: "/library", icon: BiSolidBookContent, inactiveIcon: BiLibrary },
];

export default function MobileNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="md:hidden flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-lg py-2 px-4">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = isActive ? item.icon : item.inactiveIcon;

                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"
                            }`}
                    >
                        <Icon className="w-6 h-6" />
                        {item.label}
                    </button>
                );
            })}
        </nav>
    );
}
