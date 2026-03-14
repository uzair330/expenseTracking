"use client";

import { Home, PlusCircle, BarChart3, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/add", label: "Add", icon: PlusCircle },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 safe-area-bottom">
            <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                            <span className="text-[10px] font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
